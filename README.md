# ICSI 418Y — Programming Assignment 3

## Projects and Project Memberships

This application extends PA2's React, Express, and MongoDB signup/login application with projects and many-to-many project memberships.

### Features

- Register users and verify login credentials using salted password hashes.
- Create a project with a name, description, status, and an existing user as project lead.
- Choose a status of `Planning`, `Active`, or `Completed`.
- View projects with readable lead names.
- Add the project lead as a member automatically when the project is created.
- View, add, and remove project members; users may belong to multiple projects.
- Reject duplicate memberships and prevent removal of the current project lead.
- Display success and error feedback for validation, network, and database failures.

Login retains PA2's credential verification behavior. Persistent login sessions and API authorization are outside this implementation's scope.

## Running the application

**Requirements:** Node.js 22.12 or newer and npm.

```bash
git clone https://github.com/zoeSuen77/icsi418y-pa3.git
cd icsi418y-pa3
npm ci
npm run demo
```

Open [http://localhost:5173](http://localhost:5173). The Express API runs at `http://localhost:9000`. Press **Ctrl+C** in the terminal to stop the application.

`npm run demo` starts the frontend, backend, and a real local MongoDB replica set on port `27018`. The first run downloads MongoDB 7.0.14 and requires internet access. Later runs reuse the downloaded binary. Records persist in `.local-data/mongo`. Atlas credentials are not required for this mode.

### Sample data

With the application running, use a second terminal in the project directory:

```bash
npm run demo:seed
```

This creates three sample accounts and two projects when they do not already exist. Existing accounts and memberships are preserved.

| Username | Name | Password for a newly created sample account |
| --- | --- | --- |
| `alex_chen` | Alex Chen | `CampusDemo123!` |
| `maya_patel` | Maya Patel | `CampusDemo123!` |
| `sam_rivera` | Sam Rivera | `CampusDemo123!` |

The sample projects are **Campus Planner** (Planning, lead Alex Chen) and **Study Together** (Active, lead Maya Patel). Each initially contains its lead as a member.

### MongoDB Atlas configuration

To use Atlas, stop the local application, copy `server/.env.example` to `server/.env`, and set `MONGO_URI` to the connection string for a transaction-capable deployment. Allow the current IP address in Atlas network access. Then run:

```bash
npm run dev
```

The default database is `pa3`, with collections `Users`, `Projects`, and `ProjectMemberships`. To reuse an existing PA2 database, set `DB_NAME=pa2` and `USERS_COLLECTION=users` alongside its connection string. Existing user IDs and password hashes remain usable.

The optional `client/.env` variable `VITE_API_URL` overrides the default API URL, `http://localhost:9000`. Environment files are excluded from Git; `.env.example` files contain configuration placeholders.

## Database design

| Collection | Fields |
| --- | --- |
| `Users` | `_id`, `f_name`, `l_name`, `username`, `password` |
| `Projects` | `_id`, `name`, `description`, `status`, `project_lead_id` |
| `ProjectMemberships` | `_id`, `project_id`, `user_id` |

All IDs and relationship references are stored as MongoDB **ObjectIds**. The backend converts validated JSON ID strings into ObjectIds before database operations. User names are retrieved for display rather than stored as relationship keys.

A transaction saves each project together with its lead membership. A unique compound index on `{ project_id: 1, user_id: 1 }` prevents duplicate memberships, including concurrent requests. The backend checks the lead ID before removing a member. The `username` index is also unique, and public API responses exclude password hashes.

Inspect local database documents while the application is running:

```bash
npm run db:inspect -- --local
```

Alternatively, connect MongoDB Compass to `mongodb://127.0.0.1:27018/?directConnection=true` and select `pa3`.

## API

| Method and path | Request fields | Operation |
| --- | --- | --- |
| `POST /signup` | `f_name`, `l_name`, `username`, `password` | Register a user |
| `POST /login` | `username`, `password` | Verify credentials |
| `GET /users` | — | List public user information |
| `POST /projects` | `name`, `description`, `status`, `project_lead_id` | Create a project and its lead membership |
| `GET /projects` | — | List projects with lead information and member counts |
| `GET /projects/:id/members` | — | List project members |
| `POST /projects/:id/members` | `user_id` | Add a registered user |
| `DELETE /projects/:id/members/:userId` | — | Remove a non-lead member |

The server validates required fields, text lengths, statuses, ID formats, and referenced records. Invalid input returns `400`; invalid login credentials return `401`; lead removal returns `403`; missing records return `404`; duplicates return `409`; unexpected server/database failures return `500`. Responses include messages displayed by the frontend.

## Tests

```bash
npm test
npm run build
npx playwright install chromium
npm run test:ui
```

An installed Google Chrome browser can be used with `PLAYWRIGHT_CHANNEL=chrome npm run test:ui`.

Validation completed: **34 API integration tests passed, 9 browser tests passed, and the production build succeeded.** Coverage includes registration/login, ObjectId relationships, automatic lead membership, transaction rollback, concurrent duplicate rejection, many-to-many membership, lead protection, error feedback, persistence, and mobile layout.

API tests use temporary MongoDB instances. Browser tests use ports `5174`, `9001`, and `27019` with the separate `pa3_ui_test` database, preserving the local application's records.

## Source structure

```text
client/src/
  App.jsx                           Account and project navigation
  components/Login.jsx              Login form
  components/Signup.jsx             Registration form
  components/ProjectsWorkspace.jsx  Project creation, listing, and memberships
  api.js                            Shared HTTP request helper
server/
  app.js                            Express setup, signup/login, error handling
  projects.js                       Project and membership routes
  database.js                       Collections and unique indexes
  server.js                         Configuration and database connection
  passwords.js                      Password hashing and verification
scripts/                            Local startup, sample data, database inspection
tests/                              API integration and browser tests
```
