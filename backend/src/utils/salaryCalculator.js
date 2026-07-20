/**
 * Calculates net salary based on base pay, leave days, overtime hours, bonus, and deductions.
 * 
 * @param {Object} employee - The employee document/object containing monthlySalary and optional overtimeRate
 * @param {Object} user - The user (employer) settings containing defaultDailyRate and defaultOvertimeRate
 * @param {Object} adjustments - Monthly adjustments
 * @param {number} [adjustments.leaveDays=0]
 * @param {number} [adjustments.overtimeHours=0]
 * @param {number} [adjustments.bonus=0]
 * @param {number} [adjustments.deductions=0]
 */
function calculateNetSalary(employee, user, adjustments = {}) {
  const { leaveDays = 0, overtimeHours = 0, bonus = 0, deductions = 0 } = adjustments;
  const baseSalary = employee.monthlySalary;

  // 1. Calculate Daily Rate & Leave Deduction
  const dailyRate = (user && user.defaultDailyRate) || (baseSalary / 30);
  const leaveDeduction = Math.round(dailyRate * leaveDays);

  // 2. Determine Overtime Rate & Pay
  const overtimeRate = employee.overtimeRate || (user && user.defaultOvertimeRate) || 0;
  const overtimePay = Math.round(overtimeRate * overtimeHours);

  // 3. Compute Net Salary
  const netSalary = baseSalary - leaveDeduction + overtimePay + bonus - deductions;

  return {
    baseSalary,
    leaveDeduction,
    overtimeRate,
    overtimePay,
    netSalary
  };
}

module.exports = { calculateNetSalary };
