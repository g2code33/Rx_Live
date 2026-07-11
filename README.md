# Rx Live - Premium Football Live Score Platform

A professional tournament management and live score platform built with Next.js 16, PostgreSQL, and Drizzle ORM.

![Rx Live Logo](/public/rx-live-logo.svg)

## 🚀 Features

### Core Features
- **Live Match Tracking** - Real-time scores, statistics, and match events
- **Tournament Management** - Support for leagues, knockouts, and hybrid formats
- **Team & Player Management** - Full CRUD operations with image uploads
- **Media Centre** - News, highlights, interviews, and match reports
- **Fan Engagement** - Predictions, MOTM voting, comments, and reactions
- **Ballot Draw Ceremony** - Interactive 3D-style team draw system

### Admin Features
- **Role-Based Access Control** - Admin, Media, Fan, Team Owner roles
- **Team Management** - Edit team names, colors, venues, coaches
- **Match Management** - Create, update, delete matches with full details
- **Player Management** - Add players with photos, positions, statistics
- **Audit Logs** - Track all admin actions for security
- **Settings Management** - Configure app-wide settings

### Security
- **Password Hashing** - bcrypt for secure password storage
- **JWT Authentication** - Secure session management
- **CSRF Protection** - Built-in Next.js protection
- **Rate Limiting** - API rate limiting ready
- **Input Validation** - Server-side validation on all inputs

## 📋 Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, Custom CSS Animations
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT, cookies-next
- **Forms**: React Hook Form
- **Notifications**: React Hot Toast
- **Animations**: CSS Animations, Canvas Confetti

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### Step 1: Clone the Repository
```bash
git clone <your-repo-url>
cd rx-live
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/rx_live
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

### Step 4: Setup Database
```bash
# Push schema to database
npx drizzle-kit push

# Seed initial data (optional)
curl http://localhost:3000/api/seed
```

### Step 5: Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 6: Build for Production
```bash
npm run build
npm start
```

## 📱 PWA Installation

Rx Live is a Progressive Web App (PWA). To install:

1. Open the app in Chrome/Edge/Safari
2. Click the install icon in the address bar
3. Or go to Share → Add to Home Screen (mobile)

The app will install as a desktop/mobile application with the Rx Live logo.

## 🔐 Default Credentials

After seeding the database:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@rx-live.com | admin123 |
| Fan | fan@rx-live.com | fan123 |

##  Project Structure

```
rx-live/
── src/
│   ├── app/
│   │   ├── api/          # API routes
│   │   ├── auth/         # Authentication pages
│   │   ├── dashboard/    # Admin dashboard
│   │   ├── draw/         # Ballot draw ceremony
│   │   ├── login/        # Login page
│   │   ├── matches/      # Match pages
│   │   ├── media/        # Media centre
│   │   ├── standings/    # League tables
│   │   ├── teams/        # Team pages
│   │   ├── layout.tsx    # Root layout
│   │   └── page.tsx      # Home page
│   ├── db/
│   │   ├── schema.ts     # Database schema
│   │   ├── index.ts      # DB connection
│   │   └── seed.ts       # Seed data
│   └── lib/
│       ├── auth.ts       # Auth utilities
│       └── jwt.ts        # JWT utilities
── public/
│   ├── rx-live-logo.svg  # App logo
│   └── manifest.json     # PWA manifest
└── package.json
```

## 🎨 Customization

### Changing the Logo
Replace `public/rx-live-logo.svg` with your own logo file. The logo is used for:
- Header navigation
- PWA icon
- Login page
- Dashboard

### Theme Colors
Edit `src/app/globals.css` to change theme colors:

```css
--color-brand-bg: #0B0E13;      /* Background */
--color-brand-green: #39FF14;   /* Primary accent */
--color-brand-blue: #2196F3;    /* Secondary accent */
--color-brand-red: #FF3B30;     /* Alert/danger */
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Teams
- `GET /api/teams` - Get all teams
- `POST /api/teams` - Create team (admin)
- `GET /api/teams/[id]` - Get single team
- `PUT /api/teams/[id]` - Update team (admin)
- `DELETE /api/teams/[id]` - Delete team (admin)

### Matches
- `GET /api/matches` - Get all matches
- `POST /api/matches` - Create match (admin)
- `PUT /api/matches/[id]` - Update match (admin)

## 🔒 Security Best Practices

1. **Change JWT_SECRET** in production
2. **Use HTTPS** in production
3. **Enable rate limiting** on API routes
4. **Regular database backups**
5. **Keep dependencies updated**

##  License

MIT License - feel free to use for personal and commercial projects.

## 🤝 Support

For issues and feature requests, please open an issue on GitHub.

---

**Built with ❤️ for the football community**
# Rx_Live
