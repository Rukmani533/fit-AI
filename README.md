# FitTrack AI - Backend RESTful API

FitTrack AI is a secure, scalable, and AI-powered RESTful backend application developed to simplify workout tracking and provide intelligent fitness recommendations. Built using **Node.js, Express.js, MongoDB, Mongoose**, and **Google Gemini AI**.

---

## 🏗️ Architecture & Tech Stack

- **Architecture:** Model-View-Controller (MVC)
- **Runtime & Framework:** Node.js (v16+) & Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT) & bcryptjs password hashing
- **AI Integration:** Google Gemini AI (Workout Recommendations & Fitness Insights)
- **Security & Utilities:** CORS, Dotenv, Centralized Error Handling

---

## 📁 Project Structure

```
FitTrack/
├── src/
│   ├── config/
│   │   └── db.js                 # MongoDB connection logic
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, profile
│   │   ├── workoutController.js  # Workout CRUD & search operations
│   │   └── aiController.js       # Gemini AI workout recommendation & insights
│   ├── middleware/
│   │   ├── auth.js               # JWT verification & route protection
│   │   └── errorHandler.js       # Centralized error handler
│   ├── models/
│   │   ├── User.js               # User Mongoose schema & bcrypt hooks
│   │   └── Workout.js            # Workout Mongoose schema with validation
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth routes
│   │   ├── workoutRoutes.js      # /api/workouts routes
│   │   ├── aiRoutes.js           # /api/ai routes
│   │   └── index.js              # Centralized route aggregator
│   ├── services/
│   │   └── geminiService.js      # Google Gemini AI communication service
│   └── app.js                    # Express app configuration & middleware
├── server.js                     # Server entry point
├── FitTrack.postman_collection.json # Postman collection for all APIs
├── .env                          # Environment variables
├── .env.example                  # Example environment variables
└── package.json                  # Dependencies & scripts
```

---

## ⚙️ Environment Variables (`.env`)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/aifittrack
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_google_gemini_api_key
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
- **Production Mode:**
  ```bash
  npm start
  ```
- **Development Mode (with Nodemon):**
  ```bash
  npm run dev
  ```

---

## 📡 REST API Endpoints

### 1. Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | No |
| `POST` | `/api/auth/login` | Login and obtain JWT token | No |
| `GET` | `/api/auth/profile` | Get current user's profile | Yes (Bearer) |

#### Register Payload:
```json
{
  "name": "Sathya",
  "email": "sathya@gmail.com",
  "password": "Sathya@01"
}
```

### 2. Workouts (`/api/workouts`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/workouts` | Create a new workout record | Yes |
| `GET` | `/api/workouts` | Get all workouts for the user | Yes |
| `GET` | `/api/workouts/search` | Search workouts (by name, category, date) | Yes |
| `GET` | `/api/workouts/:id` | Get single workout by ID | Yes |
| `PUT` | `/api/workouts/:id` | Update existing workout | Yes |
| `DELETE` | `/api/workouts/:id` | Delete workout record | Yes |

#### Add Workout Payload:
```json
{
  "workoutName": "Evening Jog",
  "category": "Running",
  "duration": 30,
  "caloriesBurned": 350,
  "workoutDate": "2026-06-26"
}
```

### 3. AI Services (`/api/ai`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/ai/workout-recommendation` | AI Personalized Workout Plan | Yes |
| `POST` | `/api/ai/fitness-insights` | AI Workout Statistics Analysis | Yes |

#### Workout Recommendation Payload:
```json
{
  "age": 22,
  "fitnessGoal": "Weight Loss",
  "experience": "Beginner"
}
```

#### Fitness Insights Payload:
```json
{
  "totalWorkouts": 18,
  "averageDuration": 45,
  "totalCaloriesBurned": 6200
}
```

---

## 🧪 Testing with Postman
Import the file `FitTrack.postman_collection.json` into Postman or ThunderClient.
The collection automatically handles token storage upon registration or login.
