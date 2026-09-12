# 🎮 Life RPG

A cyberpunk-themed productivity app that turns your real-life tasks into RPG missions. Complete quests, earn XP, level up, build streaks, and grow your character's attributes — all while getting things done in real life.

Built for **Tech Zephyr 4.0 Hackathon**.

---

## ✨ Features

- **Secure Authentication** — JWT-based signup/login with bcrypt password hashing
- **Mission (Task) Management** — Full CRUD: create, view, update, delete, and complete missions
- **Non-linear XP & Leveling Engine** — Each level requires progressively more XP (Level × 100)
- **Character Attributes** — Missions are categorized (Intellect / Strength / Discipline) and grow the matching stat
- **Streak Tracking** — Tracks consecutive days of activity
- **Currency Rewards** — Earn Credits on leveling up
- **Cyberpunk UI** — Neon glow, glitch-text animations, animated grid background, and a celebratory Level-Up modal
- **Optimistic, Responsive UI** — Smooth XP bar animations and instant feedback on every action

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript (Vanilla) |
| Backend | Node.js, Express.js |
| Database | MongoDB (Atlas), Mongoose |
| Auth | JWT (jsonwebtoken), bcryptjs |

---

## 📁 Project Structure

```
life-rpg/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   ├── .env.example
│   └── server.js
└── frontend/
    ├── css/
    │   ├── style.css
    │   └── dashboard.css
    ├── js/
    │   ├── auth.js
    │   └── dashboard.js
    ├── index.html
    └── dashboard.html
```

---

## 🚀 Getting Started (Local Setup)

### Prerequisites
- Node.js (v18+ recommended)
- A MongoDB Atlas account (free tier works)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd life-rpg
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder (use `.env.example` as a reference):
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_random_secret_key
```

Run the backend:
```bash
npm run dev
```
Server will start on `http://localhost:5000`.

### 3. Frontend Setup
Open `frontend/index.html` using the **Live Server** extension in VS Code (or any static server). Make sure `API_BASE` / `API_URL` in `js/auth.js` and `js/dashboard.js` points to your backend URL.

---

## 🔑 API Endpoints

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/auth/signup` | Register a new user | No |
| POST | `/api/auth/login` | Login and receive JWT | No |
| GET | `/api/tasks` | Get all missions for logged-in user | Yes |
| POST | `/api/tasks` | Create a new mission | Yes |
| PUT | `/api/tasks/:id` | Update a mission | Yes |
| DELETE | `/api/tasks/:id` | Delete a mission | Yes |
| PATCH | `/api/tasks/:id/complete` | Complete a mission (grants XP) | Yes |

---

## 🎮 Core Game Logic

- **Leveling Formula:** XP required for next level = `current level × 100`
- **Attributes:** Completing a mission increases the attribute tied to its category (Intellect / Strength / Discipline)
- **Streaks:** Incremented when a mission is completed on consecutive calendar days; resets if a day is missed
- **Currency:** +20 Credits awarded on every level-up

---

## 🤖 AI Tools Used

- **Claude (Anthropic)** — used for architecture guidance, debugging (MongoDB DNS/connection issues), and boilerplate code generation for backend routes/controllers and frontend UI

---

## 👥 Team

- **Pragya Rathi** — Backend & Core Logic (Authentication, Database, XP/Leveling Engine, API)
- **Harshita** — Frontend/UI Styling (Cyberpunk theme, animations, responsive design)
- **Suhani Sharma** — Content, Testing, Documentation & Demo Video/Presentation

---

## 📹 Demo Video

[Link to demo video — to be added]

## 🌐 Live Deployment

- **Frontend (Live App):** https://lustrous-cupcake-455d9c.netlify.app
- **Backend API:** https://liferpg-backend-t668.onrender.com
- **GitHub Repository:** https://github.com/pragya-rathi786/life-rpg
