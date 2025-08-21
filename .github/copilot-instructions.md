# Copilot Instructions for Direct Praktik

This document provides essential knowledge for AI agents working in the Direct Praktik codebase.

## Project Overview

Direct Praktik is a sophisticated full-stack internship platform built with modern patterns:

- **Frontend**: React 18 + Vite + Material-UI with advanced code splitting and MSW mocking
- **Backend**: Node.js + Express + SQLite with comprehensive schema and authentication
- **Architecture**: Context-driven state management with lazy loading and error boundaries

## Advanced Architecture Patterns

### Lazy Loading with Error Boundaries
```javascript
// All components use the sophisticated Loadable HOC pattern
const Component = Loadable(() => import('../views/dashboard/Modern'));
```
- **Error Recovery**: Auto-retry with exponential backoff in `src/api/retryHandler.js`
- **Loading Optimization**: 300ms delay prevents flash of loading state
- **Bundle Splitting**: Strategic chunking in `vite.config.js` separates MUI, React, utils

### Authentication Flow Architecture
```javascript
// AuthContext provides centralized auth with token validation
const { user, token, login, logout, isAuthenticated } = useAuth();
```
- **Token Lifecycle**: Auto-verification on app start, localStorage persistence
- **Route Protection**: `<ProtectedRoute>` wrapper validates JWT server-side
- **Role-Based Access**: Backend middleware supports role hierarchy

### Database Schema Design
- **Comprehensive Relations**: 15+ interconnected tables (users, internships, applications, companies)
- **Soft Deletes**: Contacts and notes use `deleted` flags instead of hard deletion
- **Audit Trail**: All tables include `created_at`/`updated_at` timestamps
- **Foreign Key Constraints**: Enabled with `PRAGMA foreign_keys = ON`

## Development Workflows

### Performance-Optimized Build Process
```bash
npm run build    # Generates optimized chunks
ANALYZE=true npm run build  # Bundle analysis
```
- **Chunk Strategy**: Vendor libraries split into mui/react/utils/other
- **Tree Shaking**: esbuild optimization with dead code elimination
- **SVG Optimization**: SVGR with role attributes and viewBox handling

### Database Development Cycle
```bash
cd backend
npm run init-db  # Creates schema with foreign keys
npm run seed     # Populates with realistic test data
```
- **Schema Evolution**: Modify `backend/database/init.js` schema object
- **Seed Strategies**: Separate scripts for internships, applications, companies
- **Query Helpers**: `runQuery()`, `getOne()`, `getAll()` with Promise wrappers

## Critical Integration Patterns

### API Layer Architecture
- **Global Fetchers**: `src/api/globalFetcher.js` provides HTTP verb abstractions
- **Error Handling**: Consistent error format with retry logic
- **Auth Integration**: Automatic token injection via context
- **MSW Development**: Mock Service Worker for offline development

### Context-Driven State Management
```javascript
// Multiple specialized contexts avoid prop drilling
const { isCollapse, activeMode } = useContext(CustomizerContext);
const { cart, addToCart } = useContext(ProductContext);
```
- **Domain Separation**: Auth, Blog, Chat, Ecommerce contexts
- **Performance**: Context splitting prevents unnecessary re-renders
- **Type Safety**: Custom hooks with error boundaries

### Component Composition Patterns
- **Feature Folders**: Each app area (`/views/apps/internships/`) contains full feature
- **Shared Components**: Material-UI extensions in `/components/material-ui/`
- **Layout System**: Full/Blank layouts with responsive sidebar

## Advanced Configuration

### Vite Performance Optimizations
```javascript
// Bundle analysis and chunk optimization
manualChunks: (id) => {
  if (id.includes('@mui')) return 'vendor-mui';
  if (id.includes('react')) return 'vendor-react';
}
```
- **HMR Tuning**: Overlay disabled, polling optimized for large projects
- **Dependency Pre-bundling**: React/Lodash included, MUI excluded for faster builds
- **Source Maps**: Disabled in production for security

### Database Query Patterns
```javascript
// Promise-based SQLite with error handling
const user = await getOne('SELECT * FROM users WHERE id = ?', [userId]);
const result = await runQuery('INSERT INTO...', params);
```
- **Parameterized Queries**: Prevents SQL injection
- **Connection Pooling**: Single database instance with proper error handling
- **Transaction Support**: Available via sqlite3 API

## Complex Feature Implementation

### Internship System Architecture
- **Multi-table Relations**: companies → internships → applications → students
- **Status Workflows**: Application states (pending → reviewed → accepted/rejected)
- **Search & Filtering**: Skills matching, location filtering, date ranges

### Authentication Security
- **JWT Verification**: Token validation on every protected request
- **Role-based Permissions**: Admin/user/company role hierarchy
- **Password Security**: bcrypt hashing with proper salt rounds

### File Upload Strategy (Planned)
- **Multer Integration**: CV uploads for student applications
- **Storage Strategy**: Local development, cloud production
- **Security**: File type validation, size limits, virus scanning

## Development Best Practices

### Error Handling Strategy
- **Frontend**: Error boundaries catch component failures
- **API Layer**: Exponential backoff retry for network failures
- **Backend**: Consistent error response format with proper HTTP codes

### Performance Monitoring
- **Bundle Analysis**: Use `ANALYZE=true` flag for bundle visualization
- **Database Profiling**: SQLite query timing in development
- **Network Optimization**: SWR caching for API calls

### Security Considerations
- **CORS Configuration**: Helmet security headers
- **Rate Limiting**: 100 requests per 15 minutes
- **Input Validation**: express-validator on all endpoints
- **SQL Injection Prevention**: Parameterized queries only

This codebase uses advanced React patterns, sophisticated build optimization, and enterprise-grade database design. Focus on understanding the context system, lazy loading patterns, and the comprehensive database schema when making changes.
