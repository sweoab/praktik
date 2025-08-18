import express from 'express';
import { body, validationResult } from 'express-validator';
import { runQuery, getAll, getOne } from '../database/init.js';

const router = express.Router();

// Get all blog posts
router.get('/posts', async (req, res) => {
  try {
    const posts = await getAll(`
      SELECT 
        bp.*,
        u.firstname || ' ' || u.lastname as author_name,
        u.avatar as author_avatar,
        (SELECT COUNT(*) FROM blog_comments WHERE post_id = bp.id) as comment_count
      FROM blog_posts bp
      LEFT JOIN users u ON bp.author_id = u.id
      ORDER BY bp.created_at DESC
    `);
    
    res.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

// Get single blog post with comments
router.get('/posts/:id', async (req, res) => {
  try {
    const post = await getOne(`
      SELECT 
        bp.*,
        u.firstname || ' ' || u.lastname as author_name,
        u.avatar as author_avatar
      FROM blog_posts bp
      LEFT JOIN users u ON bp.author_id = u.id
      WHERE bp.id = ?
    `, [req.params.id]);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Get comments with replies
    const comments = await getAll(`
      SELECT 
        bc.*,
        u.firstname || ' ' || u.lastname as user_name,
        u.avatar as user_avatar
      FROM blog_comments bc
      LEFT JOIN users u ON bc.user_id = u.id
      WHERE bc.post_id = ? AND bc.parent_id IS NULL
      ORDER BY bc.created_at ASC
    `, [req.params.id]);

    // Get replies for each comment
    for (const comment of comments) {
      comment.replies = await getAll(`
        SELECT 
          bc.*,
          u.firstname || ' ' || u.lastname as user_name,
          u.avatar as user_avatar
        FROM blog_comments bc
        LEFT JOIN users u ON bc.user_id = u.id
        WHERE bc.parent_id = ?
        ORDER BY bc.created_at ASC
      `, [comment.id]);
    }

    res.json({ ...post, comments });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

// Create new blog post
router.post('/posts', [
  body('title').notEmpty().trim(),
  body('content').notEmpty().trim(),
  body('category').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, cover_img, category, featured_post = false } = req.body;

    const result = await runQuery(`
      INSERT INTO blog_posts (title, content, cover_img, author_id, category, featured_post)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [title, content, cover_img, req.user.id, category, featured_post]);

    const newPost = await getOne(`
      SELECT 
        bp.*,
        u.firstname || ' ' || u.lastname as author_name,
        u.avatar as author_avatar
      FROM blog_posts bp
      LEFT JOIN users u ON bp.author_id = u.id
      WHERE bp.id = ?
    `, [result.id]);
    
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ error: 'Failed to create blog post' });
  }
});

// Update blog post
router.put('/posts/:id', [
  body('title').optional().notEmpty().trim(),
  body('content').optional().notEmpty().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const post = await getOne('SELECT * FROM blog_posts WHERE id = ?', [req.params.id]);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if user is the author or has admin role
    if (post.author_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to edit this post' });
    }

    const updates = req.body;
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updates), req.params.id];

    await runQuery(
      `UPDATE blog_posts SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      values
    );

    const updatedPost = await getOne(`
      SELECT 
        bp.*,
        u.firstname || ' ' || u.lastname as author_name,
        u.avatar as author_avatar
      FROM blog_posts bp
      LEFT JOIN users u ON bp.author_id = u.id
      WHERE bp.id = ?
    `, [req.params.id]);
    
    res.json(updatedPost);
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({ error: 'Failed to update blog post' });
  }
});

// Delete blog post
router.delete('/posts/:id', async (req, res) => {
  try {
    const post = await getOne('SELECT * FROM blog_posts WHERE id = ?', [req.params.id]);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if user is the author or has admin role
    if (post.author_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    // Delete comments first (foreign key constraint)
    await runQuery('DELETE FROM blog_comments WHERE post_id = ?', [req.params.id]);
    
    // Delete the post
    await runQuery('DELETE FROM blog_posts WHERE id = ?', [req.params.id]);

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ error: 'Failed to delete blog post' });
  }
});

// Add comment to blog post
router.post('/posts/:id/comments', [
  body('comment').notEmpty().trim(),
  body('parent_id').optional().isInt()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const post = await getOne('SELECT id FROM blog_posts WHERE id = ?', [req.params.id]);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const { comment, parent_id } = req.body;

    const result = await runQuery(`
      INSERT INTO blog_comments (post_id, user_id, comment, parent_id)
      VALUES (?, ?, ?, ?)
    `, [req.params.id, req.user.id, comment, parent_id || null]);

    const newComment = await getOne(`
      SELECT 
        bc.*,
        u.firstname || ' ' || u.lastname as user_name,
        u.avatar as user_avatar
      FROM blog_comments bc
      LEFT JOIN users u ON bc.user_id = u.id
      WHERE bc.id = ?
    `, [result.id]);
    
    res.status(201).json(newComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Increment view count
router.post('/posts/:id/view', async (req, res) => {
  try {
    await runQuery(
      'UPDATE blog_posts SET view_count = view_count + 1 WHERE id = ?',
      [req.params.id]
    );
    
    res.json({ message: 'View count updated' });
  } catch (error) {
    console.error('Error updating view count:', error);
    res.status(500).json({ error: 'Failed to update view count' });
  }
});

export default router;
