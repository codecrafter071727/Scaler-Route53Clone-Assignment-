# Scaler Route 53 Clone Assignment

AWS Route 53 Hosted Zones console clone.

## Structure

- `client/` — Next.js + TypeScript + Tailwind frontend
- `server/` — FastAPI + SQLite backend

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

Open [http://localhost:3000/hostedzones](http://localhost:3000/hostedzones).
