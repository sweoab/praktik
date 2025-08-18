import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Email endpoint - to be implemented' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Send email endpoint - to be implemented' });
});

export default router;
