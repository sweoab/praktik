import express from 'express';
const router = express.Router();

router.get('/boards', (req, res) => {
  res.json({ message: 'Kanban boards endpoint - to be implemented' });
});

router.post('/boards', (req, res) => {
  res.json({ message: 'Create kanban board endpoint - to be implemented' });
});

router.get('/boards/:id/tasks', (req, res) => {
  res.json({ message: 'Kanban tasks endpoint - to be implemented' });
});

router.post('/boards/:id/tasks', (req, res) => {
  res.json({ message: 'Create kanban task endpoint - to be implemented' });
});

export default router;
