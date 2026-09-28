# Authentication & Product CRUD

Live Link: https://auth-product-crud.onrender.com

A full-stack authentication and product management application built as part of an assignment given at Sheryians Coding School.

The project provides user registration and login with JWT authentication, protected product operations, MongoDB persistence, input validation, and a simple responsive frontend.

## Features

### Authentication

* User registration
* User login
* Password hashing with bcrypt
* JWT access tokens
* JWT refresh tokens
* Protected API routes
* Current user profile
* Logout
* Input validation with `express-validator`

### Product Management

* Create products
* View all products
* View a single product
* Update products
* Delete products
* Product validation
* Protected create, update, and delete operations

### Frontend

* Separate Login page
* Separate Registration page
* Product Dashboard
* User Profile page
* Responsive design
* Dark-themed interface
* Client-side authentication guard

---

## Technology Stack

| Technology        | Purpose                 |
| ----------------- | ----------------------- |
| Node.js           | Runtime environment     |
| Express.js        | Backend framework       |
| MongoDB Atlas     | Database                |
| Mongoose          | MongoDB object modeling |
| HTML              | Frontend structure      |
| CSS               | Frontend styling        |
| JavaScript        | Frontend functionality  |
| JWT               | Authentication          |
| bcrypt            | Password hashing        |
| express-validator | Input validation        |
| dotenv            | Environment variables   |

---

## Project Structure

```text
auth-product-crud/
│
├── controllers/
│   ├── authController.js
│   └── productController.js
│
├── middleware/
│   ├── authenticate.js
│   └── handleValidation.js
│
├── models/
│   ├── User.js
│   └── Product.js
│
├── routes/
│   ├── authRoutes.js
│   └── productRoutes.js
│
├── public/
│   ├── index.html
│   ├── register.html
│   ├── dashboard.html
│   ├── profile.html
│   ├── style.css
│   └── script.js
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── server.js
```

---

## Setup

### 1. Clone or download the project

Open the project directory in a terminal.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file based on `.env.example`.

Example:

```env
PORT=5000

MONGODB_URI=your_mongodb_atlas_connection_string

ACCESS_TOKEN_SECRET=your_access_token_secret

REFRESH_TOKEN_SECRET=your_refresh_token_secret

NODE_ENV=development
```

Replace the placeholder values with your own MongoDB Atlas connection string and JWT secrets.

> Never commit your `.env` file or expose your JWT secrets.

### 4. Start the application

```bash
npm start
```

The server will run at:

```text
http://localhost:5000
```

Open the URL in your browser.

---

## Authentication API

### Register

```http
POST /api/auth/register
```

Creates a new user account.

### Login

```http
POST /api/auth/login
```

Authenticates a user and returns an access token.

### Refresh Token

```http
POST /api/auth/refresh-token
```

Generates a new access token using a valid refresh token.

### Logout

```http
POST /api/auth/logout
```

Logs the authenticated user out.

### Current User

```http
GET /api/auth/me
```

Returns information about the currently authenticated user.

---

## Product API

### Create Product

```http
POST /api/products
```

Requires authentication.

### Get All Products

```http
GET /api/products
```

Returns the available products.

### Get Product

```http
GET /api/products/:id
```

Returns a specific product.

### Update Product

```http
PUT /api/products/:id
```

Requires authentication.

### Delete Product

```http
DELETE /api/products/:id
```

Requires authentication.

Protected requests use:

```http
Authorization: Bearer <access_token>
```

---

## Product Fields

Each product contains:

```text
name
price
stock
```

Example:

```json
{
  "name": "Wireless Headphones",
  "price": 2499,
  "stock": 25
}
```

The product routes validate the required fields before processing the request.

---

## Authentication Flow

```text
Register
   ↓
Password hashed with bcrypt
   ↓
User stored in MongoDB
   ↓
Login
   ↓
Access Token + Refresh Token
   ↓
Access Token used for protected requests
   ↓
JWT verified by authentication middleware
   ↓
Protected operation allowed
```

The frontend stores the access token and sends it with authenticated API requests using the `Authorization` header.

---

## Frontend Pages

### Login

```text
/index.html
```

Allows existing users to log in.

### Registration

```text
/register.html
```

Allows new users to create an account.

### Dashboard

```text
/dashboard.html
```

Provides product creation, viewing, updating, and deletion.

### Profile

```text
/profile.html
```

Displays the authenticated user's account information.

---

## Validation & Security

The application includes:

* Password hashing using bcrypt
* JWT-based authentication
* Separate access and refresh token secrets
* Protected product operations
* Request validation using `express-validator`
* Authentication middleware
* Environment variables for sensitive configuration
* Frontend authentication checks
* HTML escaping when displaying product names

Sensitive configuration should remain in `.env` and should not be committed to version control.

---

## Running the Project

After starting the server:

```bash
npm start
```

Visit:

```text
http://localhost:5000
```

Typical workflow:

```text
Register
   ↓
Login
   ↓
Dashboard
   ↓
Add Product
   ↓
View Products
   ↓
Edit / Delete Product
   ↓
Profile
   ↓
Logout
```

---

## Assignment Requirements

This project implements the main authentication and CRUD requirements of the **Sheryians Coding School assignment**, including:

* User registration
* User login
* Password hashing
* JWT authentication
* Token refresh
* Logout
* Authentication middleware
* Product CRUD operations
* Product validation
* MongoDB data persistence
* Protected product operations

---

## Future Improvements

Possible future improvements include:

* Product images
* Product categories
* Search and filtering
* Pagination
* Admin/user roles
* Improved token management using secure HTTP-only cookies
* Deployment to a cloud platform

---

## License

This project is licensed under MIT License. For more details, kindly visit LICENSE File. 
