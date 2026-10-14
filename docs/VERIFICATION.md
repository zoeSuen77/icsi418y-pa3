# PA3 verification record

Verified for the October 13–14, 2026 delivery, using Node.js 24.15.0, MongoDB 7.0.14, and installed Google Chrome on macOS.

| Check | Result |
| --- | --- |
| `npm test` | 34 passed, 0 failed: 19 PA2 authentication checks and 15 PA3 project checks |
| `PLAYWRIGHT_CHANNEL=chrome npm run test:ui` | 9 passed, 0 failed |
| `npm run build` | Production build completed successfully |
| `npm audit` after compatible dependency fixes | 0 reported vulnerabilities |
| `npm run demo -- --seed` | React, Express and local replica set started; 3 users and 2 projects prepared |
| `npm run db:inspect -- --local` | Users, Projects and ProjectMemberships inspected; references are ObjectIds |
| Desktop startup file and Ctrl+C | Final Desktop copy starts, seeds idempotently, and shuts down without a connection-error stack |
| Local demo stop/restart | Same persisted user and project records present after restart |
| Repeated demo seed | Existing projects and user records preserved without duplicates |
| Visual inspection | Desktop workspace, mobile creation form and member controls checked; no horizontal overflow at 375px |

API checks cover project validation, all three statuses, nonexistent users and projects, ObjectId storage, automatic lead membership, multi-project membership, protected lead removal, concurrent duplicate rejection, transaction rollback when the membership write fails, safe database errors, and exclusion of password hashes from public responses. Existing registration and login checks still pass.

Browser checks exercise signup/login, project creation, immediate lead membership, adding one user to two projects, duplicate feedback, removing a non-lead member without removing their other membership, page reload persistence, network retry, stale response handling when switching projects, and mobile layout.

API tests use temporary MongoDB instances. Browser tests use isolated ports 5174/9001/27019 and database `pa3_ui_test`. The saved demonstration uses ports 5173/9000/27018 and database `pa3`.

## Scope and remaining submission work

This delivery was verified against a real local MongoDB replica set. An Atlas deployment was not tested because the disconnected PA2 drive's local `.env` was unavailable; no credentials are included. Atlas configuration and reuse of PA2 users are documented in README.

The implementation follows the PA3 requirements previously read from the assignment document. The linked Notion implementation page was inaccessible through the browser tool.

The student must record the required 3–5 minute Zoom demonstration and submit it with the PA3 GitHub repository URL through Brightspace. Automated checks and the prepared narration script do not replace the recording or submission.
