const express = require("express");
const { signup, login, getSettings, updateSettings, googleAuth } = require("../controllers/user.controller");
const auth = require("../middlewares/auth.middleware");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleAuth);

// Settings
router.get("/settings", auth, getSettings);
router.put("/settings", auth, updateSettings);

module.exports = router;
