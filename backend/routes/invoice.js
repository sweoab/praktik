import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Invoice endpoint - to be implemented' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create invoice endpoint - to be implemented' });
});

export default router;
