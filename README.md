<div align="center">

# CivicLens AI


AI-powered civic issue reporting for smarter, more responsive cities.

<p> <a href="https://civic-lens-blush.vercel.app/"> Live Demo</a> &nbsp; • &nbsp; <a href="https://github.com/RohitV33/CivicLens"> GitHub</a> </p>

</div>
---

## 📌 About CivicLens

CivicLens is a full-stack civic issue reporting platform that makes it easier for people to report everyday problems in their surroundings.

A pothole.

An overflowing garbage area.

A broken streetlight.

A water leakage.

Instead of these problems getting lost in messages, calls, or paper-based complaints, CivicLens provides one place where citizens can **report, analyze, locate, and track civic issues**.

What makes CivicLens different from a basic complaint management system is the combination of:

**AI + Image Analysis + Location Intelligence + Maps + Analytics + Full-Stack Web Technology**

The project was built to explore how modern technology can make civic reporting more useful for both citizens and the people responsible for solving these problems.

---

# 🚨 The Problem

Civic problems are easy to notice but often difficult to manage at scale.

Imagine hundreds of people reporting problems across a city.

Without a structured system, it becomes difficult to answer questions like:

* What exactly is the reported problem?
* Where is it happening?
* Is there visual evidence?
* Are similar problems being reported nearby?
* Which type of issue is most common?
* Which areas are affected the most?
* How can authorities prioritize their work?

CivicLens tries to bring these pieces together in a single platform.

---

# 💡 The Idea

The basic idea behind CivicLens is simple:

> **Let citizens report problems naturally, and use technology to turn those reports into useful civic data.**

A typical flow looks like this:

```text
        👤 Citizen
            │
            ▼
     📸 Report an Issue
            │
            ▼
     Image + Information
            │
            ▼
       🤖 AI Analysis
            │
            ▼
     📝 Structured Report
            │
            ▼
      📍 Location Data
            │
            ▼
       🗺️ Civic Map
            │
            ▼
       📊 Analytics
            │
            ▼
    🏛️ Issue Management
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

cd CivicLens
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

npm run dev
```

---

## 4. AI Service

```bash
cd AI

pip install -r requirements.txt
```

Then start the Python service according to the configuration in the `AI` directory.

---

# 🔑 Environment Variables

Create the required environment files using the `.env.example` files in the repository.

The configuration may include:

```env
DATABASE_URL=

JWT_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

GEMINI_API_KEY=

CLIENT_URL=
```

> ⚠️ Never commit real credentials, API keys, database passwords, OAuth secrets or JWT secrets to GitHub.

---

# 🧪 Development

The frontend uses Vite for local development.

```bash
npm run dev
```

The backend uses Nodemon during development:

```bash
npm run dev
```

For production-style backend execution:

```bash
npm start
```

---

# 📸 Screenshots

## 🏠 Landing Page

Add a screenshot of the CivicLens landing page here.

```text
docs/screenshots/landing.png
```

## 🤖 AI Detection

Add a screenshot showing the AI detection workflow.

```text
docs/screenshots/ai-detection.png
```

## 🗺️ Civic Map

Add a screenshot of the interactive issue map.

```text
docs/screenshots/map.png
```

## 📊 Analytics

Add a screenshot of the analytics dashboard.

```text
docs/screenshots/analytics.png
```

> These paths are placeholders. Add the actual screenshots to the repository before uncommenting Markdown image tags.

---

# 🚀 Deployment

The frontend is deployed and available online:

### 🔗 Live Application

https://civic-lens-blush.vercel.app/

The repository also contains a dedicated AI service and backend, which can be deployed independently depending on the hosting environment.

---

# 🔒 Important Note About AI

AI predictions are not always perfect.

Computer vision models can be affected by:

* Image quality
* Lighting
* Camera angle
* Occlusion
* Similar-looking objects
* Unusual environments
* Training-data limitations

For this reason, CivicLens treats AI as an **assistive system**, rather than assuming that every prediction is automatically correct.

The goal is to help structure and understand reports — not blindly replace human judgment.

---

# 📈 Future Improvements

The core CivicLens application is built and working, but there is always room to make it better.

Some improvements I would like to explore are:

* Better model accuracy
* More civic issue classes
* Duplicate complaint detection
* Automatic department routing
* AI-based priority scoring
* More detailed heatmaps
* Real-time notifications
* Advanced authority dashboard
* Historical trend analysis
* Better AI confidence handling
* Larger-scale municipal integration

These are improvements to the existing system, not requirements for the current application.

---

# 🧑‍💻 What I Learned Building CivicLens

Building CivicLens involved much more than writing frontend components.

Some of the things I worked with during the project include:

* Designing a full-stack application
* Building REST APIs
* Working with PostgreSQL and Prisma
* Implementing JWT authentication
* Handling image uploads
* Integrating AI services
* Working with computer vision
* Building interactive maps
* Managing environment variables
* Deploying web services
* Connecting multiple services together
* Thinking about security and API protection
* Designing an application around a real-world problem

The biggest lesson was that building a real application is less about using a single technology and more about **making many technologies work together reliably.**

---

# 🎯 Vision

The long-term idea behind CivicLens is simple:

> **Turn everyday citizen observations into useful civic intelligence.**

A citizen should be able to report a problem without worrying about complicated processes.

At the same time, the resulting data should be structured enough to help identify patterns across a city.

That's the direction CivicLens is built around.

---

# 👨‍💻 Author

## Rohit Verma

**B.Tech Computer Science Engineering**
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
