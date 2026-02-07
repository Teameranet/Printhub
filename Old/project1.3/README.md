# PrintHub - Professional Printing Services Platform

A comprehensive printing services platform with user-friendly frontend and powerful admin dashboard.

## Project Structure

```
├── frontend/
│   ├── user/           # User-facing components and pages
│   │   ├── components/ # Reusable UI components
│   │   └── pages/      # User pages (Home, Services, etc.)
│   └── admin/          # Admin dashboard
│       ├── components/ # Admin-specific components
│       └── pages/      # Admin pages (Dashboard, Management, etc.)
├── backend/
│   ├── user/           # User API endpoints
│   └── admin/          # Admin API endpoints
├── server/             # Server configuration
├── client/             # Client-side utilities
└── src/                # Main application entry point
```

## Features

### User Features
- Browse printing services and categories
- Track orders
- Shopping cart functionality
- User authentication
- Store locator
- Mobile-responsive design

### Admin Features
- Comprehensive dashboard with analytics
- Service management (create, edit, delete services)
- User management
- Order management
- Product management
- Marketing tools
- Reports and analytics
- Secure admin authentication

## Admin Access

### Login Credentials
- **Email:** admin@printhub.com
- **Password:** admin123

### How to Access Admin Dashboard
1. Scroll to the footer
2. Click "Admin Login" button
3. Enter the credentials above
4. You'll be redirected to `/admin`

### Admin Features
- **Service Management:** Create and manage services that appear on the website
- **Visibility Controls:** Toggle services to show/hide on home page and services page
- **User Management:** View and manage user accounts
- **Order Processing:** Track and manage customer orders
- **Analytics:** View business metrics and reports
- **Logout:** Secure logout functionality in sidebar

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Technology Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS
- **Icons:** Lucide React
- **Routing:** React Router DOM
- **Charts:** Chart.js with React Chart.js 2
- **Carousel:** Swiper
- **Build Tool:** Vite

## Key Components

### User Components
- **Header:** Navigation with search, cart, and user authentication
- **Footer:** Links, contact info, and admin login
- **Hero:** Dynamic carousel with images and videos
- **Categories:** Service browsing and selection
- **Testimonials:** Customer reviews and feedback

### Admin Components
- **Sidebar:** Navigation with logout functionality
- **Dashboard:** Analytics and overview
- **Service Management:** CRUD operations for services
- **User Management:** Customer account management
- **Order Management:** Order processing and tracking

## Environment Variables

Create a `.env` file with:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Deployment

The application is configured for deployment with:
- Netlify redirects (`public/_redirects`)
- Optimized build configuration
- Production-ready code structure

## Contributing

1. Follow the established folder structure
2. Use TypeScript for type safety
3. Follow React best practices
4. Maintain responsive design principles
5. Test admin functionality thoroughly

## License

This project is proprietary and confidential.