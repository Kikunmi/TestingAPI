# Dog Adoption Platform API - Project Docs

This document was created from the project requirements and documents how the Dog Adoption Platform backend is implemented and how to run it locally and test it.

## Overview

A Node.js + Express API that allows users to register and login, register dogs for adoption, adopt dogs, remove dogs, and list dogs. MongoDB (Mongoose) is used as the database.

## Data Models

- User
  - username: string (unique)
  - passwordHash: string
  - createdAt: Date

- Dog
  - name: string
  - description: string
  - owner: ObjectId -> User
  - adoptedBy: ObjectId -> User | null
  - adoptedMessage: string | null
  - createdAt: Date

## API Endpoints

All endpoints accept and return JSON.

Auth

- POST /api/auth/register
  - body: { username, password }
  - 201 created on success
- POST /api/auth/login
  - body: { username, password }
  - 200 OK, returns { token }

Dogs (authenticated)

- POST /api/dogs
  - body: { name, description }
  - Register a new dog (owner = current user)
- POST /api/dogs/:id/adopt
  - body: { message }
  - Adopt the dog with restrictions: cannot adopt already adopted dogs or your own dog
- DELETE /api/dogs/:id
  - Remove a dog; only owner can remove if not adopted
- GET /api/dogs/registered?page=&limit=&status=
  - List dogs registered by the authenticated user
  - status: 'adopted' | 'available' optional
  - pagination supported via page (default 1) and limit (default 10)
- GET /api/dogs/adopted?page=&limit=
  - List dogs adopted by the authenticated user with pagination

## Security

- Passwords are hashed with bcrypt before storing.
- JWT tokens are issued on login (valid for 24 hours). Token must be provided in `Authorization: Bearer <token>` header.
- Sensitive info like `MONGO_URI` and `JWT_SECRET` must be stored in environment variables (.env).

## Layered Architecture

- `models/` - Mongoose models and DB schema definitions
- `controllers/` - Request handlers and business logic
- `routes/` - Route definitions that map endpoints to controllers
- `middlewares/` - Authentication middleware

## Environment

Create a `.env` file (or set environment variables):

```
PORT=3000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.example.mongodb.net/dog-adoption?retryWrites=true&w=majority
JWT_SECRET=some_long_secret
```

## Running Locally

1. Install dependencies:
   npm install
2. Start using a real MongoDB (recommended) or tests will try to use an in-memory server:
   - If you have MongoDB Atlas or a local MongoDB, set `MONGO_URI` in `.env`.
3. Start the server:
   npm run dev
4. The server listens on PORT (default 3000).

## Testing

- Tests are written with mocha, chai, and supertest and live in `test/`.
- Tests are configured to use `mongodb-memory-server` by default which spawns a bundled mongod binary.

Important Windows note: On Windows machines, `mongodb-memory-server` requires the Visual C++ Redistributable (vc_redist) to be installed because the bundled mongod binary depends on system C++ runtime libraries. If you see an error like:

```
Instance closed unexpectedly with code "3221225781" ... Exit Code is large, commonly meaning that vc_redist is not installed
```

Install the latest Microsoft Visual C++ Redistributable:
https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist

Alternative for tests (no vc_redist required):

- Provide a working `MONGO_URI` in `.env` pointing to a local or Atlas MongoDB instance. The test setup will connect to that instead of spawning the in-memory server if you modify the test setup accordingly.

To run tests:

- npm test

## Notes and Next Steps

- The project structure follows separation of concerns and is ready for extension (e.g., add image uploads, more dog attributes, admin roles).
- If you want CI-friendly tests on Windows without installing VC redistributable, use a hosted MongoDB connection and update the test setup to prefer `process.env.MONGO_URI` when available.

## Contact

If you need help wiring up an Atlas cluster or updating tests to use a provided `MONGO_URI`, I can update the code to prefer a connection string from env in the test setup and skip `mongodb-memory-server` when present.
