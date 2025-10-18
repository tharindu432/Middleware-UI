# ✈️ FitsAir Middleware - Frontend Application

A modern, professional, and fully responsive React + TypeScript frontend application for the FitsAir airline middleware system.

## 🚀 Features

- ✅ **Role-Based Access Control** - Separate dashboards for Admin, Agent Manager, Agent User, and Employee roles
- ✅ **68 API Endpoints Integration** - Complete integration with all backend services
- ✅ **Modern UI/UX** - Built with Tailwind CSS and Shadcn UI components
- ✅ **Fully Responsive** - Mobile-first design that works on all devices
- ✅ **JWT Token Management** - Automatic token refresh and secure authentication
- ✅ **Type-Safe** - Full TypeScript support for better developer experience
- ✅ **Custom Hooks** - Dedicated hooks for each service (Flights, Bookings, Tickets, etc.)
- ✅ **Professional Components** - Reusable UI components with consistent styling

## 📋 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing
- **Axios** - HTTP client with interceptors
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn UI** - High-quality component library
- **Radix UI** - Headless UI primitives
- **Lucide React** - Beautiful icon library
- **React Hot Toast** - Toast notifications
- **Zustand** - State management (optional)

## 🛠️ Installation

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Backend server running on `http://localhost:8080`

### Setup Steps

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Configure environment** (optional):
   Create a `.env` file in the frontend directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api/v1
   ```

4. **Start development server**:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open browser**:
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable components
│   │   ├── layout/         # Layout components
│   │   ├── ui/             # UI components (Button, Card, etc.)
│   │   └── StatCard.tsx    # Statistics card component
│   ├── contexts/           # React contexts
│   │   └── AuthContext.tsx # Authentication context
│   ├── hooks/              # Custom hooks for API calls
│   │   ├── useAuth.ts      # Authentication hook
│   │   ├── useFlights.ts   # Flights API hook
│   │   ├── useBookings.ts  # Bookings API hook
│   │   ├── useTickets.ts   # Tickets API hook
│   │   ├── usePayments.ts  # Payments API hook
│   │   ├── useInvoices.ts  # Invoices API hook
│   │   ├── useCredit.ts    # Credit API hook
│   │   ├── useAdmin.ts     # Admin API hook
│   │   ├── useAgents.ts    # Agents API hook
│   │   ├── useEmployees.ts # Employees API hook
│   │   └── useReports.ts   # Reports API hook
│   ├── layouts/            # Layout components
│   │   ├── AdminLayout.tsx
│   │   ├── AgentLayout.tsx
│   │   └── EmployeeLayout.tsx
│   ├── lib/                # Utility functions
│   │   ├── axios.ts        # Axios instance with interceptors
│   │   └── utils.ts        # Helper functions
│   ├── pages/              # Page components
│   │   ├── admin/          # Admin pages
│   │   ├── agent/          # Agent pages
│   │   ├── employee/       # Employee pages
│   │   └── LoginPage.tsx   # Login page
│   ├── routes/             # Routing configuration
│   │   ├── index.tsx       # Main routes
│   │   └── ProtectedRoute.tsx # Protected route wrapper
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts        # All type definitions
│   ├── App.tsx             # Main App component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── .env.example            # Environment variables example
├── .gitignore              # Git ignore file
├── index.html              # HTML template
├── package.json            # Dependencies and scripts
├── postcss.config.js       # PostCSS configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
└── README.md               # This file
```

## 🎯 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## 🔐 Authentication

The application uses JWT-based authentication with automatic token refresh:

1. **Login** - Users login with email, password, and user type (ADMIN/AGENT/EMPLOYEE)
2. **Token Storage** - Access and refresh tokens are stored in localStorage
3. **Auto Refresh** - Tokens are automatically refreshed when they expire
4. **Logout** - Tokens are cleared on logout

### Demo Credentials

**Admin:**
- Email: `admin@middleware.com`
- Password: `admin123`
- User Type: ADMIN

**Agent:**
- Email: `agent@testagency.com`
- Password: `agent123`
- User Type: AGENT

## 🎨 UI Components

The application uses Shadcn UI components which are:
- **Accessible** - Built on Radix UI primitives
- **Customizable** - Easy to modify and extend
- **Type-safe** - Full TypeScript support
- **Responsive** - Mobile-first design

### Available Components

- Button, Input, Label, Card
- Table, Badge, Dialog, Select
- Tabs, Dropdown Menu, Popover
- Toast notifications
- And more...

## 📡 API Integration

Each service has a dedicated custom hook:

```typescript
// Example: Using the Flights hook
import { useFlights } from '@/hooks/useFlights'

function MyComponent() {
  const { searchFlights, loading, flights } = useFlights()

  const handleSearch = async () => {
    await searchFlights({
      origin: 'JFK',
      destination: 'LAX',
      departureDate: '2025-12-01'
    })
  }

  return (
    // Your component JSX
  )
}
```

## 🔒 Role-Based Access

The application implements role-based access control:

| Feature | Admin | Agent Manager | Agent User | Employee |
|---------|-------|---------------|------------|----------|
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Manage Agents | ✅ | ❌ | ❌ | ❌ |
| Approve Credits | ✅ | ❌ | ❌ | ❌ |
| View Reports | ✅ | ✅ | ❌ | ❌ |
| Create Bookings | ❌ | ✅ | ✅ | ✅ |
| Manage Employees | ❌ | ✅ | ✅ | ❌ |
| Issue Tickets | ❌ | ✅ | ✅ | ✅ |

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Deploy to Vercel/Netlify

1. Connect your repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables

### Deploy to Custom Server

1. Build the application
2. Copy `dist/` folder to your server
3. Configure your web server (Nginx/Apache) to serve the static files
4. Set up reverse proxy for API calls

## 🐛 Troubleshooting

### CORS Issues

If you encounter CORS errors, ensure your backend has the correct CORS configuration:

```java
// WebConfig.java
.allowedOrigins("http://localhost:5173")
```

### API Connection Issues

1. Check if backend is running on `http://localhost:8080`
2. Verify `VITE_API_BASE_URL` in `.env` file
3. Check browser console for errors

### Build Errors

1. Clear node_modules: `rm -rf node_modules`
2. Clear cache: `npm cache clean --force`
3. Reinstall: `npm install`

## 📚 Documentation

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Shadcn UI Documentation](https://ui.shadcn.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is proprietary software developed for FitsAir Middleware.

## 👥 Support

For technical support or questions:
- **Email**: support@fitsair.com
- **Backend API**: http://localhost:8080/swagger-ui.html

---

**Made with ❤️ by FitsAir Development Team**
