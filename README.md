# Timetable Generator Platform

A full-stack, automated Timetable Generation platform designed for educational institutions to easily manage their academic schedules. It features a React-based Admin dashboard and an Express + MongoDB backend that intelligently groups Classes, Sections, Faculties, and Subjects to assemble collision-free schedules.

## 🚀 Features

- **Automated Generation:** A greedy backtracking algorithm automatically slots Faculty and Subjects into Rooms without overlaps.
- **Admin Dashboard:** Full CRUD management system for university Master Data (Programs, Courses, Classes, Faculties, etc.).
- **Student Dashboard:** Read-only view designed for students to select their respective Class/Section and view their allocated weekly schedules.
- **Security:** Built-in JWT Authentication and Bcrypt password hashing.
- **CSV Imports:** Rapidly seed the database using the built-in CSV bulk upload feature for Master Data.

## 🛠️ Tech Stack

### Frontend
- **React 19** with **Vite**
- **Tailwind CSS v4** for rapid UI styling
- Fetch API for Backend communication

### Backend
- **Node.js** with **Express.js**
- **MongoDB** featuring structured Mongoose Schemas (Relational `ref` fields)
- **JWT & Bcrypt** for Security
- **Cloudinary** (Configured for future media expansions)

---

## 💻 Installation & Setup

Before starting, make sure you have **Node.js** and **MongoDB** installed on your machine.

### 1. Clone the repository
```bash
git clone https://github.com/PrachiKumari04/timetable-generator.git
cd timetable-generator
```

### 2. Setup the Backend
Open a terminal inside the `Backend/` directory and install the dependencies:
```bash
cd Backend
npm install
```

Ensure you have a `.env` file inside the `Backend` directory containing your local variables (like `PORT`, `MONGODB_URI`, `ACCESS_TOKEN_SECRET`, etc.).

Start the Express backend server (it defaults to port 5000):
```bash
node index.js
```

### 3. Setup the Frontend
Open a **new** terminal inside the `Frontend/` directory and install the dependencies:
```bash
cd Frontend
npm install
```

Start the Vite development server:
```bash
npm run dev
```

The application should now be live and accessible at `http://localhost:3000/`.

---

## 🔐 Default Logins
Since the auth system is wired into the UI login screen but allows for flexible development bypassing:
- **Admin Login:** Use `admin` as the User ID (Password: anything)
- **Student Login:** Use `student` as the User ID
- **Faculty Login:** Use `faculty` as the User ID
