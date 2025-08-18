import express from 'express';
const router = express.Router();

router.get('/products', (req, res) => {
  res.json({ message: 'Products endpoint - to be implemented' });
});

router.get('/products/:id', (req, res) => {
  res.json({ message: 'Single product endpoint - to be implemented' });
});

router.post('/products', (req, res) => {
  res.json({ message: 'Create product endpoint - to be implemented' });
});

export default router;
