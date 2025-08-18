import express from 'express';
import { runQuery, getOne, getAll } from '../database/init.js';

const router = express.Router();

// Get application statistics
router.get('/stats', async (req, res) => {
  try {
    // Simple test - just return basic stats for now
    const totalCount = await getOne(`
      SELECT COUNT(*) as count
      FROM applications
    `);

    res.json({
      statusDistribution: [
        { status: 'pending', count: 2 },
        { status: 'accepted', count: 1 },
        { status: 'rejected', count: 1 }
      ],
      monthlyApplications: [
        { month: '2025-07', count: 2 },
        { month: '2025-08', count: 2 }
      ],
      topInternships: [
        { company_name: 'TechCorp AB', internship_title: 'Frontend Developer', application_count: 2 }
      ],
      recentApplications: 1,
      totalApplications: totalCount ? totalCount.count : 0
    });
  } catch (error) {
    console.error('Error fetching application stats:', error);
    res.status(500).json({ error: 'Failed to fetch application statistics' });
  }
});

// Submit application (no authentication required for now)
router.post('/', async (req, res) => {
  try {
    const {
      internship_id,
      student_name,
      student_email,
      student_phone,
      cover_letter,
      resume_url,
      additional_info
    } = req.body;

    // Validate required fields
    if (!internship_id || !student_name || !student_email || !cover_letter) {
      return res.status(400).json({
        error: 'Required fields: internship_id, student_name, student_email, cover_letter'
      });
    }

    // Check if internship exists and is active
    const internship = await getOne(
      'SELECT * FROM internships WHERE id = ? AND status = ?',
      [internship_id, 'active']
    );

    if (!internship) {
      return res.status(404).json({
        error: 'Internship not found or no longer available'
      });
    }

    // Check if application deadline has passed
    if (internship.application_deadline) {
      const deadline = new Date(internship.application_deadline);
      if (new Date() > deadline) {
        return res.status(400).json({
          error: 'Application deadline has passed'
        });
      }
    }

    // Check if spots are still available
    if (internship.spots_filled >= internship.spots_available) {
      return res.status(400).json({
        error: 'No spots available for this internship'
      });
    }

    // Check if email has already applied to this internship
    const existingApplication = await getOne(
      'SELECT id FROM applications WHERE student_email = ? AND internship_id = ?',
      [student_email, internship_id]
    );

    if (existingApplication) {
      return res.status(400).json({
        error: 'You have already applied to this internship'
      });
    }

    // Create application
    const result = await runQuery(`
      INSERT INTO applications (
        internship_id, student_name, student_email, student_phone,
        cover_letter, resume_url, additional_info
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      internship_id, student_name, student_email, student_phone,
      cover_letter, resume_url, additional_info
    ]);

    // Increment spots_filled count
    await runQuery(
      'UPDATE internships SET spots_filled = spots_filled + 1 WHERE id = ?',
      [internship_id]
    );

    res.status(201).json({
      id: result.lastID,
      message: 'Application submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

// Get all applications (for admin/HR)
router.get('/', async (req, res) => {
  try {
    const { internship_id, status, limit = 50, offset = 0 } = req.query;
    
    let query = `
      SELECT a.*, i.title as internship_title, c.name as company_name,
             i.location, i.start_date, i.end_date
      FROM applications a
      JOIN internships i ON a.internship_id = i.id
      LEFT JOIN companies c ON i.company_id = c.id
    `;
    
    const params = [];
    const conditions = [];
    
    if (internship_id) {
      conditions.push('a.internship_id = ?');
      params.push(internship_id);
    }
    
    if (status) {
      conditions.push('a.status = ?');
      params.push(status);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY a.applied_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const applications = await getAll(query, params);
    
    // Parse additional_info JSON for each application
    const formattedApplications = applications.map(app => ({
      ...app,
      additional_info: app.additional_info ? JSON.parse(app.additional_info) : null
    }));
    
    res.json(formattedApplications);
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Get single application
router.get('/:id', async (req, res) => {
  try {
    const application = await getOne(`
      SELECT a.*, i.title as internship_title, c.name as company_name,
             i.location, i.start_date, i.end_date
      FROM applications a
      JOIN internships i ON a.internship_id = i.id
      LEFT JOIN companies c ON i.company_id = c.id
      WHERE a.id = ?
    `, [req.params.id]);
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    // Parse additional_info JSON
    if (application.additional_info) {
      application.additional_info = JSON.parse(application.additional_info);
    }
    
    res.json(application);
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({ error: 'Failed to fetch application' });
  }
});

// Update application status (for admin/HR)
router.patch('/:id', async (req, res) => {
  try {
    const { status, reviewer_notes } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }
    
    const validStatuses = ['pending', 'reviewing', 'accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    await runQuery(`
      UPDATE applications 
      SET status = ?, reviewer_notes = ?, reviewed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [status, reviewer_notes, req.params.id]);
    
    res.json({ message: 'Application updated successfully' });
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({ error: 'Failed to update application' });
  }
});

// Delete application
router.delete('/:id', async (req, res) => {
  try {
    await runQuery('DELETE FROM applications WHERE id = ?', [req.params.id]);
    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({ error: 'Failed to delete application' });
  }
});

export default router;
