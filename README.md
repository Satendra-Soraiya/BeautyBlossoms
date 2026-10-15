# BeautyBlossoms

Modern Full-Stack Environment (Node.js Express backend + React Vite frontend + Supabase PostgreSQL database).

## 🚀 Architecture Overview

```
BeautyBlossoms/
├── client/                     # Frontend (React 19 + Vite 6)
│   ├── src/
│   │   ├── config/
│   │   │   └── supabase.js     # Frontend Supabase client
│   │   ├── services/
│   │   │   └── api.js          # Axios API service (configured for /api proxy)
│   │   ├── App.jsx             # Environment status & diagnostics dashboard
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example            # Frontend environment variables template
│   ├── .env                    # Active local environment variables
│   ├── vite.config.js          # Vite config with proxy to Express (:5000)
│   └── package.json
│
├── server/                     # Backend (Node.js + Express.js ES Modules)
│   ├── src/
│   │   ├── config/
│   │   │   └── supabase.js     # Server-side Supabase client & admin client
│   │   ├── routes/
│   │   │   ├── health.js       # /api/health check & Supabase connection test
│   │   │   └── api.js          # /api sample data and queries
│   │   └── index.js            # Express server entry point
│   ├── .env.example            # Backend environment variables template
│   ├── .env                    # Active local environment variables
│   └── package.json
│
├── .gitignore
├── package.json                # Root scripts to run both client and server
└── README.md
```

---

## 🛠️ Prerequisites

- **Node.js**: v18+ (v24+ recommended)
- **npm**: v9+ (v11+ recommended)
- A [Supabase](https://supabase.com) account & project

---

## ⚡ Quick Start

### 1. Install all dependencies
From the project root:
```bash
npm run install:all
```
*(Dependencies are already installed during initialization)*

### 2. Configure Supabase Credentials

1. Go to your [Supabase Dashboard](https://app.supabase.com) -> **Project Settings** -> **API**.
2. Update **Backend** (`server/.env`):
   ```env
   PORT=5000
   CLIENT_URL=http://localhost:5173
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   ```
3. Update **Frontend** (`client/.env`):
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   VITE_API_URL=http://localhost:5000/api
   ```

### 3. Run Development Servers

Run both the frontend and backend simultaneously from the root:
```bash
npm run dev
```

Or run them individually in separate terminals:
- **Backend**:
  ```bash
  npm run dev:server
  # Express runs on http://localhost:5000
  ```
- **Frontend**:
  ```bash
  npm run dev:client
  # Vite runs on http://localhost:5173
  ```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Healthcheck verifying server status and Supabase connectivity |
| `GET` | `/api` | Root API documentation/greeting endpoint |
| `GET` | `/api/example-data` | Example endpoint demonstrating querying Supabase tables |

---

## 📦 Tech Stack Details

- **Frontend**:
  - React 19
  - Vite 6
  - `@supabase/supabase-js`
  - Axios
- **Backend**:
  - Express 4 (ES Modules `type: "module"`)
  - `@supabase/supabase-js`
  - CORS & Morgan logger
  - Nodemon for hot reloading
  - Dotenv
- **Database**:
  - Supabase (PostgreSQL with Auth & Row-Level Security support)
