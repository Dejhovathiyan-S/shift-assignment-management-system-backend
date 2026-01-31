# Shift Assignment Management System - Backend

A full-stack web application where managers create work shifts and staff request shifts they want to work. The system prevents scheduling conflicts and ensures no staff member is assigned overlapping shifts.

##  Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Atlas)
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcrypt
- **Environment Variables:** dotenv

##  Project Structure

```
BACKEND/
├── index.js                    # Main entry point
├── package.json                # Dependencies
├── .env                        # Environment variables
├── .gitignore                  # Git ignore file
├── config/
│   └── db.js                   # MongoDB connection
├── middlewares/
│   └── auth.js                 # JWT authentication middleware
├── models/
│   ├── userModel.js            # User schema (STAFF/MANAGER)
│   ├── shiftModel.js           # Shift schema
│   ├── shiftRequestModel.js    # Shift request schema
│   ├── assignmentModel.js      # Assignment schema
│   └── requestModel.js         # Change request schema
├── API/
│   ├── userAPI.js              # User routes (signup, login, logout, me)
│   ├── shiftAPI.js             # Shift routes (CRUD)
│   ├── shiftRequestAPI.js      # Shift request routes
│   ├── assignmentAPI.js        # Assignment routes
│   └── requestAPI.js           # Change request routes
```

##  User Roles

| Role | Permissions |
|------|-------------|
| **STAFF** | Register, Login, View shifts, Request shifts, View own requests & assignments, Cancel pending requests |
| **MANAGER** | Login, Create/Update/Delete shifts, View all shifts, Approve/Reject requests, View all assignments |

##  Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Dejhovathiyan-S/shift-assignment-management-system-backend.git
   cd shift-assignment-management-system-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```
   PORT=any port
   SECRET_CODE=your_jwt_secret_key
   DB_URL=your_mongodb_connection_string
   ```

4. **Run the server**
   ```bash
   npm start
   ```
   or
   ```bash
   node index.js
   ```

5. **Server will run on**
   ```
   http://localhost:4000
   ```

##  API Endpoints

### Authentication API

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/users/signup` | Register new user (Staff) | No |
| POST | `/users/login` | Login user | No |
| GET | `/users/me` | Get current user info | Yes |
| POST | `/users/logout` | Logout user | Yes |

### Shifts API

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/shifts/all` | Get all shifts | Yes | All |
| GET | `/shifts/available` | Get available shifts | Yes | All |
| GET | `/shifts/:id` | Get single shift | Yes | All |
| POST | `/shifts/create` | Create new shift | Yes | Manager |
| PUT | `/shifts/:id` | Update shift | Yes | Manager |
| DELETE | `/shifts/:id` | Delete shift | Yes | Manager |

### Shift Requests API

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/shift-requests/create` | Request a shift | Yes | Staff |
| GET | `/shift-requests/my-requests` | Get my requests | Yes | Staff |
| GET | `/shift-requests/pending` | Get pending requests | Yes | Manager |
| PUT | `/shift-requests/approve/:id` | Approve request | Yes | Manager |
| PUT | `/shift-requests/reject/:id` | Reject request | Yes | Manager |
| DELETE | `/shift-requests/cancel/:id` | Cancel request | Yes | Staff |

### Assignments API

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/assignments/all` | Get all assignments | Yes | Manager |
| GET | `/assignments/my-assignments` | Get my assignments | Yes | Staff |
| GET | `/assignments/:id` | Get single assignment | Yes | All |
| PUT | `/assignments/:id` | Update assignment status | Yes | Manager |

##  Request & Response Examples

### 1. Register User (Staff)
**POST** `/users/signup`
```json
{
  "name": "John Staff",
  "email": "john@example.com",
  "password": "password123",
  "role": "STAFF",
  "age": 25
}
```
**Response:**
```json
{
  "message": "success"
}
```

### 2. Login
**POST** `/users/login`
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "message": "login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Create Shift (Manager)
**POST** `/shifts/create`

**Headers:**
```
Authorization: Bearer <token>
```
**Body:**
```json
{
  "title": "Morning Shift",
  "date": "2026-02-15",
  "startTime": "09:00",
  "endTime": "17:00"
}
```
**Response:**
```json
{
  "message": "Shift created successfully",
  "shift": {
    "_id": "...",
    "title": "Morning Shift",
    "date": "2026-02-15",
    "startTime": "09:00",
    "endTime": "17:00",
    "status": "AVAILABLE"
  }
}
```

### 4. Request Shift (Staff)
**POST** `/shift-requests/create`

**Headers:**
```
Authorization: Bearer <token>
```
**Body:**
```json
{
  "shiftId": "<shift_id>",
  "reason": "I am available on this day"
}
```
**Response:**
```json
{
  "message": "Shift request submitted successfully",
  "shiftRequest": {
    "_id": "...",
    "shift": "<shift_id>",
    "requestedBy": "<user_id>",
    "status": "PENDING"
  }
}
```

### 5. Approve Request (Manager)
**PUT** `/shift-requests/approve/:id`

**Headers:**
```
Authorization: Bearer <token>
```
**Response:**
```json
{
  "message": "Request approved successfully",
  "shiftRequest": { ... },
  "assignment": { ... }
}
```

##  Features

-  User Registration & Login (JWT Authentication)
-  Role-based Access Control (STAFF/MANAGER)
-  Password Hashing (bcrypt)
-  Shift Creation by Managers
-  Shift Requests by Staff
-  Overlap Prevention (prevents double-booking)
-  Approve/Reject Workflow
-  Auto-assignment on Approval
-  Auto-update Shift Status

##  Security Features

- JWT Token Authentication
- Password Hashing with bcrypt
- Protected Routes with Auth Middleware
- Role-based Authorization
- Environment Variables for Sensitive Data



