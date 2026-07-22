const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/user.routes");
const employeeRoutes = require("./routes/employee.routes");
const payrollRoutes = require("./routes/payroll.routes");

const app = express();

// Rate limiting trust proxy configuration
app.set("trust proxy", 1);

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors());

// Routes
app.get("/", (req, res) => res.send("PaySphere API is running..."));
app.use("/api/auth", userRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/payroll", payrollRoutes);

module.exports = app;
