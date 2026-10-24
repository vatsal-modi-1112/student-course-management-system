# Student Course Management System

A web-based Student Course Management System developed using React.js, Node.js, Express.js, and MongoDB. The application provides student login, course browsing, course enrollment, and administrative management features.

This project was developed as a practical learning project to understand frontend development, backend API development, database operations, and authentication.

## Table of Contents

- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation and Setup](#installation-and-setup)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Database](#database)
- [Security Notes](#security-notes)
- [Future Improvements](#future-improvements)
- [Author](#author)

## Project Overview

The Student Course Management System is designed to manage students, courses, and course enrollments through a web-based interface.

Students can log in, view the dashboard, browse available courses, enroll in courses, view their enrolled courses, and access their profile.

Administrative functionality supports managing student and course records.

The frontend communicates with the backend through HTTP requests. The backend processes requests and interacts with MongoDB to store and retrieve application data.

## Technologies Used

### Frontend
- React.js
- JavaScript
- HTML5
- CSS3
- Vite
- React Hooks, including `useState`

### Backend
- Node.js
- Express.js
- REST-style API endpoints
- MongoDB Node.js Driver
- `bcryptjs` for password hashing
- `cors` for cross-origin requests
- `dotenv` for environment configuration

### Database
- MongoDB

### Development Tools
- Visual Studio Code
- Node.js and npm
- MongoDB Compass
- Git and GitHub

## Features

### Student Module
- Student login
- Student dashboard
- View available courses
- Enroll in courses
- View enrolled courses in My Courses
- View student profile
- Manage login state through browser storage, as implemented

### Administrative Module
- Admin login
- Manage student records
- Add, view, update, and delete student records, where implemented
- Manage course records
- Add, view, update, and delete course records, where implemented
- Manage course enrollment records, where implemented

### Backend
- Express.js server
- API endpoints for student operations
- API endpoints for course operations
- API endpoints for enrollment operations
- MongoDB database connectivity
- Password hashing using `bcryptjs`

## Project Structure

The main project structure is organized as follows:

```text
student-course-management-system/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── StudentLogin.jsx
│   │   ├── StudentDashboard.jsx
│   │   ├── Courses.jsx
│   │   ├── MyCourses.jsx
│   │   ├── Profile.jsx
│   │   ├── AddStudent.jsx
│   │   ├── EditStudent.jsx
│   │   ├── AddCourse.jsx
│   │   └── EditCourse.jsx
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── student-course-backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── studentController.js
│   │   ├── courseController.js
│   │   └── enrollmentController.js
│   ├── routes/
│   │   ├── studentRoutes.js
│   │   ├── courseRoutes.js
│   │   └── enrollmentRoutes.js
│   ├── createAdmin.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── .gitignore
└── README.md
```

The structure above illustrates the main application files. Some files or folders may differ depending on the current version of the project.

## Prerequisites

Install the following software on Windows:

- **Node.js and npm:** Required to run the frontend and backend.
- **MongoDB Community Server:** Required for the local database.
- **MongoDB Compass:** Optional graphical tool for viewing and managing MongoDB databases.
- **Visual Studio Code:** Recommended code editor.
- **Git:** Required to clone the repository and manage source code.

Verify Node.js and npm by opening a new terminal:

```powershell
node --version
npm --version
```

Verify Git:

```powershell
git --version
```

Ensure MongoDB is installed and its server is running before starting the application.

## Installation and Setup

### 1. Clone the Repository

Open PowerShell or the VS Code terminal and navigate to the directory where you want to store the project.

Clone the repository:

```powershell
git clone https://github.com/vatsal-modi-1112/student-course-management-system.git
```

Move into the project directory:

```powershell
cd student-course-management-system
```

Alternatively, download the repository as a ZIP file from GitHub and extract it.

### 2. Install Frontend Dependencies

Run the following command from the project root directory:

```powershell
npm install
```

This installs the dependencies listed in the frontend `package.json` file.

### 3. Install Backend Dependencies

Navigate to the backend directory:

```powershell
cd student-course-backend
```

Install the backend dependencies:

```powershell
npm install
```

Return to the project root when you need to start the frontend:

```powershell
cd ..
```

### 4. Configure MongoDB

Start the MongoDB service if it is not already running.

The application is configured to use a local MongoDB server. The connection URI commonly used for this setup is:

```text
mongodb://127.0.0.1:27017
```

The database name used by this project is:

```text
student_course_db
```

The database and collections may be created automatically when the application first writes data.

## Environment Configuration

The backend may require a `.env` file containing the MongoDB connection details and other configuration values.

Create or edit the backend environment file:

```text
student-course-backend/.env
```

Example configuration:

```env
MONGO_URI=mongodb://127.0.0.1:27017
DB_NAME=student_course_db
PORT=5000
```

**Important:** These variable names must match the names used in your actual `server.js`, `config/db.js`, and `createAdmin.js` files. If your code uses different names, update the configuration accordingly.

Do not upload `.env` files containing local configuration, credentials, or secrets to GitHub.

If your project uses `createAdmin.js` to create an administrator, run it only after checking the script and configuring the required environment variables. Do not place a real administrator password directly in the script or commit it to the repository.

## Running the Application

The frontend and backend run in separate terminals.

### 1. Start the Backend

Open the first terminal in VS Code.

Navigate to the backend directory:

```powershell
cd student-course-backend
```

Start the server:

```powershell
node server.js
```

The backend is expected to listen on port `5000`, provided that this is the port configured in your application.

If the server starts successfully, keep this terminal open.

### 2. Start the Frontend

Open a second terminal in VS Code.

Navigate to the project root directory, where the frontend `package.json` file is located.

Run:

```powershell
npm run dev
```

Vite will display the local development address in the terminal. With the default configuration, it is usually:

```text
http://localhost:5173
```

Open the address displayed by Vite in your browser.

### 3. Verify the Application

Test the following features according to the functionality implemented in your project:

1. Student login.
2. Student dashboard.
3. Course listing.
4. Course enrollment.
5. My Courses page.
6. Student profile.
7. Administrative login.
8. Student management operations.
9. Course management operations.
10. Enrollment management operations, if available.

Check the browser console and backend terminal for errors if a feature does not work.

## Database

The application uses MongoDB to store student, course, enrollment, and administrator data.

You can use MongoDB Compass to connect to your local server:

```text
mongodb://127.0.0.1:27017
```

After connecting, look for the database:

```text
student_course_db
```

The database may not appear until the application creates or inserts data.

## Security Notes

- Do not commit `.env` files or real credentials.
- Store passwords as secure hashes rather than plain text.
- Use environment variables for secrets and database configuration.
- Validate incoming requests on the backend.
- Restrict administrative endpoints to authenticated and authorized administrators.
- Do not rely on frontend navigation or browser storage alone to protect sensitive backend operations.
- Use appropriate error handling and CORS configuration.
- Rotate any credentials that have previously been exposed in source code or Git history.

## Future Improvements

Possible improvements include:

- More comprehensive server-side validation.
- Improved authentication and authorization.
- Better error messages and loading indicators.
- Automated tests for API endpoints.
- Pagination and search for student and course records.
- Deployment to a hosting environment.

## Author

**Vatsal Modi**

BCA Student — Veer Narmad South Gujarat University (VNSGU)

GitHub: https://github.com/vatsal-modi-1112

## Disclaimer

This project was developed for educational and practical learning purposes. It is intended to demonstrate basic web application development using React.js, Node.js, Express.js, and MongoDB.