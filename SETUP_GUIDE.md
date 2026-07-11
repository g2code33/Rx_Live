# Rx Live - Complete Setup Guide for VSCode

## 📋 Prerequisites

Before you begin, ensure you have:
- **Node.js 18+** installed ([Download](https://nodejs.org/))
- **PostgreSQL 14+** installed ([Download](https://www.postgresql.org/download/))
- **VSCode** installed ([Download](https://code.visualstudio.com/))
- **Git** (optional, for version control)

---

## 🚀 Step-by-Step Installation

### Step 1: Download & Extract

1. Download the `rx-live-app.zip` file from the sandbox
2. Extract it to a folder on your computer (e.g., `C:\Projects\rx-live` or `~/Projects/rx-live`)

### Step 2: Open in VSCode

1. Open VSCode
2. Go to `File → Open Folder`
3. Select the extracted `rx-live` folder

### Step 3: Install Dependencies

Open the VSCode terminal (`Ctrl + ` ` or `Cmd + ` `) and run:

```bash
npm install
```

This will install all required packages including:
- Next.js 16
- React 19
- Drizzle ORM
- PostgreSQL driver
- JWT authentication
- React Hook Form
- React Hot Toast
- Canvas Confetti
- And more...

### Step 4: Configure Environment Variables

Create a `.env` file in the root directory with the following:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/rx_live

# JWT Secret (CHANGE THIS IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2024

# Application
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important Security Notes:**
- Change `YOUR_PASSWORD` to your actual PostgreSQL password
- Change `JWT_SECRET` to a random secure string (use a password generator)
- Never commit `.env` to Git (it's already in `.gitignore`)

### Step 5: Setup PostgreSQL Database

#### Option A: Using psql command line

```bash
# Create database
createdb rx_live

# Or connect with psql
psql -U postgres -c "CREATE DATABASE rx_live;"
```

#### Option B: Using pgAdmin or similar tool

1. Open pgAdmin
2. Connect to your PostgreSQL server
3. Right-click "Databases" → "Create" → "Database"
4. Name it `rx_live`
5. Click "Save"

### Step 6: Push Database Schema

In the VSCode terminal, run:

```bash
npx drizzle-kit push
```

This will create all tables in your database:
- users
- teams
- players
- matches
- competitions
- seasons
- media
- comments
- predictions
- audit_logs
- settings
- And all related tables

### Step 7: Seed Initial Data (Optional)

To add demo data:

```bash
# Start the dev server first
npm run dev

# In another terminal, call the seed API
curl http://localhost:3000/api/seed
```

This creates:
- Admin user (admin@rx-live.com / admin123)
- 4 demo teams
- Sample matches
- Sample media content

### Step 8: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Default Login Credentials

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Admin** | admin@rx-live.com | admin123 | Full access to all features |
| **Team Owner** | owner@rx-live.com | owner123 | Manage own team only |
| **Media** | media@rx-live.com | media123 | Publish news & media |
| **Fan** | fan@rx-live.com | fan123 | View matches, predict, comment |

---

## 📁 Project Structure

```
rx-live/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API Routes (Backend)
│   │   │   ├── auth/           # Authentication endpoints
│   │   │   ├── teams/          # Team management endpoints
│   │   │   ├── players/        # Player management endpoints
│   │   │   └── matches/        # Match management endpoints
│   │   ├── login/              # Login page
│   │   ├── dashboard/          # Admin dashboard
│   │   ├── owner/              # Team owner dashboard
│   │   ├── matches/            # Match pages
│   │   ├── teams/              # Team pages
│   │   ├── standings/          # League tables
│   │   ├── media/              # Media centre
│   │   ├── draw/               # Ballot draw ceremony
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── db/                     # Database
│   │   ├── schema.ts           # Drizzle ORM schema
│   │   ├── index.ts            # Database connection
│   │   └── seed.ts             # Seed data
│   └── lib/                    # Utilities
│       ├── auth.ts             # Password hashing
│       └── jwt.ts              # JWT utilities
├── public/                     # Static files
│   ├── rx-live-logo.svg        # App logo
│   └── manifest.json           # PWA manifest
├── .env                        # Environment variables (CREATE THIS!)
├── package.json                # Dependencies
└── README.md                   # Documentation
```

---

## 🎯 Feature Overview

### Admin Dashboard (`/dashboard`)
- ✅ Overview with statistics
- ✅ Teams management (CRUD)
- ✅ Players management
- ✅ Matches management
- ✅ Media management
- ✅ Settings configuration
- ✅ Audit logs

### Team Owner Dashboard (`/owner`)
- ✅ View own team
- ✅ Edit team details (name, venue, colors, formation)
- ✅ Upload team logo
- ✅ Manage squad (add/edit/delete players)
- ✅ Upload player photos
- ✅ Set team captain
- ✅ Configure formation

### Authentication
- ✅ Login/Signup pages
- ✅ JWT-based sessions
- ✅ Role-based access control
- ✅ Protected routes
- ✅ Logout functionality

### Fan Features
- ✅ View live scores
- ✅ Match predictions
- ✅ Comment on matches
- ✅ Vote Man of the Match
- ✅ Follow teams
- ✅ Receive notifications

### Media Centre
- ✅ Publish news
- ✅ Upload highlights
- ✅ Post interviews
- ✅ Match reports
- ✅ Photo galleries

---

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start dev server (http://localhost:3000)

# Production
npm run build        # Build for production
npm start            # Start production server

# Database
npx drizzle-kit push     # Push schema to database
npx drizzle-kit generate # Generate migrations
npx drizzle-kit migrate  # Run migrations

# Type checking
npm run typecheck    # Run TypeScript checks
npx next typegen     # Generate Next.js types
```

---

## 🌐 API Endpoints Reference

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/login` | User login | No |
| POST | `/api/auth/signup` | User registration | No |
| POST | `/api/auth/logout` | User logout | Yes |
| GET | `/api/auth/me` | Get current user | Yes |

### Teams
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/teams` | Get all teams | No |
| POST | `/api/teams` | Create team | Admin |
| GET | `/api/teams/:id` | Get single team | No |
| PUT | `/api/teams/:id` | Update team | Admin/Owner |
| DELETE | `/api/teams/:id` | Delete team | Admin |
| GET | `/api/teams/my` | Get owner's team | Team Owner |

### Players
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/players?teamId=X` | Get team players | No |
| POST | `/api/players` | Create player | Admin/Owner |
| PUT | `/api/players/:id` | Update player | Admin/Owner |
| DELETE | `/api/players/:id` | Delete player | Admin/Owner |

### Matches
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/matches` | Get all matches | No |
| POST | `/api/matches` | Create match | Admin |
| PUT | `/api/matches/:id` | Update match | Admin |
| GET | `/api/matches/:id` | Get single match | No |

---

## 🎨 Customization Guide

### Change Logo
1. Replace `public/rx-live-logo.svg` with your logo file
2. Update references in:
   - `src/app/layout.tsx`
   - `src/app/login/page.tsx`
   - `src/app/dashboard/page.tsx`
   - `public/manifest.json`

### Change Theme Colors
Edit `src/app/globals.css`:

```css
--color-brand-bg: #0B0E13;      /* Main background */
--color-brand-green: #39FF14;   /* Primary accent */
--color-brand-blue: #2196F3;    /* Secondary accent */
--color-brand-red: #FF3B30;     /* Alerts/errors */
```

### Add Your Branding
1. Update `public/manifest.json` with your app name
2. Update `src/app/layout.tsx` metadata
3. Update `README.md` with your information

---

## 🔒 Security Best Practices

1. **Change JWT_SECRET** - Generate a random 64-character string
2. **Use HTTPS** in production
3. **Enable rate limiting** on API routes
4. **Regular backups** of your database
5. **Keep dependencies updated**: `npm audit fix`
6. **Use environment variables** for all secrets
7. **Enable CORS** only for trusted domains in production

---

## 📱 PWA Installation

### Desktop (Chrome/Edge)
1. Open the app
2. Click the install icon (⊕) in the address bar
3. Click "Install"

### Mobile (iOS Safari)
1. Open the app in Safari
2. Tap the Share button
3. Tap "Add to Home Screen"

### Mobile (Android Chrome)
1. Open the app in Chrome
2. Tap the menu (⋮)
3. Tap "Install app" or "Add to Home screen"

---

## 🐛 Troubleshooting

### Database Connection Error
```
Error: DATABASE_URL is required
```
**Solution:** Check your `.env` file has the correct `DATABASE_URL`

### Port Already in Use
```
Error: Port 3000 is already in use
```
**Solution:** 
```bash
# Kill the process
kill $(lsof -t -i:3000)

# Or use a different port
PORT=3001 npm run dev
```

### Module Not Found
```
Error: Cannot find module 'xxx'
```
**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
```
Type error: ...
```
**Solution:** Most TS errors are from Drizzle relations and don't affect runtime. Run:
```bash
npm run build
```
If build passes, the app will work fine.

---

## 📞 Support

For issues or questions:
1. Check this guide first
2. Review error messages in the terminal
3. Check browser console for frontend errors
4. Review database logs for backend errors

---

##  You're Ready!

Your Rx Live platform is now ready to use. Start the dev server and enjoy!

```bash
npm run dev
```

Open http://localhost:3000 and login with the admin credentials.

**Built with ❤️ for the football community**
