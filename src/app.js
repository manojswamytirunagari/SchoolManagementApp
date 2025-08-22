const express = require("express");
const bodyParser = require("body-parser");
const { body, validationResult, query } = require("express-validator");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const pool = require("./db");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// ---------------- Test Route ----------------
app.get("/api", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT NOW() AS now");
    res.json({ message: "School Management API is running ✅", dbTime: rows[0].now });
  } catch (err) {
    res.status(500).json({ error: "DB connection failed", details: err.message });
  }
});

// ---------------- Add School ----------------
app.post(
  "/addSchool",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("address").notEmpty().withMessage("Address is required"),
    body("latitude").isFloat().withMessage("Latitude must be a number"),
    body("longitude").isFloat().withMessage("Longitude must be a number")
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, address, latitude, longitude } = req.body;

    try {
      const [result] = await pool.query(
        "INSERT INTO schools (name, address, latitude, longitude, created_at) VALUES (?, ?, ?, ?, CURRENT_DATE)",
        [name, address, latitude, longitude]
      );
      res.json({ message: "School added successfully", schoolId: result.insertId });
    } catch (err) {
      res.status(500).json({ error: "Database error", details: err.message });
    }
  }
);

// ---------------- List Schools ----------------
app.get(
  "/listSchools",
  [
    query("latitude").isFloat().withMessage("Latitude is required"),
    query("longitude").isFloat().withMessage("Longitude is required")
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const userLat = parseFloat(req.query.latitude);
    const userLon = parseFloat(req.query.longitude);

    try {
      const [schools] = await pool.query("SELECT * FROM schools");

      const R = 6371; // km
      const toRad = (deg) => (deg * Math.PI) / 180;

      const schoolsWithDistance = schools.map((school) => {
        const dLat = toRad(school.latitude - userLat);
        const dLon = toRad(school.longitude - userLon);
        const lat1 = toRad(userLat);
        const lat2 = toRad(school.latitude);

        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return { ...school, distance };
      });

      schoolsWithDistance.sort((a, b) => a.distance - b.distance);

      res.json(schoolsWithDistance);
    } catch (err) {
      res.status(500).json({ error: "Database error", details: err.message });
    }
  }
);

// ---------------- Update School ----------------
app.put(
  "/updateSchool/:id",
  [
    body("name").optional().notEmpty(),
    body("address").optional().notEmpty(),
    body("latitude").optional().isFloat(),
    body("longitude").optional().isFloat()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { id } = req.params;
    const { name, address, latitude, longitude } = req.body;

    try {
      const [result] = await pool.query(
        "UPDATE schools SET name = COALESCE(?, name), address = COALESCE(?, address), latitude = COALESCE(?, latitude), longitude = COALESCE(?, longitude) WHERE id = ?",
        [name, address, latitude, longitude, id]
      );
      res.json({ message: "School updated successfully", affectedRows: result.affectedRows });
    } catch (err) {
      res.status(500).json({ error: "Database error", details: err.message });
    }
  }
);

// ---------------- Delete School ----------------
app.delete("/deleteSchool/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query("DELETE FROM schools WHERE id = ?", [id]);
    res.json({ message: "School deleted successfully", affectedRows: result.affectedRows });
  } catch (err) {
    res.status(500).json({ error: "Database error", details: err.message });
  }
});

// ---------------- Serve Frontend ----------------
app.use(express.static(path.join(__dirname, "../public")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
