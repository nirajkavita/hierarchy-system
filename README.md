# Hierarchy Management System (MERN)

A role-based hierarchy management app: **ADMIN → COMPANY → BRANCH → SUPERVISOR → EMPLOYEE**.
Each role can create the next level down. Login with JWT, all data in MongoDB.

## Project structure
```
hierarchy-system/
├── backend/        Express + MongoDB + JWT
└── frontend/       React (Vite) + React Router + Axios
```

## Setup

### 1. Backend
```bash
cd backend
cp .env.example .env       # then edit MONGO_URI and JWT_SECREAT_KEY
npm install
npm run dev                # http://localhost:5000
```

`.env`:
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/hierarchy
JWT_SECREAT_KEY=any-long-random-string
CLIENT_URL=http://localhost:5173
```

### 2. Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev                # http://localhost:5173
```

`.env`:
```
VITE_API_URL=http://localhost:5000/api
```

## Usage
1. Open http://localhost:5173 → click **Create an admin account** → sign up.
2. As ADMIN, click **Add User** to create a **COMPANY**.
3. Log out, log in as that company → create a **BRANCH** under it.
4. Continue: branch creates supervisor, supervisor creates employee.
5. Toggle between **Table** and **Tree** view on the dashboard to see the full hierarchy.

## API summary
| Method | Endpoint           | Auth        |
|-------:|--------------------|-------------|
| POST   | /api/auth/signup   | public (creates ADMIN) |
| POST   | /api/auth/login    | public      |
| GET    | /api/users         | any logged-in user |
| POST   | /api/users         | ADMIN/COMPANY/BRANCH/SUPERVISOR (creates next role) |
| PUT    | /api/users/:id     | same        |
| DELETE | /api/users/:id     | same        |

## Notes
- Passwords are hashed with bcrypt; never returned in responses.
- JWT is sent in the `Authorization: Bearer <token>` header (axios interceptor handles it).
- A user's hierarchy is enforced both in the UI (dropdowns filter by parent) and on the server (creators can only make the next role).
