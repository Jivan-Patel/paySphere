const express = require("express");
const {
  addEmployee,
  getEmployees,
  getRecentEmployees,
  importEmployees,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employee.controller");

const auth = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

const { writeRateLimiter } = require("../middlewares/rateLimiter.middleware");

const router = express.Router();

router.post("/", auth, writeRateLimiter, addEmployee);
router.post("/import", auth, writeRateLimiter, upload.single("file"), importEmployees);
router.get("/", auth, getEmployees);
router.get("/recent", auth, getRecentEmployees);
router.delete("/:id", auth, writeRateLimiter, deleteEmployee);
router.put("/:id", auth, writeRateLimiter, updateEmployee);

module.exports = router;
