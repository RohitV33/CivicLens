# 🏙️ CivicLens AI

> **AI-Powered Urban Governance Platform for Smarter Cities**

CivicLens AI is a full-stack civic issue reporting platform that empowers citizens to report public infrastructure problems — potholes, garbage overflow, water leakage, damaged roads, broken streetlights, and more. The platform connects citizens with municipal authorities through an AI-assisted digital workflow featuring real-time status tracking, SLA enforcement, and computer-vision-powered issue verification.

---

## ✨ Features

### 🌐 Frontend (React + Vite + Tailwind CSS)
- ✅ Animated page transitions with Framer Motion & GSAP
- ✅ Citizen & Admin dashboards
- ✅ Issue reporting with AI-powered image verification
- ✅ Interactive map explorer (Leaflet + OpenStreetMap)
- ✅ SLA countdown tracking per issue
- ✅ Real-time notifications
- ✅ Google OAuth + Email/Password authentication
- ✅ Before/After image slider for resolved issues
- ✅ Dark mode support
- ✅ Protected routes with role-based access control (USER / ADMIN)

### ⚙️ Backend (Node.js + Express + Prisma)
- ✅ JWT-based authentication with HttpOnly cookies
- ✅ Google OAuth (google-auth-library)
- ✅ Password reset via email (Nodemailer)
- ✅ Cloudinary image uploads
- ✅ Full issue lifecycle management (PENDING → REVIEWING → ASSIGNED → IN_PROGRESS → RESOLVED / REJECTED)
- ✅ Admin analytics dashboard
- ✅ Priority override, officer assignment
- ✅ Audit history (IssueHistory) with Prisma transactions
- ✅ Upvoting and community comments
- ✅ Helmet, CORS, rate limiting (auth + API)
- ✅ Zod request validation

### 🤖 AI Service (Python + FastAPI + YOLOv8)
- ✅ Dual YOLOv8 model pipeline:
  - `best.pt` — Waste / garbage detection & classification
  - `civicmodel.pt` — Pothole detection
- ✅ Full-frame spurious detection filter (noise suppression)
- ✅ Configurable confidence threshold (env-based)
- ✅ `/predict` endpoint returning structured detection JSON
- ✅ Health check endpoint
- ✅ Origin-restricted CORS via environment variable

### 🗄️ Database (PostgreSQL + Prisma ORM)
- ✅ `User`, `Issue`, `Comment`, `Upvote`, `IssueHistory`, `Notification`, `PasswordResetToken`
- ✅ Enum-driven Category, Status, Priority, Department, Role
- ✅ Atomic Prisma transactions for status changes and assignments

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion, GSAP, Leaflet |
| Backend | Node.js, Express 5, Prisma ORM, Zod, JWT, Nodemailer |
| AI Service | Python, FastAPI, YOLOv8 (Ultralytics), Pillow |
| Database | PostgreSQL (Supabase) |
| Storage | Cloudinary |
| Auth | JWT, Google OAuth 2.0 |
| Deployment | Vercel (Client), Render (Server + AI) |

---

## 🏗️ System Architecture

```text
Citizen (Browser)
      │
      ▼
React Frontend (Vite + Tailwind)
      │
      ├──────────────────────────────────────┐
      ▼                                      ▼
Node.js + Express API              FastAPI AI Service
      │   JWT / Cookie Auth               │   YOLOv8 Models
      ▼                                   │   (waste + pothole)
Prisma ORM ──► PostgreSQL        ◄────────┘
                                    /predict endpoint
      │
      ▼
Admin Dashboard (Role-based)
      │
      ▼
Notifications, SLA Tracking, Analytics
```

---

## 🚀 Getting Started

```bash
git clone https://github.com/RohitV33/CivicLens.git
cd civiclens-ai
```

### Client

```bash
cd Client
npm install
npm run dev
```

### Server

```bash
cd Server
npm install
npx prisma migrate dev
npm run dev
```

### AI Service

```bash
cd AI
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

Set `ALLOWED_ORIGINS` in the AI `.env` to match your frontend URL.

---

## 🎯 Vision

To build an indigenous AI-powered civic governance platform that enables municipalities to process complaints faster, improve operational efficiency, and deliver smarter public services across India.

---

## 👨‍💻 Developer

**Rohit Verma**  
B.Tech Computer Science Engineering  
KIET Group of Institutions

---

⭐ *Built for the Ideas for India Innovation Challenge 2026.*
