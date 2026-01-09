# Diary App (React + Tailwind + Express + MongoDB)

A clean, deployable diary application:
- **Today** editor with "not yet entered" state
- **This week** notes list
- **Calendar navigation** to jump to any date and see which days have entries
- Email/password auth (JWT access token + httpOnly refresh cookie)
- MongoDB (Atlas cluster compatible)

## Repo structure
- `apps/api` – Express + TypeScript + Mongoose
- `apps/web` – React (Vite) + Tailwind + TanStack Query

## Prereqs
- Node.js 18+ (recommended 20+)
- A MongoDB Atlas URI

## Quick start (local)

### 1) Install
```bash
npm install
```

### 2) Configure env
Copy examples:
```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

Edit `apps/api/.env`:
- `MONGODB_URI=...`
- `JWT_ACCESS_SECRET=...`
- `JWT_REFRESH_SECRET=...`
- `CLIENT_ORIGIN=http://localhost:5173`

Edit `apps/web/.env`:
- `VITE_API_URL=http://localhost:8080`

### 3) Run
```bash
npm run dev
```
- Web: http://localhost:5173
- API: http://localhost:8080/health

## Deploy

### Option A: Separate deploy (recommended)
- Deploy `apps/web` to Vercel/Netlify (set `VITE_API_URL` to your API URL)
- Deploy `apps/api` to Render/Fly/Railway (set env vars, allow CORS from web origin)

### Option B: Docker
Each app has a Dockerfile.
See `apps/api/README_DEPLOY.md` and `apps/web/README_DEPLOY.md`.

## Notes about dates & timezone
Notes are stored by **dateKey = YYYY-MM-DD** in the user's timezone.
User timezone is stored on the profile and used to compute `dateKey` on the client.
