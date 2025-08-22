School Management API & Dashboard
=================================

Project Overview
----------------
This is a full-stack School Management application built with Node.js, Express, MySQL, and vanilla JavaScript.
It allows users to:

- Add new schools with name, address, latitude, and longitude.
- View all schools in a list, sorted by distance from a user-provided location.
- Update school information directly from the frontend.
- Delete schools from the database.

The frontend is served via Express and interacts with the backend API endpoints.


Environment Variables (.env)
----------------------------
DB_HOST=<Your MySQL host>
DB_PORT=<Your MySQL port>
DB_USER=<Database user>
DB_PASS=<Database password>
DB_NAME=<Database name>
PORT=3000

Note: Never push .env to GitHub.

---

Backend API Endpoints
--------------------
1. Test API:
   GET /api
   - Returns a test message and current DB time.

2. Add School:
   POST /addSchool
   - Body JSON: { "name": "...", "address": "...", "latitude": 0.0, "longitude": 0.0 }
   - Returns schoolId of the newly added school.

3. List Schools:
   GET /listSchools?latitude=<lat>&longitude=<lon>
   - Returns all schools with distance from provided coordinates.

4. Update School:
   PUT /updateSchool/:id
   - Body JSON: { name?, address?, latitude?, longitude? }
   - Updates the specified school.

5. Delete School:
   DELETE /deleteSchool/:id
   - Deletes the specified school.

---

Frontend
--------
- The dashboard is in `public/index.html`.
- Uses `public/app.js` to fetch API endpoints.
- Displays a table of schools with editable fields.
- Add, update, delete operations are all handled from the frontend.
- User can enter their latitude and longitude to calculate nearby schools.

---

How to Run Locally
-----------------
1. Install dependencies:
   npm install

2. Configure .env with your MySQL details.

3. Run the server:
   npm run dev   # For development with nodemon
   npm start     # For production

4. Open your browser at:
   http://localhost:3000

---

Deployment
----------
- Push the project to GitHub.
- Deploy to Railway or Render:
  1. Link your GitHub repository.
  2. Set environment variables in the platform.
  3. Deploy project.
- The frontend will be accessible from the same deployed URL.
- Update `public/app.js` with the deployed backend URL:
  const API_BASE = "https://your-deployed-backend-url";

---

Notes
- Do not commit `.env` or sensitive information.
- Make sure MySQL database is reachable from the deployed backend.
- All CRUD operations are performed via backend API, frontend never connects directly to DB.

---

Author
Manoj Swamy Tirungari

