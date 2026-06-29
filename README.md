# 🚀 StartupSense-AI

> **AI-Powered Startup Validation Platform** built with **React +
> Vite**, **FastAPI**, **MongoDB Atlas**, and **Google Gemini AI**.

![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?logo=react)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi)
![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?logo=mongodb)
![Gemini](https://img.shields.io/badge/AI-Google%20Gemini-4285F4?logo=google)
![License](https://img.shields.io/badge/License-Educational-blue)

------------------------------------------------------------------------

## 🌐 Live Demo

-   **Frontend:** https://startupsense-ai.vercel.app
-   **Backend:** https://startupsense-ai-backend.onrender.com
-   **API Docs:** https://startupsense-ai-backend.onrender.com/docs

------------------------------------------------------------------------

# 📖 Project Overview

StartupSense-AI is a modern SaaS-style web application that helps
entrepreneurs validate startup ideas using Artificial Intelligence.
Users can securely log in, submit startup ideas, receive AI-powered
business analysis, review previous analyses, and visualize insights
through an interactive dashboard.

------------------------------------------------------------------------

# 🎯 Objectives

-   Validate startup ideas with AI
-   Provide SWOT and business analysis
-   Evaluate market potential and revenue opportunities
-   Store analysis history in MongoDB Atlas
-   Deliver a modern, responsive user experience
-   Deploy a production-ready full-stack application

------------------------------------------------------------------------

# ✨ Features

-   Secure User Authentication
-   AI Startup Analysis
-   SWOT Analysis
-   Market Potential Evaluation
-   Revenue & Risk Analysis
-   Dashboard Analytics
-   Searchable History
-   Reports
-   User Profile
-   Settings
-   Dark / Light Theme
-   MongoDB Atlas Storage
-   Responsive UI
-   Render + Vercel Deployment

------------------------------------------------------------------------

# 🏗️ System Architecture

Frontend (React + Vite) │ ▼ REST API (FastAPI) │ ▼ Google Gemini AI │ ▼
MongoDB Atlas

------------------------------------------------------------------------

# 🛠️ Technology Stack

## Frontend

-   React
-   Vite
-   Tailwind CSS
-   Framer Motion
-   TanStack Query
-   Lucide Icons

## Backend

-   Python
-   FastAPI
-   Uvicorn

## Database

-   MongoDB Atlas

## AI

-   Google Gemini

------------------------------------------------------------------------

# 📂 Project Structure

``` text
backend/
 ├── models/
 ├── routes/
 ├── services/
 └── main.py

frontend/
 ├── public/
 ├── src/
 │   ├── components/
 │   ├── context/
 │   ├── hooks/
 │   ├── pages/
 │   └── providers/

screenshots/
README.md
requirements.txt
```

------------------------------------------------------------------------

# 📸 Screenshots

Place screenshots in:

``` text
screenshots/app/
screenshots/mongodb/
screenshots/deployment/
screenshots/github/
```

Example:

``` md
![Dashboard](screenshots/app/04-dashboard.png)
```

------------------------------------------------------------------------

# ⚙️ Installation

## Clone Repository

``` bash
git clone https://github.com/liju70104/StartupSense-ai.git
cd StartupSense-ai
```

## Backend

``` bash
pip install -r requirements.txt
uvicorn backend.main:app --reload
```

## Frontend

``` bash
cd frontend
npm install
npm run dev
```

------------------------------------------------------------------------

# 🔐 Environment Variables

``` env
MONGODB_URI=your_connection_string
GEMINI_API_KEY=your_api_key
SECRET_KEY=your_secret_key
```

------------------------------------------------------------------------

# 🚀 Deployment

## Frontend

-   Vercel

## Backend

-   Render

------------------------------------------------------------------------

# 🔌 API

  Method   Endpoint
  -------- ------------
  POST     /register
  POST     /login
  POST     /analyze
  GET      /dashboard
  GET      /history

------------------------------------------------------------------------

# 🍃 MongoDB Atlas

Collections:

-   users
-   startup_ideas
-   history

------------------------------------------------------------------------

# 📈 Future Improvements

-   Email verification
-   Password reset by email
-   Team collaboration
-   Investor dashboard
-   PDF exports
-   Notifications

------------------------------------------------------------------------

# 👨‍💻 Author

**Liju S**

Second-Year Artificial Intelligence & Data Science Student

------------------------------------------------------------------------

# 📄 License

This project is intended for educational, learning, and portfolio
purposes.

⭐ If you found this project useful, consider giving it a star on
GitHub.
