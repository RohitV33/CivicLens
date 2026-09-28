<div align="center">

# 🏙️ CivicLens AI

### AI-powered civic issue reporting, tracking, and city intelligence

<p>
  <a href="https://github.com/RohitV33/CivicLens">
    <img src="https://img.shields.io/github/stars/RohitV33/CivicLens?style=for-the-badge&logo=github&label=Stars" alt="GitHub Stars">
  </a>
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Python-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI">
  <img src="https://img.shields.io/badge/PostgreSQL-Prisma-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
</p>

**See the problem. Report the problem. Understand the problem.**

</div>

---

## 🚀 Overview

**CivicLens AI** is a full-stack civic issue reporting platform that connects citizens with municipal workflows through AI-assisted issue verification, location-based reporting, real-time status tracking, SLA visibility, notifications, and administrative analytics.

Citizens can report problems such as:

- 🕳️ Potholes
- 🗑️ Garbage and waste
- 💧 Water-related issues
- 🚧 Damaged roads
- 💡 Broken streetlights
- 🏚️ Other public infrastructure problems

Reports can include image evidence and location data.

---

## ✨ Core Features

### 👤 Citizen Experience

- Create and submit civic issue reports
- Upload image evidence
- AI-assisted image verification
- Interactive issue map
- Track complaint status
- SLA countdown tracking
- Upvote and comment on issues
- Before/after view for resolved issues
- Real-time notifications
- Dark mode
- Protected routes

### 🧑‍💼 Admin Experience

- Dedicated admin dashboard
- Review and manage complaints
- Assign officers
- Override issue priority
- Manage the complete issue lifecycle
- View issue history and audit records
- Access analytics and civic trends

### 🔐 Authentication & Security

- JWT authentication
- HttpOnly cookie-based auth
- Email/password authentication
- Google OAuth
- Password reset via email
- bcrypt password hashing
- Helmet security headers
- API and authentication rate limiting
- Zod request validation
- CORS controls

---

## 🤖 AI-Powered Detection

CivicLens separates the AI service from the main Node.js backend.

### Detection pipeline

```text
Uploaded Image
      │
      ▼
FastAPI AI Service
      │
      ├── YOLOv8 Waste Model
      └── YOLOv8 Pothole Model
      │
      ▼
Detection + Confidence
      │
      ▼
Civic Issue Data
```

### AI service

- `best.pt` — waste / garbage detection
- `civicmodel.pt` — pothole detection
- Configurable confidence threshold
- Spurious/full-frame detection filtering
- `/predict` inference endpoint
- Health-check endpoint
- Environment-based CORS

---

## 🗺️ Interactive Civic Map

CivicLens uses location as a core part of the reporting workflow.

> **What happened?** → AI / issue classification  
> **Where did it happen?** → Maps / location  
> **How widespread is it?** → Analytics

### Map stack

- Leaflet
- React Leaflet
- OpenStreetMap / map tiles
- Location-based issue visualization

---

## 🔄 Issue Lifecycle

```text
PENDING
   ↓
REVIEWING
   ↓
ASSIGNED
   ↓
IN_PROGRESS
   ↓
RESOLVED

   └──────────────→ REJECTED
```

The backend keeps an `IssueHistory` record for workflow changes and uses Prisma transactions for important status and assignment operations.

---

## 🏗️ Architecture

```text
                         ┌─────────────────┐
                         │     Citizen     │
                         └────────┬────────┘
                                  │
                                  ▼
                    ┌──────────────────────────┐
                    │ React + Vite Frontend    │
                    │ Tailwind + Animations    │
                    └────────────┬─────────────┘
                                 │
                              REST API
                                 │
                 ┌───────────────┴────────────────┐
                 ▼                                ▼
       ┌──────────────────┐             ┌──────────────────┐
       │ Node.js + Express│             │ FastAPI + YOLOv8 │
       │ Auth / Issues    │             │ Image Detection  │
       └────────┬─────────┘             └────────┬─────────┘
                │                                │
                ▼                                │
        ┌───────────────┐                        │
        │ Prisma ORM    │◄───────────────────────┘
        └───────┬───────┘
                │
                ▼
        ┌────────────────┐
        │  PostgreSQL    │
        └───────┬────────┘
                │
        ┌───────┴─────────┐
        ▼                 ▼
   Analytics         Issue History
                          │
                          ▼
                 Notifications / SLA
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router, Framer Motion, GSAP, Leaflet, React Leaflet, Lucide React |
| Backend | Node.js, Express 5, Prisma, JWT, bcrypt, Zod, Multer, Helmet, express-rate-limit, Nodemailer |
| Database | PostgreSQL, Prisma ORM |
| AI | Python, FastAPI, YOLOv8 / Ultralytics, Pillow |
| Authentication | JWT, Google OAuth 2.0 |
| Storage | Cloudinary |
| Deployment | Vercel, Render, PostgreSQL / Supabase |

---

## 📁 Project Structure

```text
CivicLens/
├── AI/
│   ├── app.py
│   ├── requirements.txt
│   ├── Procfile
│   └── model/
│       ├── best.pt
│       └── civicmodel.pt
│
├── Client/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── pages/
│       ├── App.jsx
│       └── main.jsx
│
├── Server/
│   ├── prisma/
│   └── src/
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       ├── services/
│       └── server.js
│
└── README.md
```

---

## ⚙️ Run Locally

### Prerequisites

Make sure you have:

- Node.js
- npm
- PostgreSQL
- Python
- Git

### 1. Clone the repository

```bash
git clone https://github.com/RohitV33/CivicLens.git
cd CivicLens
```

### 2. Frontend

```bash
cd Client
npm install
npm run dev
```

### 3. Backend

Open a new terminal:

```bash
cd Server
npm install
npx prisma migrate dev
npm run dev
```

### 4. AI Service

Open another terminal:

```bash
cd AI
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

Configure `ALLOWED_ORIGINS` for the AI service so it accepts requests from your frontend.

---

## 🔑 Environment Variables

Create the environment files required by each service.

Typical values include:

```env
# Client
VITE_API_BASE_URL=

# Server
DATABASE_URL=
JWT_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# AI
ALLOWED_ORIGINS=
```

Add any project-specific variables required by your current deployment.

> **Never commit real credentials, secrets, OAuth keys, or private API keys to GitHub.**

---

## 📊 Data & Analytics

CivicLens can turn individual reports into city-level information through:

- Total issue counts
- Category distribution
- Complaint activity
- Geographic patterns
- Civic trends
- Administrative analytics

---

## 🛡️ Security

The backend includes multiple layers of protection:

- JWT authentication
- HttpOnly cookies
- Password hashing
- Helmet
- Rate limiting
- CORS configuration
- Zod validation
- Environment variables
- Role-based access control

---

## 🌟 Why CivicLens?

CivicLens combines multiple areas of modern software engineering in one system:

```text
Frontend
   +
Backend APIs
   +
Authentication
   +
PostgreSQL
   +
Prisma
   +
Cloud Storage
   +
Computer Vision
   +
AI
   +
Maps
   +
Analytics
   +
Role-Based Workflows
```

The result is more than a basic complaint form: it is a connected workflow for **reporting, verifying, locating, tracking, and understanding civic issues**.

---

## 👨‍💻 Author

**Rohit Verma**  
B.Tech — Computer Science Engineering  
KIET Group of Institutions

GitHub: [@RohitV33](https://github.com/RohitV33)

---

## ⭐ Support

If you find CivicLens useful:

- ⭐ Star the repository
- 🍴 Fork the project
- 🐛 Open an issue
- 💡 Suggest an improvement

---

<div align="center">

### 🏙️ CivicLens AI

**See the problem. Report the problem. Understand the problem.**

</div>
