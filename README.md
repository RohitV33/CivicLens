<div align="center">

# CivicLens AI

CivicLens AI is a full-stack civic issue reporting platform that empowers citizens to report public infrastructure problems — potholes, garbage overflow, water leakage, damaged roads, broken streetlights, and more. The platform connects citizens with municipal authorities through an AI-assisted digital workflow featuring real-time status tracking, SLA enforcement, and computer-vision-powered issue verification.

---

# 🚨 The Problem

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

# 💡 The Idea

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

# ✨ Features

## 👤 Citizen Reporting

Users can report civic problems through the application and provide the information needed to understand the issue.

Supported use cases include:

* 🕳️ Potholes
* 🗑️ Garbage and waste
* 💧 Water-related problems
* 🚧 Damaged roads
* 💡 Broken streetlights
* 🏚️ Other public infrastructure issues

Users can provide visual evidence through image uploads.

---

## 🤖 AI-Powered Image Detection

One of the main parts of CivicLens is its AI layer.

Instead of treating an uploaded image as just an attachment, CivicLens can process it through a dedicated computer-vision service.

The workflow is:

```text
Image
  ↓
AI Model
  ↓
Object / Issue Detection
  ↓
Detected Category
  ↓
Confidence
  ↓
Civic Issue Data
```

The repository contains a separate Python AI service along with trained model weights.

This keeps the AI system independent from the main Node.js application and makes it easier to improve the model separately.

---

## 📸 Image Upload

CivicLens provides an image-upload workflow for civic complaints.

Images can be used as visual evidence for reported problems and can also be passed through the AI detection pipeline.

The backend includes file-upload handling and Cloudinary integration for media management.

---

## 🗺️ Interactive Civic Map

Location is extremely important when dealing with civic problems.

A complaint without location tells you **what** happened.

A complaint with location tells you **where** the city needs attention.

CivicLens uses:

* Leaflet
* React Leaflet
* Interactive maps
* Location-based issue visualization

This allows civic problems to be viewed geographically instead of only as individual records.

---

## 📊 City Analytics

CivicLens also provides an analytics layer for understanding the collected civic data.

The analytics experience can help visualize patterns such as:

* Total reported issues
* Issue categories
* Distribution of problems
* Geographic patterns
* Complaint activity
* City-level civic trends

The idea is to turn individual reports into information that can help identify larger problems.

---

## 🔐 Authentication

CivicLens includes secure authentication functionality.

The backend supports:

* JWT authentication
* User registration
* User login
* Password hashing
* Google authentication
* Protected application flows

Passwords are handled using `bcrypt`, while JWT is used for authentication and authorization.

---

## 🛡️ Backend Security

Security was considered while building the backend.

The project uses:

* `Helmet`
* `express-rate-limit`
* `bcrypt`
* `JWT`
* `Zod`
* CORS configuration
* Environment variables
* Secure authentication handling

The purpose is to avoid treating the backend as simply a collection of open APIs.

---

# 🧠 AI Architecture

CivicLens separates the AI layer from the main application.

```text
                     CivicLens
                         │
          ┌──────────────┴──────────────┐
          │                             │
          ▼                             ▼
   Web Application                 AI Service
          │                             │
          ▼                             ▼
 React + Node.js                 Python + CV Model
          │                             │
          │                             ▼
          │                       Image Analysis
          │                             │
          └──────────────┬──────────────┘
                         │
                         ▼
                  Civic Issue Data
```

This separation makes the system easier to maintain because the AI model and application backend don't have to be tightly coupled.

---

# 🏗️ System Architecture

```text
                         ┌─────────────────┐
                         │     Citizen     │
                         └────────┬────────┘
                                  │
                                  ▼
                     ┌────────────────────────┐
                     │    React Frontend      │
                     │ Vite + Tailwind CSS    │
                     └────────────┬───────────┘
                                  │
                              REST API
                                  │
                                  ▼
                     ┌────────────────────────┐
                     │    Node.js + Express   │
                     └────────────┬───────────┘
                                  │
          ┌───────────────────────┼───────────────────────┐
          │                       │                       │
          ▼                       ▼                       ▼
   ┌─────────────┐        ┌─────────────┐         ┌─────────────┐
   │    Auth     │        │  Complaint  │         │  AI Service │
   │ JWT / OAuth │        │   System    │         │  Detection  │
   └─────────────┘        └──────┬──────┘         └─────────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │  Prisma ORM     │
                         └────────┬────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │   PostgreSQL    │
                         └────────┬────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
             🗺️ Maps & Location          📊 Analytics
```

---

# 🛠️ Tech Stack

## Frontend

| Technology    | Purpose               |
| ------------- | --------------------- |
| React.js      | User interface        |
| Vite          | Frontend tooling      |
| Tailwind CSS  | Styling               |
| React Router  | Application routing   |
| Framer Motion | UI animations         |
| GSAP          | Advanced animations   |
| Leaflet       | Maps                  |
| React Leaflet | React map integration |
| Lucide React  | Icons                 |

The frontend package includes React, Vite, Tailwind CSS, Framer Motion, GSAP, Leaflet, React Leaflet and React Router.

---

## Backend

| Technology         | Purpose             |
| ------------------ | ------------------- |
| Node.js            | Server runtime      |
| Express.js         | REST API            |
| Prisma             | Database ORM        |
| JWT                | Authentication      |
| bcrypt             | Password hashing    |
| Zod                | Input validation    |
| Multer             | File uploads        |
| Cloudinary         | Media storage       |
| Helmet             | Security headers    |
| Express Rate Limit | API protection      |
| Nodemailer         | Email functionality |
| Google Auth        | Authentication      |

The backend dependencies include Prisma, Google AI packages, bcrypt, Cloudinary, JWT, Helmet, rate limiting, Multer, Nodemailer and Zod.

---

## Database

* PostgreSQL
* Prisma ORM

---

## AI

* Python
* Computer Vision
* YOLO-based detection
* Google Gemini / Generative AI

---

# 📁 Project Structure

```text
CivicLens/
│
├── AI/
│   ├── app.py
│   ├── requirements.txt
│   ├── Procfile
│   ├── README.md
│   └── model/
│       ├── best.pt
│       └── civicmodel.pt
│
├── Client/
│   ├── public/
│   │   ├── logo.png
│   │   ├── logo-transparent.png
│   │   ├── logo_civic.png
│   │   ├── manifest.json
│   │   └── sw.js
│   │
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── AiDetectionDemo.jsx
│       │   ├── CityAnalytics.jsx
│       │   ├── ImageUploader.jsx
│       │   ├── LeafletMap.jsx
│       │   ├── LiveMapSection.jsx
│       │   ├── GoogleAuthButton.jsx
│       │   ├── BeforeAfterSlider.jsx
│       │   └── ...
│       │
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

# 🔄 Civic Issue Workflow

A simplified version of the application workflow:

```text
1. User notices a civic problem
              ↓
2. User opens CivicLens
              ↓
3. User uploads an image
              ↓
4. AI analyzes the image
              ↓
5. Issue information is processed
              ↓
6. Complaint is created
              ↓
7. Location is associated with the issue
              ↓
8. Issue becomes part of the civic data
              ↓
9. Maps and analytics help visualize the problem
```

---

# 🌍 Why Maps + AI?

Individually, both technologies are useful.

Together, they become much more interesting.

### AI answers:

> **"What is wrong?"**

### Location answers:

> **"Where is it happening?"**

### Analytics answers:

> **"How big is the problem?"**

CivicLens brings all three together.

---

# 🔥 What makes this project different?

CivicLens isn't just:

```text
React + CRUD + Database
```

The project combines multiple parts of modern software engineering:

```text
        Frontend
           +
        Backend
           +
        Authentication
           +
        PostgreSQL
           +
        Prisma
           +
        Image Processing
           +
        Computer Vision
           +
        AI
           +
        Maps
           +
        Analytics
           +
        Cloud Storage
```

That combination is what makes CivicLens a full-stack project rather than just a complaint form.

---

# ⚙️ Running Locally

## Prerequisites

Make sure you have installed:

* Node.js
* npm
* PostgreSQL
* Python
* Git

---

## 1. Clone the repository

```bash
git clone https://github.com/RohitV33/CivicLens.git
cd civiclens-ai
```

---

## 2. Frontend

```bash
cd Client

npm install

npm run dev
```

---

## 3. Backend

Open another terminal:

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

## 4. AI Service

To build an indigenous AI-powered civic governance platform that enables municipalities to process complaints faster, improve operational efficiency, and deliver smarter public services across India.

---

# 🔑 Environment Variables

**Rohit Verma**  
B.Tech Computer Science Engineering  
KIET Group of Institutions

GitHub: [@RohitV33](https://github.com/RohitV33)

---

# ⭐ Support

If you find CivicLens interesting, feel free to:

⭐ Star the repository
🍴 Fork the project
🐛 Open an issue
💡 Suggest an improvement

---

<p align="center">

### 🏙️ CivicLens AI

**See the problem. Report the problem. Understand the problem.**

</p>
