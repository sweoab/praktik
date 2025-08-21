import express from 'express';
import { runQuery, getAll, getOne } from '../database/init.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all emails for a user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const emails = await getAll(`
      SELECT 
        e.*,
        sender.firstName || ' ' || sender.lastName as senderName,
        sender.email as senderEmail,
        receiver.firstName || ' ' || receiver.lastName as receiverName,
        receiver.email as receiverEmail
      FROM emails e
      LEFT JOIN users sender ON e.senderId = sender.id
      LEFT JOIN users receiver ON e.receiverId = receiver.id
      WHERE e.senderId = ? OR e.receiverId = ?
      ORDER BY e.created_at DESC
    `, [userId, userId]);

    // Transform emails to match frontend format
    const transformedEmails = emails.map(email => ({
      id: email.id,
      from: email.senderId === userId ? 'Mig' : email.senderName,
      to: email.receiverId === userId ? 'Mig' : email.receiverName,
      subject: email.subject,
      content: email.content,
      message: email.content, // For compatibility
      time: new Date(email.created_at),
      read: email.isRead,
      starred: email.isStarred,
      important: email.isImportant,
      inbox: email.receiverId === userId && !email.isDeleted,
      sent: email.senderId === userId && !email.isDeleted,
      deleted: email.isDeleted,
      senderEmail: email.senderEmail,
      receiverEmail: email.receiverEmail,
      label: email.isImportant ? 'Important' : (email.receiverId === userId ? 'Inbox' : 'Sent') // Default label
    }));

    res.json({
      status: 200,
      message: 'Emails retrieved successfully',
      data: transformedEmails
    });
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).json({
      status: 500,
      message: 'Failed to fetch emails',
      error: error.message
    });
  }
});

// Send a new email
router.post('/send', authenticateToken, async (req, res) => {
  try {
    const senderId = req.user.id;
    const { to, subject, content, message, isImportant = false } = req.body;

    // Use content or message (for compatibility)
    const emailContent = content || message;

    // Validate required fields
    if (!to || !subject || !emailContent) {
      return res.status(400).json({
        status: 400,
        message: 'To, subject, and content are required fields'
      });
    }

    // Find receiver by email
    const receiver = await getOne('SELECT id, email FROM users WHERE email = ?', [to]);
    if (!receiver) {
      return res.status(404).json({
        status: 404,
        message: 'Recipient not found'
      });
    }

    // Insert email into database
    const result = await runQuery(`
      INSERT INTO emails (senderId, receiverId, subject, content, isImportant, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `, [senderId, receiver.id, subject, emailContent, isImportant ? 1 : 0]);

    res.json({
      status: 201,
      message: 'Email sent successfully',
      data: {
        id: result.lastID,
        from: 'Mig',
        to: receiver.email,
        subject,
        content: emailContent,
        message: emailContent,
        time: new Date(),
        read: false,
        starred: false,
        important: isImportant,
        inbox: false,
        sent: true,
        deleted: false,
        label: isImportant ? 'Important' : 'Sent',
        senderEmail: req.user.email,
        receiverEmail: receiver.email
      }
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({
      status: 500,
      message: 'Failed to send email',
      error: error.message
    });
  }
});

// Mark email as read
router.put('/:id/read', authenticateToken, async (req, res) => {
  try {
    const emailId = req.params.id;
    const userId = req.user.id;

    await runQuery(`
      UPDATE emails 
      SET isRead = 1, updated_at = datetime('now')
      WHERE id = ? AND (senderId = ? OR receiverId = ?)
    `, [emailId, userId, userId]);

    res.json({
      status: 200,
      message: 'Email marked as read'
    });
  } catch (error) {
    console.error('Error marking email as read:', error);
    res.status(500).json({
      status: 500,
      message: 'Failed to mark email as read',
      error: error.message
    });
  }
});

// Toggle star status
router.put('/:id/star', authenticateToken, async (req, res) => {
  try {
    const emailId = req.params.id;
    const userId = req.user.id;

    const email = await getOne(`
      SELECT isStarred FROM emails 
      WHERE id = ? AND (senderId = ? OR receiverId = ?)
    `, [emailId, userId, userId]);

    if (!email) {
      return res.status(404).json({
        status: 404,
        message: 'Email not found'
      });
    }

    await runQuery(`
      UPDATE emails 
      SET isStarred = ?, updated_at = datetime('now')
      WHERE id = ?
    `, [email.isStarred ? 0 : 1, emailId]);

    res.json({
      status: 200,
      message: 'Email star status updated',
      data: { starred: !email.isStarred }
    });
  } catch (error) {
    console.error('Error updating star status:', error);
    res.status(500).json({
      status: 500,
      message: 'Failed to update star status',
      error: error.message
    });
  }
});

// Delete email
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const emailId = req.params.id;
    const userId = req.user.id;

    await runQuery(`
      UPDATE emails 
      SET isDeleted = 1, updated_at = datetime('now')
      WHERE id = ? AND (senderId = ? OR receiverId = ?)
    `, [emailId, userId, userId]);

    res.json({
      status: 200,
      message: 'Email deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting email:', error);
    res.status(500).json({
      status: 500,
      message: 'Failed to delete email',
      error: error.message
    });
  }
});

// Get user contacts for compose
router.get('/contacts', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get all users except current user for contacts
    const contacts = await getAll(`
      SELECT id, firstName, lastName, email 
      FROM users 
      WHERE id != ? 
      ORDER BY firstName, lastName
    `, [userId]);

    res.json({
      status: 200,
      message: 'Contacts retrieved successfully',
      data: contacts
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      status: 500,
      message: 'Failed to fetch contacts',
      error: error.message
    });
  }
});

export default router;
