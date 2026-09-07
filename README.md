# Scaler Route 53 Clone Assignment

AWS Route 53 Hosted Zones console clone with FastAPI auth.

## Structure

- `client/` — Next.js + TypeScript + Tailwind frontend
- `server/` — FastAPI + SQLite backend (modular auth)

## Environment

Copy examples and adjust as needed (no hardcoded API URLs in app code):

- `server/.env.example` → `server/.env`
- `client/.env.example` → `client/.env.local`

## Run locally

### Server

```bash
cd server
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Client

```bash
cd client
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), create an account, then sign in to reach hosted zones.

## Auth API

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/signup` | Create account (all fields required) |
| POST | `/api/auth/signin` | Sign in + set httpOnly session cookie |
| POST | `/api/auth/signout` | Clear session |
| GET | `/api/auth/me` | Current user (session required) |
