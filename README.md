# ICSI 418Y — Programming Assignment 3

A project management application built on the PA2 React, Express, and MongoDB signup/login application. Users can create projects, choose a registered project lead, browse projects, and manage many-to-many project memberships.

![Campus project workspace](docs/projects-preview.png)

## Features

- PA2 signup and login, including required-field validation, duplicate usernames, salted password hashing, and clear feedback.
- Project creation with a name, description, one of `Planning`, `Active`, or `Completed`, and a registered project lead.
- Automatic lead membership when a project is created. The project and its initial membership are saved in a MongoDB transaction.
- Project lists showing the lead's name. User selection and member lists also show usernames.
- Member lists, adding registered users, and removing non-lead members.
- A user can belong to several projects; each project can have several members.
- A unique database index rejects duplicate memberships, including concurrent requests. The backend prevents removing the lead.
- Validation for missing fields, invalid IDs, missing users/projects, invalid statuses, and server/database failures.

Login verifies credentials and updates the interface. This course application does not implement persistent authentication sessions or API authorization; its APIs are intended for the assignment demonstration.

## Quick start: local MongoDB

**Requirements:** Node.js 22.12 or newer and npm. The first local run needs internet access to download a MongoDB binary.

On macOS, double-click `Start PA3.command` to launch and prepare the sample data. Alternatively, open a terminal in the project folder:

```bash
npm ci
npm run demo
```

Open **http://localhost:5173**. The API runs at **http://localhost:9000**. Keep the terminal open and use **Ctrl+C** to stop all services.

The launcher starts a real, single-node MongoDB replica set at `127.0.0.1:27018`. A replica set is needed for the transaction that creates a project together with its lead membership. Database files persist in the ignored `.local-data` directory. This mode uses the local `pa3` database and does not require Atlas credentials.

With the application running, prepare demonstration data in a second terminal:

```bash
npm run demo:seed
```

| Username | Name | Password |
| --- | --- | --- |
| `alex_chen` | Alex Chen | `CampusDemo123!` |
| `maya_patel` | Maya Patel | `CampusDemo123!` |
| `sam_rivera` | Sam Rivera | `CampusDemo123!` |

The script creates the demo users and two projects when absent: **Campus Planner** (`Planning`, lead Alex) and **Study Together** (`Active`, lead Maya). These are disposable demonstration accounts. Existing accounts and project memberships are not reset. If these usernames already existed, their passwords are unchanged. Before another recording, remove Sam from both projects through the interface if necessary.

Inspect the actual database from the same project directory:

```bash
npm run db:inspect -- --local
```

For a graphical view, connect MongoDB Compass to `mongodb://127.0.0.1:27018/?directConnection=true`, select `pa3`, and inspect `Users`, `Projects`, and `ProjectMemberships`.

## Use MongoDB Atlas or existing PA2 users

Stop the local demo before switching modes. Copy `server/.env.example` to `server/.env`, set a valid Atlas connection string, and allow your current IP in Atlas network access. Use a deployment that supports transactions.

```dotenv
MONGO_URI="mongodb+srv://YOUR_DB_USER:YOUR_ENCODED_PASSWORD@YOUR_CLUSTER.mongodb.net/?retryWrites=true&w=majority"
DB_NAME=pa3
USERS_COLLECTION=Users
PORT=9000
CLIENT_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

Then run:

```bash
npm run dev
```

`npm run dev` uses the configured database. `npm run demo` always uses local MongoDB. Run only one mode at a time.

To reuse users from the PA2 database, set `DB_NAME=pa2` and `USERS_COLLECTION=users` with the existing Atlas connection string. Their ObjectIds and password hashes remain usable; the new `Projects` and `ProjectMemberships` collections are created in that database. MongoDB collection names are case-sensitive. Fresh PA3 installations use the assignment's `Users`, `Projects`, and `ProjectMemberships` names by default.

The optional `client/.env` setting `VITE_API_URL` changes the frontend's API URL. The default is `http://localhost:9000`.

## Data model

| Collection | Fields |
| --- | --- |
| `Users` | `_id`, `f_name`, `l_name`, `username`, `password` |
| `Projects` | `_id`, `name`, `description`, `status`, `project_lead_id` |
| `ProjectMemberships` | `_id`, `project_id`, `user_id` |

All IDs and references are stored as MongoDB **ObjectIds**. HTTP JSON uses string representations; the backend validates and converts them before database operations. Relationships store IDs rather than names. The project list resolves user information for a readable lead label, and the membership view resolves each member's public information.

The `Users.username` index is unique. The `ProjectMemberships` index on `{ project_id: 1, user_id: 1 }` is also unique. These constraints protect against duplicate writes even when requests arrive together. Creation runs in a transaction so the project and lead membership commit together or both roll back. The lead cannot be removed through the membership API.

Passwords use salted `scrypt` hashes inherited from PA2. Responses that list users, leads, or members exclude password hashes.

## API

| Method and path | JSON request fields | Purpose |
| --- | --- | --- |
| `GET /` | — | Server acknowledgement |
| `POST /signup` | `f_name`, `l_name`, `username`, `password` | Register a user |
| `POST /login` | `username`, `password` | Verify login credentials |
| `GET /users` | — | List public user information for selection |
| `POST /projects` | `name`, `description`, `status`, `project_lead_id` | Create project and lead membership |
| `GET /projects` | — | List projects with lead information |
| `GET /projects/:id/members` | — | List a project's members |
| `POST /projects/:id/members` | `user_id` | Add a registered user |
| `DELETE /projects/:id/members/:userId` | — | Remove a non-lead member |

Successful mutations and error responses supply messages suitable for the interface. Invalid input receives `400`, missing users/projects receive `404`, duplicate memberships receive `409`, and attempts to remove a lead receive `403`. Unexpected server/database failures receive `500`. Validation runs on the server even when a request bypasses the interface.

## Implementation and verification

React components manage inputs, loading states, selected projects, and success/error feedback. The shared API helper sends JSON with `fetch`; project and membership views refresh after successful changes. `server/projects.js` contains the project and membership routes; `server/app.js` retains signup/login and shared error handling. Both use the official MongoDB driver. `server/database.js` establishes collections and indexes before the server accepts requests.

```bash
npm test
npm run build
```

The API integration suite uses a separate temporary MongoDB replica set to exercise real HTTP requests and database constraints. Browser tests verify the application through its React interface. Browser tests use separate ports (5174, 9001, 27019) and the `pa3_ui_test` database, so they can run alongside the demo. Keep these test ports free:

```bash
npx playwright install chromium
npm run test:ui
```

If the installed Chrome browser is preferred:

```bash
PLAYWRIGHT_CHANNEL=chrome npm run test:ui
```

See [the verification record](docs/VERIFICATION.md) for actual completed checks and remaining limitations. The tests and build do not replace the required Zoom recording.

## Project structure

```text
client/src/       React application, components, API helper, and styles
server/
  app.js         Signup/login, Express setup, and error handling
  projects.js    Project and membership API routes
  database.js    Collection and unique-index setup
  server.js      Environment configuration and MongoDB connection
  passwords.js   Password hashing and verification
scripts/          Local database launcher, demo data, and inspection tools
tests/            API integration and browser tests
docs/             Operation guide, recording script, and verification record
```

## Assignment submission

Read the [Chinese operation and submission guide](docs/操作与提交指南.md) and [English Zoom demonstration script](docs/DEMO_SCRIPT_EN.md). Prepare at least three users and two projects, record a **3–5 minute Zoom demonstration**, and submit the PA3 GitHub repository URL plus the video through Brightspace. The recording must include the application flows, actual MongoDB documents, and a brief explanation of the source code.

Use a separate repository named `icsi418y-pa3` to keep the PA2 submission available. Confirm the new repository has the latest code and the instructor can access it. `.gitignore` excludes `.env`, `node_modules`, local databases, download caches, and generated test output. Only configuration examples belong in the repository.
