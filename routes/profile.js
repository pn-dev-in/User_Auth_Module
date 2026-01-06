const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// Get profile
router.get("/", auth, (req, res) => {
  const user = db
    .prepare("SELECT id, name, email FROM users WHERE id = ?")
    .get(req.userId);

  res.json(user);
});

// Update profile
router.put("/", auth, (req, res) => {
  const { name, email } = req.body;

  db.prepare(
    "UPDATE users SET name = ?, email = ? WHERE id = ?"
  ).run(name, email, req.userId);

  res.json({ message: "Profile updated" });
});

// Change password
router.put("/change-password", auth, async (req, res) => {
  const hash = await bcrypt.hash(req.body.newPassword, 10);

  db.prepare(
    "UPDATE users SET password = ? WHERE id = ?"
  ).run(hash, req.userId);

  res.json({ message: "Password changed successfully" });
});

module.exports = router;
