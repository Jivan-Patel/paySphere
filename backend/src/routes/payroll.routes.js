const express = require("express");
const { finalizePayroll, getPayrollSummary, exportPayrollCSV, sendPayslipEmailHandler, sendAllPayslipsEmailHandler } = require("../controllers/payroll.controller");
const auth = require("../middlewares/auth.middleware");
const router = express.Router();

router.post("/finalize", auth, finalizePayroll);
router.get("/summary", auth, getPayrollSummary);
router.get("/export-csv", auth, exportPayrollCSV);
router.post("/send-email/:id", auth, sendPayslipEmailHandler);
router.post("/send-all-emails", auth, sendAllPayslipsEmailHandler);

module.exports = router;

