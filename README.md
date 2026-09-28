# CivicLens AI

An AI-powered civic issue reporting platform built for the **Ideas for India Innovation Challenge 2026**.

Citizens can report public infrastructure problems like potholes, garbage overflow, broken streetlights, water leakage, and road damage. Each report goes through a structured workflow with real-time status updates, SLA tracking, and AI-powered image verification.

---

## Features

- Report civic issues with photos and GPS location
- YOLOv8-based AI verification for waste and pothole detection
- Full issue lifecycle — Pending → Reviewing → Assigned → In Progress → Resolved
- SLA countdown per issue with overdue detection
- Admin dashboard with analytics, priority override, and officer assignment
- Audit history for every status change
- Upvoting and comments on issues
- Real-time notifications
- Google OAuth + Email/Password login
- Interactive map explorer with live issue markers
- Dark mode support

---

## Tech Stack

**Frontend** — React 18, Vite, Tailwind CSS, Framer Motion, GSAP, Leaflet  
**Backend** — Node.js, Express, Prisma ORM, PostgreSQL, JWT, Nodemailer  
**AI Service** — Python, FastAPI, YOLOv8 (Ultralytics), Pillow  
**Storage** — Cloudinary  
**Deployment** — Vercel (frontend), Render (backend + AI)

---

## Getting Started

```bash
git clone https://github.com/RohitV33/CivicLens.git
cd civiclens-ai
```

**Client**
```bash
cd Client
npm install
npm run dev
```

**Server**
```bash
cd Server
npm install
npx prisma migrate dev
npm run dev
```

**AI Service**
```bash
cd AI
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

---

## Architecture

```
React Frontend
      |
      |--- Node.js + Express API (JWT auth, Prisma ORM, PostgreSQL)
      |
      |--- FastAPI AI Service (YOLOv8 waste + pothole detection)
```

---

## Developer

**Rohit Verma**  
B.Tech CSE, KIET Group of Institutions
