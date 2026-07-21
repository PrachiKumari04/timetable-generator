# 📅 Intelligent University Timetable Generator & Management System

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v19-blue.svg)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-v5-black.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen.svg)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-ISC-orange.svg)](#license)

An end-to-end, full-stack automated timetable generation and academic scheduling platform. Designed for universities and educational institutions, it uses a constraint solver engine to generate conflict-free schedules for lectures, labs, electives, and faculty workloads while providing real-time analytics and calendar integrations.

---

## 🌟 Key Features

### 🤖 1. Automated Constraint Solver Engine
- **Clash-Free Scheduling**: Prevents overlapping slots for teachers, classrooms, and student divisions.
- **8-Slot Daily Schedule**: Structured schedule supporting 8 daily operational periods and mandatory lunch breaks.
- **Auto-Fill Idle Slots**: Automatically schedules constructive periods (Mentoring, Library, Self-Study) during open student slots.
- **Lab & Consecutive Period Handling**: Multi-period lab allocations with dedicated lab-room constraint checks.

### 🏫 2. Smart Room Allocation & Parallel Electives
- **Home & Guest Classroom Routing**: Handles simultaneous parallel elective courses by assigning home classrooms to main cohorts and guest rooms to elective divisions.
- **Capacity & Facility Match**: Matches batch sizes and practical requirements with room capacities and specialized lab features.

### 🔐 3. Multi-Role Access Control (RBAC)
- **Admin Portal**: Complete control over master data, curriculum rules, room allocations, and timetable generation.
- **Faculty Portal**: Personalized schedule view, assigned subject load tracking, and calendar exports.
- **Student Portal**: Division-wise timetable, elective slot tracking, and personal calendar sync.

### 📊 4. Interactive Dashboards & Analytics
- **Visual Analytics**: Interactive charts detailing room occupancy rates, faculty workload distributions, and slot usage.
- **iCalendar (.ics) Sync**: Export personalized schedules directly to Google Calendar, Apple Calendar, or Outlook.
- **Export & Print**: Download timetables as PNG images or Excel spreadsheets (`.xlsx`).

---

## 🛠️ Tech Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 19, Vite, Redux Toolkit, Tailwind CSS v4, React Router DOM v7, React Hot Toast, Lucide Icons |
| **Backend** | Node.js, Express.js (v5), Mongoose (v9), MongoDB, JWT (JSON Web Tokens), Bcryptjs |
| **Utilities** | iCalendar Export, `xlsx` Excel Generator, `html-to-image` / `html2canvas` |

---

## 📁 Repository Structure

```
TimeTable/
├── Backend/                      # Node.js & Express API Server
│   ├── src/
│   │   ├── config/               # Database connection setup
│   │   ├── controllers/          # Request handlers (Auth, Master Data, Timetable)
│   │   ├── models/               # Mongoose schemas (User, Room, Course, TimeTableEntry, etc.)
│   │   ├── routes/               # Express API endpoints
│   │   ├── utils/                # Timetable generator solver & algorithm logic
│   │   ├── app.js                # Express app initialization & middleware
│   │   └── index.js              # Server entry point
│   ├── seed.js                   # Master data seeding script
│   ├── seed_allocations.js       # Curriculum allocation seeder
│   ├── seed_curriculum.js        # Course & Subject rules seeder
│   └── testGenerator.js          # Solver standalone benchmark script
│
├── Client/                       # React + Vite Frontend Application
│   ├── public/                   # Static assets
│   ├── src/
│   │   ├── assets/               # Branding & media assets
│   │   ├── components/           # UI components (Admin, Faculty, Student dashboards, Timetable Grid)
│   │   ├── context/              # Authentication & App state context
│   │   ├── store/                # Redux store slices
│   │   ├── App.jsx               # Root component & Route setup
│   │   └── main.jsx              # Entry point
│   ├── index.html
│   └── vite.config.js
└── README.md                     # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18.x or higher)
- **MongoDB** (Local instance running on `mongodb://localhost:27017` or MongoDB Atlas URI)
- **npm** or **yarn**

---

### 📥 1. Clone the Repository
```bash
git clone https://github.com/PrachiKumari04/timetable-generator.git
cd timetable-generator
```

---

### ⚙️ 2. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   *Example `.env` configuration:*
   ```env
   PORT=4000
   MONGODB_URI=mongodb://localhost:27017/
   ACCESS_TOKEN_SECRET=your-super-secret-access-token-key
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key
   REFRESH_TOKEN_EXPIRY=7d
   SALT_ROUNDS=10
   NODE_ENV=development
   ```

4. Seed initial database records (Optional but recommended):
   ```bash
   node seed.js
   node seed_curriculum.js
   node seed_allocations.js
   ```

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend API will run at `http://localhost:4000`.

---

### 💻 3. Frontend Setup

1. Open a new terminal and navigate to the client directory:
   ```bash
   cd Client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173`.

---

## 🔑 Default Seeded Accounts

For testing after running the seed scripts:

| Role | Username / User ID | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `admin123` | Full System & Data Management |
| **Faculty** | `FACF001` | `faculty123` | Personal Timetable & Class Schedules |
| **Student** | `STUADT25COMM0873` | `student123` | Division Schedule & iCal Export |

---

## 📡 API Overview

### Authentication & Users
- `POST /api/v1/users/login` - User authentication & JWT token generation.
- `POST /api/v1/users/logout` - Invalidate user session.
- `GET /api/v1/users/current-user` - Fetch current authenticated profile.

### Master Data Management
- `GET / POST / PUT / DELETE /api/v1/courses` - Managing courses.
- `GET / POST / PUT / DELETE /api/v1/rooms` - Classroom & lab management.
- `GET / POST / PUT / DELETE /api/v1/subjects` - Subject curriculum configuration.
- `GET / POST / PUT / DELETE /api/v1/semesters` - Academic semesters.

### Timetable Engine
- `POST /api/v1/timetable/generate` - Trigger full automated schedule generation.
- `GET /api/v1/timetable/view` - Retrieve generated entries with filters (division, room, faculty).

---

## 🧪 Testing the Generator Engine

You can test the constraint solver independently from the backend CLI:

```bash
cd Backend
npm test
```
This executes `testGenerator.js` to log generation statistics, slot assignment efficiency, and conflict checks directly in the terminal.

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
