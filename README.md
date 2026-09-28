# Authentication & Product CRUD

This project implements the requirements from the Sheryians Coding School assignment.

## Technologies

- Node.js
- Express
- MongoDB
- HTML
- CSS
- JavaScript
- JWT
- bcrypt
- express-validator

## Setup

1. Install Node.js and MongoDB.
2. Open this project in the terminal.
3. Run:

```bash
npm install
```

4. Create a `.env` file from `.env.example`.
5. Set the MongoDB connection and JWT secrets.
6. Start the server:

```bash
npm start
```

Open:

http://localhost:5000

## Authentication APIs

- POST `/api/auth/register`
- POST `/api/auth/login`
- POST `/api/auth/refresh-token`
- POST `/api/auth/logout`
- GET `/api/auth/me`

## Product APIs

- POST `/api/products`
- GET `/api/products`
- GET `/api/products/:id`
- PUT `/api/products/:id`
- DELETE `/api/products/:id`

Create, update and delete product routes require a valid access token.

## Product fields

The assignment explicitly requires validation for product name, price and stock, so this implementation uses:

- name
- price
- stock
