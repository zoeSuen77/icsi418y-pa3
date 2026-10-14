# PA3 Zoom demonstration script

Target length: **4 minutes 45 seconds**, including clicks. Practice the sequence once and explain the application in your own words. Record the actual running application with Zoom.

## Before recording

1. Start the app with `npm run demo` (local MongoDB) or `npm run dev` (configured Atlas).
2. In a second terminal, run `npm run demo:seed`. Have at least three users and two projects available.
3. Confirm Alex, Maya, and Sam are available. On a fresh seed their usernames are `alex_chen`, `maya_patel`, and `sam_rivera`; their password is `CampusDemo123!`. Existing accounts keep their original passwords.
4. Remove Sam from Campus Planner and Study Together before a repeat take. Leave each project's lead in place.
5. Prepare a new signup username, such as `demo_take_01`, and a new project name, such as `Assignment Tracker 01`. Use a fresh suffix for another take.
6. Open the application, MongoDB Compass or Atlas Data Explorer, and the editor. For local MongoDB, connect Compass to `mongodb://127.0.0.1:27018/?directConnection=true` and select `pa3`. The terminal command `npm run db:inspect -- --local` is another way to show the actual collections.
7. Prepare tabs for the project React components, `client/src/api.js`, `server/projects.js`, and `server/database.js`. Keep `.env` closed.
8. In Zoom, share the application/editor, test microphone audio, and start recording.

## 0:00–0:35 — PA2 signup and login

**Do:** Show the running application. Register a new user, then log in with that username and password.

“This is my Programming Assignment 3 application, built on my PA2 React, Express, and MongoDB application. The original signup and login features still work. I am creating a new account and then logging in with the same credentials. The application validates the credentials and shows the successful login.”

## 0:35–1:15 — Create a project and choose the lead

**Do:** Open project management. Create `Assignment Tracker 01`, description `Track course assignments and deadlines`, status `Planning`, and lead Alex Chen. Show the saved project in the list.

“To create a project, I enter its name and description, choose one of the three allowed statuses, and select an existing registered user as the project lead. Here I choose Alex. The saved project displays the name, description, status, and Alex's readable name rather than just an ID.”

## 1:15–1:45 — Automatic lead membership and adding members

**Do:** Open the new project's members and point out Alex. Add Sam Rivera.

“Alex is already a member because the backend automatically adds the lead when creating the project. The lead must stay a member. I can now add another registered user, Sam. The member list refreshes after the successful request.”

## 1:45–2:25 — Duplicate rejection and many-to-many membership

**Do:** Try to add Sam to the same project again and show the error. Select Study Together, add Sam there, then switch between the two member lists.

“If I try to add Sam again to this project, the server rejects the duplicate and the interface displays the error. Sam can still join another project. I will add Sam to Study Together as well. These two member lists show that one user belongs to multiple projects, and each project can have multiple users.”

## 2:25–2:45 — Remove a non-lead member

**Do:** Remove Sam from the newly created project. Show Alex remains, and Sam remains in Study Together.

“I can remove Sam because Sam is not this project's lead. This deletes only the membership for this project. Alex stays as the lead, and Sam's membership in Study Together is unaffected. The backend also rejects any attempt to remove the lead.”

## 2:45–3:25 — Show MongoDB documents

**Do:** In Compass/Atlas, show `Projects`, then `ProjectMemberships`. Point out the new project's `_id`, `project_lead_id`, its lead membership, and Sam's remaining membership in Study Together. Briefly show the corresponding user IDs in `Users` if time permits.

“In MongoDB, Projects stores the project's name, description, status, and project_lead_id. The lead reference is stored as an ObjectId. ProjectMemberships is the separate relationship collection. Each document links one project_id to one user_id, also using ObjectIds. A user can appear in several membership documents with different project IDs. Names are looked up for display instead of being used as relationship keys.”

## 3:25–4:00 — Explain React and API communication

**Show:** The React project components and `client/src/api.js`.

“The React interface separates project creation, project selection, and member management. State tracks the input values, selected project, member list, and feedback. The shared API helper uses fetch to send JSON requests to Express. Creating and adding use POST, listing uses GET, and removing a member uses DELETE. After changes succeed, the interface refreshes the relevant data and displays feedback.”

## 4:00–4:45 — Explain backend guarantees

**Show:** Project creation and member routes in `server/projects.js`, then index setup in `server/database.js`.

“The backend validates required fields and statuses, converts valid IDs into MongoDB ObjectIds, and checks that referenced users and projects exist. Project creation uses a transaction to save the project and lead membership together. A unique index on project_id and user_id prevents duplicate memberships, including simultaneous requests. Before removing a member, the route checks the project's lead ID. Invalid requests and database failures return clear errors to the frontend. This completes the project and membership demonstration.”

Stop recording and replay the video. Confirm that it is between **3 and 5 minutes**, that both application and database views are readable, and that the sound is clear. Submit the actual Zoom video and the PA3 GitHub repository URL through Brightspace.
