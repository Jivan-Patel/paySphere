const Employee = require("../models/employee.model");
const User = require("../models/user.model");
const { parse } = require("csv-parse");
// ADD EMPLOYEE
exports.addEmployee = async (req, res) => {
  try {
    const { fullName, role, monthlySalary, overtimeRate } = req.body;

    if (!fullName || !monthlySalary) {
      return res.status(400).json({ message: "Full name and monthly salary are required" });
    }

    // Get the user's company name
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const employee = new Employee({
      fullName,
      role: role || "",
      monthlySalary,
      overtimeRate: overtimeRate || 0,
      companyName: user.companyName,
      createdBy: req.userId,
    });

    await employee.save();

    res.status(201).json({ message: "Employee added successfully", employee });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET ALL EMPLOYEES (for the logged-in user's company)
exports.getEmployees = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const totalEmployees = await Employee.countDocuments({
      createdBy: req.userId,
    });

    const employees = await Employee.find({
      createdBy: req.userId,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalEmployees / limit);

    res.status(200).json({
      employees,
      currentPage: page,
      totalPages,
      totalEmployees,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET RECENTLY ADDED EMPLOYEES (last 5)
exports.getRecentEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({ createdBy: req.userId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({ employees });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.importEmployees = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No CSV file uploaded",
      });
    }

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const csvData = req.file.buffer.toString("utf-8");

    parse(
      csvData,
      {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      },
      async (err, records) => {
        if (err) {
          return res.status(400).json({
            message: "Invalid CSV format",
          });
        }

        const employees = [];
        const errors = [];
        let skipped = 0;

        records.forEach((record, index) => {
          const fullName = record.fullName?.trim();
          const role = record.role?.trim() || "";
          const monthlySalary = Number(record.monthlySalary);
          const overtimeRate = Number(record.overtimeRate || 0);

          if (!fullName) {
            skipped++;
            errors.push({
              row: index + 2,
              reason: "Full name is required",
            });
            return;
          }

          if (isNaN(monthlySalary) || monthlySalary <= 0) {
            skipped++;
            errors.push({
              row: index + 2,
              reason: "Invalid monthly salary",
            });
            return;
          }

          if (isNaN(overtimeRate) || overtimeRate < 0) {
            skipped++;
            errors.push({
              row: index + 2,
              reason: "Invalid overtime rate",
            });
            return;
          }

          employees.push({
            fullName,
            role,
            monthlySalary,
            overtimeRate,
            companyName: user.companyName,
            createdBy: req.userId,
          });
        });

        if (employees.length > 0) {
          await Employee.insertMany(employees);
        }

        return res.status(200).json({
          message: "Employee import completed",
          imported: employees.length,
          skipped,
          errors,
        });
      }
    );
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};