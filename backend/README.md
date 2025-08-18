# Praktik Backend API

A Node.js + Express + SQLite backend for the Praktik React application.

## Features

- 🔐 **Authentication**: JWT-based authentication with bcrypt password hashing
- 📚 **Blog System**: Full blog with posts, comments, and replies
- 👥 **Contacts Management**: CRUD operations for contacts
- 🛡️ **Security**: Helmet, CORS, rate limiting, and input validation
- 💾 **Database**: SQLite with migration system
- 🔄 **API Standards**: RESTful API design with proper HTTP status codes

## Quick Start

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment:**
   ```bash
   # Copy .env file and modify if needed
   # Default values work for development
   ```

3. **Initialize database:**
   ```bash
   npm run init-db
   ```

4. **Seed with sample data:**
   ```bash
   npm run seed
   ```

5. **Start the server:**
   ```bash
   npm run dev
   ```

The server will run on `http://localhost:3001`

## Default Login Credentials

After seeding the database:
- **Admin**: admin@praktik.com / admin123
- **Test User**: test@praktik.com / test123

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Blog (Protected)
- `GET /api/blog/posts` - Get all blog posts
- `GET /api/blog/posts/:id` - Get single post with comments
- `POST /api/blog/posts` - Create new post
- `PUT /api/blog/posts/:id` - Update post
- `DELETE /api/blog/posts/:id` - Delete post
- `POST /api/blog/posts/:id/comments` - Add comment
- `POST /api/blog/posts/:id/view` - Increment view count

### Contacts (Protected)
- `GET /api/contacts` - Get user's contacts
- `GET /api/contacts/:id` - Get single contact
- `POST /api/contacts` - Create contact
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact (soft delete)
- `PATCH /api/contacts/:id/starred` - Toggle starred status

### Users (Protected)
- `GET /api/users` - Get all users
- `GET /api/users/profile/:id?` - Get user profile with posts

### Other Endpoints
- Chat, E-commerce, Email, Invoice, Kanban, Notes, Tickets routes are created but need implementation

## Frontend Integration

To connect your React app to this backend:

1. **Update API Base URL:**
   Create `src/config/api.js`:
   ```javascript
   export const API_BASE_URL = 'http://localhost:3001/api';
   ```

2. **Add Authentication:**
   Store JWT token in localStorage and include in requests:
   ```javascript
   const token = localStorage.getItem('token');
   const headers = {
     'Content-Type': 'application/json',
     ...(token && { 'Authorization': `Bearer ${token}` })
   };
   ```

3. **Update Fetchers:**
   Modify `src/api/globalFetcher.js` to use the backend URLs and include auth headers.

4. **Disable MSW:**
   Set `VITE_ENABLE_MSW=false` in your frontend `.env` to use real API instead of mocks.

## Development

- `npm run dev` - Start with nodemon (auto-restart)
- `npm start` - Start production server
- `npm run init-db` - Initialize/reset database
- `npm run seed` - Seed with sample data

## Database Schema

The SQLite database includes tables for:
- users, blog_posts, blog_comments
- contacts, chat_conversations, chat_messages
- products, emails, invoices
- kanban_columns, kanban_tasks, notes, tickets, user_posts

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting (100 requests per 15 minutes)
- Input validation with express-validator
- CORS protection
- Helmet security headers
- SQL injection prevention with parameterized queries

## Next Steps

1. Implement remaining endpoints (chat, ecommerce, etc.)
2. Add file upload support with multer
3. Add email functionality
4. Add real-time features with Socket.io
5. Deploy to cloud platform
6. Set up production database (PostgreSQL)
