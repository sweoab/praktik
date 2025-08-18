import express from 'express';
import { getAll, getOne } from '../database/init.js';

const router = express.Router();

// Get current user's profile (from token)
router.get('/profile', async (req, res) => {
  try {
    // req.user is set by the authenticateToken middleware
    const user = await getOne(
      'SELECT id, email, firstname, lastname, avatar, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get user's posts
    const posts = await getAll(
      'SELECT * FROM user_posts WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    
    res.json({ ...user, posts });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Get user profile by ID
router.get('/profile/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    
    const user = await getOne(
      'SELECT id, email, firstname, lastname, avatar, role, created_at FROM users WHERE id = ?',
      [userId]
    );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get user's posts
    const posts = await getAll(
      'SELECT * FROM user_posts WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    
    res.json({ ...user, posts });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Get all users (for admin or public profiles)
router.get('/', async (req, res) => {
  try {
    const users = await getAll(
      'SELECT id, firstname, lastname, avatar, role, created_at FROM users ORDER BY created_at DESC'
    );
    
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

export default router;
