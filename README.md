# QuizMania Frontend | Vercel Production Deployment Manual

This is the premium, mobile-responsive React + Vite client-side application for **QuizMania**, styled with glassmorphism CSS, Recharts analytics, Framer Motion transitions, and Tailwind CSS.

---

## High-fidelity Interfaces Included

- **Public Space**:
  - `Landing Page`: Floating elements, animated gradient banners, feature cards, and clean call-to-actions.
  - `About Page`: Descriptions of subjects (Quant, Logical, Verbal, DI, Work rates) and placement qualifications.
  - `Authentication Pages`: Beautiful form cards with validation states.
- **User Dashboard**:
  - `Performance Hub`: Cumulative scores, accuracies, completed tests count, and Recharts topic analytics.
  - `Daily Challenge Banner`: Quick challenge access.
  - `Recent Attempts History & Bookmarks List`.
  - `Fullscreen Quiz Console`: Clean navigation grid, warning countdown timer colors, skipping, and bookmark actions, and auto-sync to backend.
  - `Detailed score card reports with Recharts topic charts and keys review`.
- **Administrative Hub**:
  - `Collapsible Sidebars` for quick control routing.
  - `Platform Metrics` (Counts and popularity completions charts).
  - `Pasted JSON Bulk Question Uploader`.
  - `User account rolings & Deletion tables`.

---

## Local Development Startup

### 1. Environmental Configurations
Copy `.env.example` into a new `.env` file and set the base Express API server URL:
```env
VITE_API_URL="http://localhost:5000/api"
```

### 2. Boot Local server
Execute the following scripts inside `frontend/`:
```bash
# Install dependencies
npm install

# Start local hot-reloaded dev server on Port 5173
npm run dev
```

---

## Vercel Deployment Instructions (Production)

Deploy this client to **Vercel** with maximum performance:

1. **Vercel Console**: Log in and import your GitHub repository.
2. **Project Configurations**:
   - Framework Preset: Select **Vite**.
   - Root Directory: Choose `frontend` (crucial since this is a monorepo setup).
3. **Build & Output Settings**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
4. **Environment Variables**:
   Attach the following production variable in Vercel's Dashboard:
   - Key: `VITE_API_URL`
   - Value: Set to your active **Render Backend URL** (e.g. `https://quizmania-api.onrender.com/api`).
5. **Deploy**: Trigger a production build. Vercel automatically manages HTTPS certificates and CDN distributions.
