import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Tickets endpoint - to be implemented' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create ticket endpoint - to be implemented' });
});

export default router;
