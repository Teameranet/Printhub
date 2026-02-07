# PrintHub Project

A full-stack React application with clean separation of concerns.

## Project Structure

```
printhub-project/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   ├── pages/         # Page components
│   │   ├── App.jsx        # Main App component
│   │   └── index.js       # Entry point
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── backend/           # Node.js/Express backend server
│   ├── routes/            # API routes
│   ├── server.js          # Express server setup
│   └── package.json       # Backend dependencies
├── database/          # Database models and controllers
│   ├── models/            # Data models
│   ├── controllers/       # Database controllers
│   └── config.js          # Database configuration
└── package.json       # Root package.json with dev scripts
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation

1. Install all dependencies:
```bash
npm run install-deps
```

2. Start the development environment:
```bash
npm run dev
```

This will start both the frontend (React) on port 3000 and backend (Express) on port 5000.

### Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm start` - Start only the frontend
- `npm run server` - Start only the backend
- `npm run build` - Build the frontend for production
- `npm test` - Run frontend tests

## Features

- ✅ React with JSX syntax (no TypeScript)
- ✅ Clean folder structure with separated concerns
- ✅ React Router for navigation
- ✅ Express.js backend with API routes
- ✅ Database models and controllers structure
- ✅ Development environment with hot reload
- ✅ Proxy configuration for API calls

## API Endpoints

- `GET /api/test` - Test endpoint
- `GET /api/products` - Get all products

## Development

The frontend runs on `http://localhost:3000` and automatically proxies API requests to the backend running on `http://localhost:5000`.

## Next Steps

1. Set up your preferred database (MySQL, PostgreSQL, MongoDB)
2. Implement authentication
3. Add more API endpoints
4. Style your components
5. Add state management (Redux, Context API)