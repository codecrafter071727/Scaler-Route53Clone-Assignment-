# Scaler Route 53 Clone Assignment

AWS Route 53 Hosted Zones console clone with FastAPI auth.

## Structure

- `client/` — Next.js + TypeScript + Tailwind frontend
- `server/` — FastAPI + SQLite backend (modular auth)

SQLite is stored at `server/data/app.db` (created automatically). That path is fixed relative to the server package, so restarting uvicorn or changing the shell CWD does not wipe data. On hosts with ephemeral disks, mount a volume on `server/data` or set `DATABASE_URL` to Postgres.

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

Open [http://localhost:3000](http://localhost:3000), create an account, then sign in. Console routes use AWS-style paths under `/route53/v2/...` (for example `/route53/v2/hostedzones/Z…`). Your header shows a 12-digit account id.

## Auth API

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/signup` | Create account (all fields required) |
| POST | `/api/auth/signin` | Sign in + set httpOnly session cookie |
| POST | `/api/auth/signout` | Clear session |
| GET | `/api/auth/me` | Current user (session required) |
