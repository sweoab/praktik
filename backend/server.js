import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Route imports
import authRoutes from './routes/auth.js';
import blogRoutes from './routes/blog.js';
import contactRoutes from './routes/contacts.js';
import chatRoutes from './routes/chat.js';
import ecommerceRoutes from './routes/ecommerce.js';
import emailRoutes from './routes/email.js';
import invoiceRoutes from './routes/invoice.js';
import kanbanRoutes from './routes/kanban.js';
import notesRoutes from './routes/notes.js';
import ticketRoutes from './routes/tickets.js';
import userRoutes from './routes/users.js';
import internshipRoutes from './routes/internships.js';
import companyRoutes from './routes/companies.js';
import applicationRoutes from './routes/applications.js';

// Database
import { initializeDatabase } from './database/init.js';
import { authenticateToken } from './middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root endpoint - Welcome message
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Praktik Backend API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      auth: '/api/auth/*',
      blog: '/api/blog/*',
      contacts: '/api/contacts/*',
      users: '/api/users/*',
      internships: '/api/internships/*',
      companies: '/api/companies/*'
    },
    documentation: 'Visit /health for server status',
    frontend: 'http://localhost:3000',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// Public routes (no authentication required)
app.use('/api/auth', authRoutes);

// Protected routes (authentication required)
app.use('/api/blog', authenticateToken, blogRoutes);
app.use('/api/contacts', authenticateToken, contactRoutes);
app.use('/api/chat', authenticateToken, chatRoutes);
app.use('/api/ecommerce', authenticateToken, ecommerceRoutes);
app.use('/api/email', authenticateToken, emailRoutes);
app.use('/api/invoice', authenticateToken, invoiceRoutes);
app.use('/api/kanban', authenticateToken, kanbanRoutes);
app.use('/api/notes', authenticateToken, notesRoutes);
app.use('/api/tickets', authenticateToken, ticketRoutes);
app.use('/api/users', authenticateToken, userRoutes);
// Middleware för selektiv autentisering av internships
const selectiveAuthInternships = (req, res, next) => {
  // GET-operationer (läsa praktikplatser) kräver ingen autentisering
  if (req.method === 'GET') {
    return next();
  }
  // Alla andra operationer (POST, PUT, DELETE) kräver autentisering
  return authenticateToken(req, res, next);
};

app.use('/api/internships', selectiveAuthInternships, internshipRoutes);
app.use('/api/companies', authenticateToken, companyRoutes);
app.use('/api/applications', applicationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.errors
    });
  }
  
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expired'
    });
  }
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Initialize database and start server
async function startServer() {
  try {
    await initializeDatabase();
    console.log('✅ Database initialized successfully');
    
    app.listen(PORT, () => {
      console.log(`🚀 Backend server running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔒 API base URL: http://localhost:${PORT}/api`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
