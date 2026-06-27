# 🚀 StartupSense-AI

**StartupSense-AI** is a full-stack AI-powered startup idea validation platform built with **React, FastAPI, MongoDB Atlas, and Gemini AI**.
It helps users analyze startup ideas, generate business scores, view dashboards, manage history, export reports, and track AI-powered startup insights.

---

## 🌟 Project Highlights

* 🔐 Login and Sign Up authentication
* 🤖 AI-powered startup idea analysis
* 📊 Modern React dashboard
* 📈 Charts and analytics
* 📜 Startup analysis history
* 📄 Report generation and exports
* 👤 User profile system
* ⚙️ Advanced settings center
* 🌗 Light and dark theme support
* 🔔 Notification-ready system
* 🧠 Gemini AI integration
* ☁️ Backend deployed on Render
* 🗄️ MongoDB Atlas database

---

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* Tailwind CSS
* Framer Motion
* Recharts
* Lucide React
* TanStack Query
* Sonner Toasts

### Backend

* FastAPI
* Python
* Pydantic
* Uvicorn
* MongoDB Atlas
* Gemini AI

### Database

* MongoDB Atlas

### Deployment

* Render Backend
* React frontend deployment-ready

---

## 📂 Project Structure

```text
StartupSense-AI
│
├── backend
│   ├── main.py
│   ├── database.py
│   ├── routes
│   │   ├── auth.py
│   │   ├── ideas.py
│   │   └── user_system.py
│   ├── models
│   └── services
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── context
│   │   ├── hooks
│   │   ├── pages
│   │   ├── providers
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── docs
├── diagrams
├── screenshots
├── requirements.txt
└── README.md
```

---

## 🚀 Features

### Authentication

* User registration
* User login
* Protected dashboard access
* Logout support
* Password change API
* Email change API

### Startup Analysis

* Startup name
* Industry
* Problem statement
* Solution
* Target audience
* Revenue model
* Competitors
* AI-generated business analysis
* Startup score calculation
* Risk level
* Recommendation

### Dashboard

* Total startup ideas
* Average score
* Highest score
* Success rate
* Charts
* Recent activity
* System status
* Quick actions

### History

* View saved startup analyses
* Search records
* Sort by latest or score
* Export CSV

### Reports

* Select saved analysis
* Generate report summary
* Download report
* Print report
* Copy/share link

### Profile

* Profile photo upload
* User information
* Startup activity
* AI activity
* Achievements
* Export user data
* Download portfolio summary

### Settings

* Dark/light theme
* Accent color picker
* Font size
* Animations toggle
* Compact mode
* Notification preferences
* AI settings
* Data export
* Cache clearing
* Backend monitor
* Developer tools
* About section

---

## 🔌 API Endpoints

```text
POST /register
POST /login
POST /analyze
GET  /dashboard
GET  /history
GET  /profile
POST /profile
GET  /settings
POST /settings
GET  /notifications
POST /notifications
POST /change-password
POST /change-email
GET  /system/status
GET  /health
```

---

## ⚙️ Installation

### Backend

```bash
cd backend
pip install -r ../requirements.txt
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

Backend runs at:

```text
http://127.0.0.1:8000
```

---

## 🌐 Deployment

### Backend

Backend is deployed using **Render**.

### Frontend

Frontend can be deployed using:

* Vercel
* Netlify
* Render Static Site

---

## 🖼️ Screenshots

Add screenshots inside the `screenshots` folder:

```text
screenshots/Login_UI.png
screenshots/Dashboard_UI.png
screenshots/Analyze_UI.png
screenshots/History_UI.png
screenshots/Reports_UI.png
screenshots/Profile_UI.png
screenshots/Settings_UI.png
```

Then use:

```md
![Login UI](screenshots/Login_UI.png)
![Dashboard UI](screenshots/Dashboard_UI.png)
![Analyze UI](screenshots/Analyze_UI.png)
![Profile UI](screenshots/Profile_UI.png)
![Settings UI](screenshots/Settings_UI.png)
```

---

## 🧠 AI Integration

StartupSense-AI uses Gemini AI to generate business insights, recommendations, and startup validation feedback.

The AI system helps evaluate:

* Innovation
* Market potential
* Revenue model
* Competition level
* Risk
* Startup readiness

---

## 📊 Database Collections

```text
users
startup_ideas
analysis_results
reports
user_profiles
user_settings
notifications
login_history
system_logs
```

---

## 🔮 Future Enhancements

* JWT authentication
* Role-based access
* Advanced PDF reports
* Floating AI assistant
* Real-time notifications
* User-specific history filtering
* Admin dashboard
* Multi-theme engine
* Investor readiness scoring

---

## 👨‍💻 Developer

**Liju**
Artificial Intelligence and Data Science Student
VSB Engineering College

---

## ⭐ Project Status

```text
Backend        ✅ Completed
Frontend       ✅ React version active
Database       ✅ MongoDB Atlas connected
AI             ✅ Gemini AI integrated
Authentication ✅ Login/Register active
Dashboard      ✅ Working
Reports        ✅ Working
Profile        ✅ Working
Settings       ✅ Working
```

---

## 📌 Project Summary

StartupSense-AI is a modern AI SaaS-style platform designed to help users validate startup ideas using artificial intelligence, analytics, reports, and business insights.
