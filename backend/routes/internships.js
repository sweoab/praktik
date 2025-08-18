import express from 'express';
import { getAll, getOne, runQuery } from '../database/init.js';

const router = express.Router();

// Get all internships with optional filtering
router.get('/', async (req, res) => {
  try {
    const { 
      location, 
      field_of_study, 
      remote_allowed, 
      status = 'active',
      limit = 50,
      offset = 0 
    } = req.query;

    let query = `
      SELECT 
        i.*,
        c.name as company_name,
        c.logo as company_logo,
        c.location as company_location,
        c.website as company_website
      FROM internships i
      LEFT JOIN companies c ON i.company_id = c.id
      WHERE i.status = ?
    `;
    const params = [status];

    if (location) {
      query += ' AND (i.location LIKE ? OR i.remote_allowed = 1)';
      params.push(`%${location}%`);
    }

    if (field_of_study) {
      query += ' AND i.field_of_study LIKE ?';
      params.push(`%${field_of_study}%`);
    }

    if (remote_allowed === 'true') {
      query += ' AND i.remote_allowed = 1';
    }

    query += ' ORDER BY i.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const internships = await getAll(query, params);
    
    res.json({
      internships,
      total: internships.length,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching internships:', error);
    res.status(500).json({ error: 'Failed to fetch internships' });
  }
});

// Get single internship by ID
router.get('/:id', async (req, res) => {
  try {
    const internshipId = req.params.id;
    
    const internship = await getOne(`
      SELECT 
        i.*,
        c.name as company_name,
        c.description as company_description,
        c.logo as company_logo,
        c.location as company_location,
        c.website as company_website,
        c.industry as company_industry,
        c.employee_count as company_employee_count
      FROM internships i
      LEFT JOIN companies c ON i.company_id = c.id
      WHERE i.id = ?
    `, [internshipId]);

    if (!internship) {
      return res.status(404).json({ error: 'Internship not found' });
    }

    // Parse JSON fields
    if (internship.required_skills) {
      try {
        internship.required_skills = JSON.parse(internship.required_skills);
      } catch (e) {
        internship.required_skills = [];
      }
    }

    if (internship.preferred_skills) {
      try {
        internship.preferred_skills = JSON.parse(internship.preferred_skills);
      } catch (e) {
        internship.preferred_skills = [];
      }
    }

    res.json(internship);
  } catch (error) {
    console.error('Error fetching internship:', error);
    res.status(500).json({ error: 'Failed to fetch internship' });
  }
});

// Create new internship (company users only)
router.post('/', async (req, res) => {
  try {
    const {
      company_id,
      title,
      description,
      requirements,
      location,
      duration_weeks,
      start_date,
      end_date,
      application_deadline,
      compensation,
      remote_allowed = false,
      field_of_study,
      required_skills = [],
      preferred_skills = [],
      spots_available = 1
    } = req.body;

    // Validate required fields
    if (!company_id || !title || !description) {
      return res.status(400).json({ 
        error: 'Company ID, title, and description are required' 
      });
    }

    // Verify company belongs to user
    const company = await getOne(
      'SELECT id FROM companies WHERE id = ? AND user_id = ?',
      [company_id, req.user.id]
    );

    if (!company) {
      return res.status(403).json({ 
        error: 'Unauthorized: Company not found or access denied' 
      });
    }

    const result = await runQuery(`
      INSERT INTO internships (
        company_id, title, description, requirements, location,
        duration_weeks, start_date, end_date, application_deadline,
        compensation, remote_allowed, field_of_study, required_skills,
        preferred_skills, spots_available
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      company_id, title, description, requirements, location,
      duration_weeks, start_date, end_date, application_deadline,
      compensation, remote_allowed ? 1 : 0, field_of_study,
      JSON.stringify(required_skills), JSON.stringify(preferred_skills),
      spots_available
    ]);

    // Fetch the created internship
    const newInternship = await getOne(
      'SELECT * FROM internships WHERE id = ?',
      [result.id]
    );

    res.status(201).json(newInternship);
  } catch (error) {
    console.error('Error creating internship:', error);
    res.status(500).json({ error: 'Failed to create internship' });
  }
});

// Update internship
router.put('/:id', async (req, res) => {
  try {
    const internshipId = req.params.id;
    const {
      title,
      description,
      requirements,
      location,
      duration_weeks,
      start_date,
      end_date,
      application_deadline,
      compensation,
      remote_allowed,
      field_of_study,
      required_skills,
      preferred_skills,
      spots_available,
      status
    } = req.body;

    // Verify ownership
    const internship = await getOne(`
      SELECT i.* FROM internships i
      LEFT JOIN companies c ON i.company_id = c.id
      WHERE i.id = ? AND c.user_id = ?
    `, [internshipId, req.user.id]);

    if (!internship) {
      return res.status(404).json({ 
        error: 'Internship not found or access denied' 
      });
    }

    await runQuery(`
      UPDATE internships SET
        title = ?, description = ?, requirements = ?, location = ?,
        duration_weeks = ?, start_date = ?, end_date = ?, application_deadline = ?,
        compensation = ?, remote_allowed = ?, field_of_study = ?,
        required_skills = ?, preferred_skills = ?, spots_available = ?,
        status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      title, description, requirements, location,
      duration_weeks, start_date, end_date, application_deadline,
      compensation, remote_allowed ? 1 : 0, field_of_study,
      JSON.stringify(required_skills), JSON.stringify(preferred_skills),
      spots_available, status, internshipId
    ]);

    // Return updated internship
    const updatedInternship = await getOne(
      'SELECT * FROM internships WHERE id = ?',
      [internshipId]
    );

    res.json(updatedInternship);
  } catch (error) {
    console.error('Error updating internship:', error);
    res.status(500).json({ error: 'Failed to update internship' });
  }
});

// Delete internship (soft delete by setting status to 'deleted')
router.delete('/:id', async (req, res) => {
  try {
    const internshipId = req.params.id;

    // Verify ownership
    const internship = await getOne(`
      SELECT i.* FROM internships i
      LEFT JOIN companies c ON i.company_id = c.id
      WHERE i.id = ? AND c.user_id = ?
    `, [internshipId, req.user.id]);

    if (!internship) {
      return res.status(404).json({ 
        error: 'Internship not found or access denied' 
      });
    }

    await runQuery(`
      UPDATE internships SET status = 'deleted', updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [internshipId]);

    res.json({ message: 'Internship deleted successfully' });
  } catch (error) {
    console.error('Error deleting internship:', error);
    res.status(500).json({ error: 'Failed to delete internship' });
  }
});

// Apply to internship
router.post('/:id/apply', async (req, res) => {
  try {
    const internshipId = req.params.id;
    const { cover_letter, motivation } = req.body;
    const studentId = req.user.id;

    // Check if internship exists and is active
    const internship = await getOne(
      'SELECT * FROM internships WHERE id = ? AND status = ?',
      [internshipId, 'active']
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

    // Check if user has already applied
    const existingApplication = await getOne(
      'SELECT id FROM applications WHERE student_id = ? AND internship_id = ?',
      [studentId, internshipId]
    );

    if (existingApplication) {
      return res.status(400).json({ 
        error: 'You have already applied to this internship' 
      });
    }

    // Create application
    const result = await runQuery(`
      INSERT INTO applications (student_id, internship_id, cover_letter, motivation)
      VALUES (?, ?, ?, ?)
    `, [studentId, internshipId, cover_letter, motivation]);

    res.status(201).json({
      id: result.id,
      message: 'Application submitted successfully'
    });
  } catch (error) {
    console.error('Error applying to internship:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

// Search internships
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    const searchQuery = `%${query}%`;
    
    const internships = await getAll(`
      SELECT 
        i.*,
        c.name as company_name,
        c.logo as company_logo,
        c.location as company_location
      FROM internships i
      LEFT JOIN companies c ON i.company_id = c.id
      WHERE i.status = 'active' AND (
        i.title LIKE ? OR 
        i.description LIKE ? OR 
        i.field_of_study LIKE ? OR
        i.location LIKE ? OR
        c.name LIKE ?
      )
      ORDER BY i.created_at DESC
      LIMIT ? OFFSET ?
    `, [searchQuery, searchQuery, searchQuery, searchQuery, searchQuery, parseInt(limit), parseInt(offset)]);

    res.json({
      internships,
      query,
      total: internships.length,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error searching internships:', error);
    res.status(500).json({ error: 'Failed to search internships' });
  }
});

export default router;
