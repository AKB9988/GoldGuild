<div align="center">

# 🏆 GoldGuild

### *Gamified Personal Finance — Track, Save, Compete, Level Up*

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.6-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://openjdk.org/projects/jdk/21/)
[![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20App-FFD700?style=for-the-badge&logo=vercel&logoColor=black)](https://gold-guild.vercel.app/)

---

**[🚀 Live Demo](https://gold-guild.vercel.app/) · [Overview](#-overview) · [Features](#-features) · [Tech Stack](#️-tech-stack) · [Getting Started](#-getting-started) · [API Reference](#-api-reference) · [XP System](#-xp--level-system)**

</div>

---

## 📖 Overview

**GoldGuild** is a full-stack gamified personal finance app that turns budgeting into an RPG-like experience. Earn XP for logging expenses, level up your profile, unlock achievement badges, maintain daily streaks, and compete on a global leaderboard.

> 💡 **Core Philosophy:** Financial discipline shouldn't feel like a chore. GoldGuild rewards good habits with a game-like progression system that keeps users motivated.

---

## ✨ Features

| Module | Highlights |
|---|---|
| 💰 **Expenses** | Log across 6 categories, full CRUD, filter by month, earn +10 XP per log |
| 📊 **Budgets** | Per-category monthly budgets, live spent vs. remaining, earn +50 XP for staying under |
| 🎯 **Saving Goals** | Create goals, contribute incrementally, earn +20 XP per contribution, +100 XP on completion |
| 🏆 **Gamification** | XP system, level-up every 500 XP, 7-day & 30-day streaks, 9 unique badges |
| 👥 **Social** | Friend requests by username, global XP leaderboard |
| 📈 **Analytics** | Visual spending breakdowns and monthly comparisons |
| 🔐 **Auth** | JWT-based stateless auth, BCrypt password hashing, secured REST endpoints |

### 🎖️ Achievement Badges

| Badge | Unlock Condition |
|---|---|
| `FIRST_EXPENSE` | Log your first expense |
| `FIRST_GOAL` | Create your first saving goal |
| `GOAL_COMPLETED` | Fully complete a goal |
| `UNDER_BUDGET` | Stay under budget for a category |
| `STREAK_7` / `STREAK_30` | Maintain a 7-day or 30-day streak |
| `LEVEL_5` | Reach Level 5 |
| `XP_1000` | Accumulate 1,000 total XP |

---

## 🏗️ Architecture

```mermaid
flowchart LR
    U(("👤 User"))

    subgraph FE["🌐 Frontend"]
        R["React\nPages & Components"]
        AX["Axios\nHTTP Client"]
    end

    subgraph BE["☕ Backend"]
        JWT["🔐 JWT Filter"]
        CTL["Controller\nREST Layer"]
        DTO["DTO\nRequest / Response"]
        SVC["Service\nBusiness Logic"]
        REPO["Repository\nSpring Data JPA"]
    end

    DB[("🗄️ MySQL 8")]

    SCHED["⏰ Scheduler\nCron Jobs"]

    U -->|"interacts"| R
    R --> AX
    AX -->|"HTTP Request\n+ Bearer Token"| JWT
    JWT -->|"validates"| CTL
    CTL <-->|"maps"| DTO
    DTO --> SVC
    SVC --> REPO
    REPO -->|"SQL"| DB
    SCHED -->|"triggers"| SVC

    style FE fill:#0d2137,color:#fff,stroke:#61DAFB,stroke-width:2px
    style BE fill:#0d1f0d,color:#fff,stroke:#6DB33F,stroke-width:2px
    style DB fill:#0d1226,color:#fff,stroke:#4479A1,stroke-width:2px
    style SCHED fill:#2a1a00,color:#fff,stroke:#f59e0b,stroke-width:2px
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Backend** | Java 21, Spring Boot 4, Spring Security, Spring Data JPA, JJWT 0.12, MySQL 8 |
| **Frontend** | React 19, Vite 8, TailwindCSS 4, shadcn/ui, TanStack Query 5, React Router 7, Axios |

---

## 🚀 Getting Started

### Prerequisites
- Java 21+, Maven (or use `mvnw`)
- Node.js 18+ and npm
- MySQL 8+ running locally

### 1. Clone

```bash
git clone https://github.com/your-username/GoldGuild.git
cd GoldGuild
```

### 2. Backend Setup

Create a MySQL database:
```sql
CREATE DATABASE goldguild;
```

Create `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/goldguild
spring.datasource.username=YOUR_DB_USERNAME
spring.datasource.password=YOUR_DB_PASSWORD
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update

jwt.secret=YOUR_SUPER_SECRET_KEY_AT_LEAST_256_BITS_LONG
jwt.expiration=86400000

server.port=8080
```

> ⚠️ **Never commit `application.properties` to version control** — it is already in `.gitignore`.

Run the backend:
```bash
# Windows
mvnw.cmd spring-boot:run

# Mac / Linux
./mvnw spring-boot:run
```

API live at → `http://localhost:8080`

### 3. Frontend Setup

```bash
cd Frontend/GoldGuild_Frontend
npm install
npm run dev
```

Frontend live at → `http://localhost:5173`

---

## 📡 API Reference

| Controller | Base Path | Key Endpoints |
|---|---|---|
| `AuthController` | `/api/auth` | `POST /register`, `POST /login` |
| `ExpenseController` | `/api/expenses` | `GET`, `POST`, `PUT /{id}`, `DELETE /{id}`, `GET /month/{month}` |
| `BudgetController` | `/api/budgets` | `POST`, `GET /status?month=` |
| `SavingGoalController` | `/api/goals` | `GET`, `POST`, `PUT /{id}/contribute`, `DELETE /{id}` |
| `GamificationController` | `/api/gamification` | `GET /profile`, `GET /leaderboard` |
| `FriendshipController` | `/api/friends` | `POST /request`, `PUT /{id}/accept`, `GET /pending`, `GET` |

All protected endpoints require:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🎮 XP & Level System

```
Level = floor(Total XP / 500) + 1

XP Rewards:
  Log an expense      →  +10 XP
  Contribute to goal  →  +20 XP
  Stay under budget   →  +50 XP
  Complete a goal     → +100 XP
```

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

Built with ❤️ · Powered by Spring Boot & React · Designed to make finance fun

</div>
