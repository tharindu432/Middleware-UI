# 🚀 FitsAir Frontend - Complete Setup Guide

This guide will help you set up and run the FitsAir Middleware frontend application.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn** or **pnpm**
- **Git** (optional, for version control)
- **Backend Server** running on `http://localhost:8080`

## 🔧 Installation Steps

### Step 1: Navigate to Frontend Directory

```bash
cd C:/Users/tharindu.r_fitscargo/Middlware-Project/frontend
```

### Step 2: Install Dependencies

Choose one of the following package managers:

**Using npm:**
```bash
npm install
```

**Using yarn:**
```bash
yarn install
```

**Using pnpm:**
```bash
pnpm install
```

This will install all required dependencies including:
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Shadcn UI components
- Axios
- React Router
- And more...

### Step 3: Configure Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` file if needed:
```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_ENV=development
```

### Step 4: Start Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will start on `http://localhost:5173`

### Step 5: Open in Browser

Navigate to: **http://localhost:5173**

You should see the login page!

## 🔐 Login Credentials

Use these demo credentials to test the application:

### Admin Account
- **Email:** `admin@middleware.com`
- **Password:** `admin123`
- **User Type:** ADMIN

### Agent Account
- **Email:** `agent@testagency.com`
- **Password:** `agent123`
- **User Type:** AGENT

## 📁 Project Structure Overview

```
frontend/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ui/           # Shadcn UI components
│   │   └── StatCard.tsx  # Custom components
│   ├── contexts/         # React contexts (Auth)
│   ├── hooks/            # Custom API hooks
│   ├── layouts/          # Layout components
│   ├── lib/              # Utilities and helpers
│   ├── pages/            # Page components
│   │   ├── admin/        # Admin pages
│   │   ├── agent/        # Agent pages
│   │   └── employee/     # Employee pages
│   ├── routes/           # Routing configuration
│   ├── types/            # TypeScript types
│   ├── App.tsx           # Main app component
│   └── main.tsx          # Entry point
├── public/               # Static assets
├── .env.example          # Environment variables template
├── package.json          # Dependencies
├── tailwind.config.js    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite configuration
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

## 🔍 Troubleshooting

### Issue: Dependencies Installation Fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: Port 5173 Already in Use

**Solution:**
```bash
# Kill the process using port 5173
# On Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or change the port in vite.config.ts
```

### Issue: CORS Errors

**Solution:**
Ensure your backend `WebConfig.java` has:
```java
.allowedOrigins("http://localhost:5173")
```

### Issue: API Connection Failed

**Solution:**
1. Verify backend is running on `http://localhost:8080`
2. Check `.env` file has correct `VITE_API_BASE_URL`
3. Check browser console for detailed errors

### Issue: TypeScript Errors

**Solution:**
```bash
# Restart TypeScript server in VS Code
# Press Ctrl+Shift+P and type "TypeScript: Restart TS Server"

# Or rebuild
npm run build
```

## 🎨 Customization

### Change Theme Colors

Edit `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: "hsl(221.2 83.2% 53.3%)", // Change this
        foreground: "hsl(210 40% 98%)",
      },
    },
  },
}
```

### Add New Pages

1. Create page component in `src/pages/`
2. Add route in `src/routes/index.tsx`
3. Add navigation link in layout

### Add New API Hook

1. Create hook file in `src/hooks/`
2. Use axios instance from `src/lib/axios.ts`
3. Export hook functions

## 📦 Building for Production

### Build the Application

```bash
npm run build
```

Output will be in `dist/` directory.

### Test Production Build Locally

```bash
npm run preview
```

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

### Deploy to Netlify

1. Install Netlify CLI:
```bash
npm i -g netlify-cli
```

2. Deploy:
```bash
netlify deploy --prod
```

## 🔒 Security Best Practices

1. **Never commit `.env` file** - It's in `.gitignore`
2. **Use HTTPS in production** - Configure SSL certificates
3. **Implement rate limiting** - On API endpoints
4. **Validate all inputs** - Client and server side
5. **Keep dependencies updated** - Run `npm audit` regularly

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Shadcn UI Components](https://ui.shadcn.com/)

## 🆘 Getting Help

If you encounter issues:

1. Check this guide's troubleshooting section
2. Review browser console for errors
3. Check backend logs
4. Verify all prerequisites are installed
5. Contact: support@fitsair.com

## ✅ Verification Checklist

- [ ] Node.js 18+ installed
- [ ] Dependencies installed successfully
- [ ] Backend server running on port 8080
- [ ] Frontend server running on port 5173
- [ ] Can access login page
- [ ] Can login with demo credentials
- [ ] Dashboard loads correctly
- [ ] No console errors

## 🎉 Success!

If you've completed all steps, your FitsAir Middleware frontend is now running!

Navigate to different sections:
- **Admin Dashboard** - Manage agents, approve credits, view reports
- **Agent Dashboard** - Search flights, create bookings, manage employees
- **Employee Dashboard** - Search flights, view bookings, manage tickets

---

**Happy Coding! ✈️**
