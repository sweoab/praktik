import express from 'express';
import { getAll, getOne, runQuery } from '../database/init.js';

const router = express.Router();

// Get all companies
router.get('/', async (req, res) => {
  try {
    const { 
      industry, 
      location, 
      limit = 50, 
      offset = 0 
    } = req.query;

    let query = 'SELECT * FROM companies WHERE 1=1';
    const params = [];

    if (industry) {
      query += ' AND industry LIKE ?';
      params.push(`%${industry}%`);
    }

    if (location) {
      query += ' AND location LIKE ?';
      params.push(`%${location}%`);
    }

    query += ' ORDER BY name ASC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const companies = await getAll(query, params);
    
    res.json({
      companies,
      total: companies.length,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
});

// Get single company by ID
router.get('/:id', async (req, res) => {
  try {
    const companyId = req.params.id;
    
    const company = await getOne(
      'SELECT * FROM companies WHERE id = ?',
      [companyId]
    );

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Get company's active internships
    const internships = await getAll(`
      SELECT * FROM internships 
      WHERE company_id = ? AND status = 'active'
      ORDER BY created_at DESC
    `, [companyId]);

    res.json({
      ...company,
      internships
    });
  } catch (error) {
    console.error('Error fetching company:', error);
    res.status(500).json({ error: 'Failed to fetch company' });
  }
});

// Create company profile (authenticated users only)
router.post('/', async (req, res) => {
  try {
    const {
      name,
      description,
      industry,
      location,
      website,
      logo,
      contact_email,
      contact_phone,
      employee_count,
      founded_year
    } = req.body;

    // Validate required fields
    if (!name || !description) {
      return res.status(400).json({ 
        error: 'Company name and description are required' 
      });
    }

    // Check if user already has a company
    const existingCompany = await getOne(
      'SELECT id FROM companies WHERE user_id = ?',
      [req.user.id]
    );

    if (existingCompany) {
      return res.status(400).json({ 
        error: 'User already has a company profile' 
      });
    }

    const result = await runQuery(`
      INSERT INTO companies (
        user_id, name, description, industry, location,
        website, logo, contact_email, contact_phone,
        employee_count, founded_year
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      req.user.id, name, description, industry, location,
      website, logo, contact_email, contact_phone,
      employee_count, founded_year
    ]);

    // Fetch the created company
    const newCompany = await getOne(
      'SELECT * FROM companies WHERE id = ?',
      [result.id]
    );

    res.status(201).json(newCompany);
  } catch (error) {
    console.error('Error creating company:', error);
    res.status(500).json({ error: 'Failed to create company' });
  }
});

// Update company profile
router.put('/:id', async (req, res) => {
  try {
    const companyId = req.params.id;
    const {
      name,
      description,
      industry,
      location,
      website,
      logo,
      contact_email,
      contact_phone,
      employee_count,
      founded_year
    } = req.body;

    // Verify ownership
    const company = await getOne(
      'SELECT * FROM companies WHERE id = ? AND user_id = ?',
      [companyId, req.user.id]
    );

    if (!company) {
      return res.status(404).json({ 
        error: 'Company not found or access denied' 
      });
    }

    await runQuery(`
      UPDATE companies SET
        name = ?, description = ?, industry = ?, location = ?,
        website = ?, logo = ?, contact_email = ?, contact_phone = ?,
        employee_count = ?, founded_year = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      name, description, industry, location,
      website, logo, contact_email, contact_phone,
      employee_count, founded_year, companyId
    ]);

    // Return updated company
    const updatedCompany = await getOne(
      'SELECT * FROM companies WHERE id = ?',
      [companyId]
    );

    res.json(updatedCompany);
  } catch (error) {
    console.error('Error updating company:', error);
    res.status(500).json({ error: 'Failed to update company' });
  }
});

// Get company's internships
router.get('/:id/internships', async (req, res) => {
  try {
    const companyId = req.params.id;
    const { status = 'active' } = req.query;

    const internships = await getAll(`
      SELECT * FROM internships 
      WHERE company_id = ? AND status = ?
      ORDER BY created_at DESC
    `, [companyId, status]);

    res.json(internships);
  } catch (error) {
    console.error('Error fetching company internships:', error);
    res.status(500).json({ error: 'Failed to fetch company internships' });
  }
});

// Get current user's company
router.get('/profile/my-company', async (req, res) => {
  try {
    const company = await getOne(
      'SELECT * FROM companies WHERE user_id = ?',
      [req.user.id]
    );

    if (!company) {
      return res.status(404).json({ error: 'No company profile found' });
    }

    // Get company's internships
    const internships = await getAll(`
      SELECT 
        i.*,
        COUNT(a.id) as application_count
      FROM internships i
      LEFT JOIN applications a ON i.id = a.internship_id
      WHERE i.company_id = ?
      GROUP BY i.id
      ORDER BY i.created_at DESC
    `, [company.id]);

    res.json({
      ...company,
      internships
    });
  } catch (error) {
    console.error('Error fetching user company:', error);
    res.status(500).json({ error: 'Failed to fetch company profile' });
  }
});

export default router;
