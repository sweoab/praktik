import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Notes endpoint - to be implemented' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create note endpoint - to be implemented' });
});

export default router;
