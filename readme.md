# Task Management API

## Overview

The **Task Management API** is a backend server built with **Node.js**, **Express**, and **PostgreSQL**. It provides a robust set of endpoints for users to create, read, update, and delete tasks. Additionally, it allows users to track task history and manage authentication. The API uses **Zod** for request validation and **JWT** for user authentication.

This server is designed for users to manage their tasks effectively and securely, with full CRUD (Create, Read, Update, Delete) operations and proper error handling.

---

## Features

- **User Authentication**
  - User registration (sign-up)
  - User login (sign-in)
  - Secure JWT token-based authentication

- **Task Management**
  - Create tasks with a title and description
  - Retrieve a list of tasks
  - Update tasks (title, description, completion status)
  - Delete tasks

- **Task History**
  - Fetch task history, including user details and timestamp
  
- **Data Validation**
  - Request validation with **Zod**
  - Ensures clean and valid data inputs for task creation and updates

- **Error Handling**
  - Structured error responses with appropriate HTTP status codes
  - Specific error messages for different failure scenarios

---

## Requirements

Before running this project, make sure you have the following installed:

- **Node.js** (v14.x or higher)
- **npm** or **yarn**
- **PostgreSQL** (or any compatible database for Prisma)
- **Prisma CLI** (installed globally via `npm install -g prisma`)

---

## Installation

Follow these steps to set up the Task Management API locally:

### 1. Clone the Repository

```bash
git clone https://github.com/sincerelyyyash/task-management-backend.git
cd task-management-backend
```

### 2. Install Dependencies

Install the required dependencies using either **npm** or **yarn**:

```bash
npm install
# OR
yarn install
```

### 3. Set Up Environment Variables

Create a `.env` file at the root of the project and add the following environment variables:

```env
DATABASE_URL="postgres-db-url-here"
ACCESS_TOKEN_SECRET="your-secret-key"
```

- `DATABASE_URL`: The connection string for your PostgreSQL database (can be obtained from your cloud provider or local setup).
- `ACCESS_TOKEN_SECRET`: A secret key used for signing JWT tokens. It should be a long, random string.

### 4. Set Up the Database

Run Prisma migrations to set up the database schema:

```bash
npx prisma migrate dev --name init
```

### 5. Seed the Database

To seed the database with initial data (e.g., sample users), run:

```bash
npx prisma db seed
```

This will populate your database with sample users and tasks for testing.

### 6. Start the Server

Run the development server:

```bash
npm run dev
# OR
yarn dev
```

The server will start on port `3000` by default.

---

## API Endpoints

### User Authentication

#### **Sign Up**
- **URL**: `/signup`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "your_password"
  }
  ```

#### **Sign In**
- **URL**: `/signin`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "email": "john.doe@example.com",
    "password": "your_password"
  }
  ```

### Task Management

#### **Create Task**
- **URL**: `/tasks`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "title": "My First Task",
    "description": "Task description"
  }
  ```

#### **Get All Tasks**
- **URL**: `/tasks`
- **Method**: `GET`

#### **Update Task**
- **URL**: `/tasks/:id`
- **Method**: `PATCH`
- **Request Body**:
  ```json
  {
    "title": "Updated Task Title",
    "completed": true
  }
  ```

#### **Delete Task**
- **URL**: `/tasks/:id`
- **Method**: `DELETE`

### Task History

#### **Get Task History**
- **URL**: `/tasks/:id/history`
- **Method**: `GET`

---

## Error Handling

The API uses structured error responses for every failure scenario:

- **400 Bad Request**: Invalid or missing data (e.g., failed validation with Zod)
- **401 Unauthorized**: Invalid credentials during login or unauthorized access
- **404 Not Found**: Resource not found (e.g., task or user)
- **500 Internal Server Error**: Generic server error, including database or unexpected errors

---

## Technologies Used

- **Node.js**: JavaScript runtime environment for server-side code.
- **Express**: Web framework for building the API.
- **Prisma ORM**: Database toolkit to interact with the PostgreSQL database.
- **Zod**: Data validation library for ensuring correct request data.
- **JWT (JSON Web Tokens)**: Authentication system for secure login and token generation.
- **Bcrypt**: Password hashing library for secure storage of passwords.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

---