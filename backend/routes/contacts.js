import express from 'express';
import { body, validationResult } from 'express-validator';
import { runQuery, getAll, getOne } from '../database/init.js';

const router = express.Router();

// Get all contacts for the authenticated user
router.get('/', async (req, res) => {
  try {
    const contacts = await getAll(
      'SELECT * FROM contacts WHERE user_id = ? AND deleted = 0 ORDER BY firstname ASC',
      [req.user.id]
    );
    
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// Get single contact
router.get('/:id', async (req, res) => {
  try {
    const contact = await getOne(
      'SELECT * FROM contacts WHERE id = ? AND user_id = ? AND deleted = 0',
      [req.params.id, req.user.id]
    );
    
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    
    res.json(contact);
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({ error: 'Failed to fetch contact' });
  }
});

// Create new contact
router.post('/', [
  body('firstname').notEmpty().trim(),
  body('lastname').notEmpty().trim(),
  body('email').optional().isEmail(),
  body('phone').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      firstname,
      lastname,
      image,
      department,
      company,
      phone,
      email,
      address,
      notes,
      frequently_contacted = false,
      starred = false
    } = req.body;

    const result = await runQuery(`
      INSERT INTO contacts (
        user_id, firstname, lastname, image, department, company, 
        phone, email, address, notes, frequently_contacted, starred
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      req.user.id, firstname, lastname, image, department, company,
      phone, email, address, notes, frequently_contacted, starred
    ]);

    const newContact = await getOne('SELECT * FROM contacts WHERE id = ?', [result.id]);
    
    res.status(201).json(newContact);
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ error: 'Failed to create contact' });
  }
});

// Update contact
router.put('/:id', [
  body('firstname').optional().notEmpty().trim(),
  body('lastname').optional().notEmpty().trim(),
  body('email').optional().isEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const contact = await getOne(
      'SELECT * FROM contacts WHERE id = ? AND user_id = ? AND deleted = 0',
      [req.params.id, req.user.id]
    );

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    const updates = req.body;
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updates), req.params.id, req.user.id];

    await runQuery(
      `UPDATE contacts SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?`,
      values
    );

    const updatedContact = await getOne('SELECT * FROM contacts WHERE id = ?', [req.params.id]);
    
    res.json(updatedContact);
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

// Delete contact (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const contact = await getOne(
      'SELECT * FROM contacts WHERE id = ? AND user_id = ? AND deleted = 0',
      [req.params.id, req.user.id]
    );

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    await runQuery(
      'UPDATE contacts SET deleted = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

// Toggle starred status
router.patch('/:id/starred', async (req, res) => {
  try {
    const contact = await getOne(
      'SELECT * FROM contacts WHERE id = ? AND user_id = ? AND deleted = 0',
      [req.params.id, req.user.id]
    );

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    const newStarredStatus = !contact.starred;
    
    await runQuery(
      'UPDATE contacts SET starred = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
      [newStarredStatus, req.params.id, req.user.id]
    );

    const updatedContact = await getOne('SELECT * FROM contacts WHERE id = ?', [req.params.id]);
    
    res.json(updatedContact);
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

export default router;
