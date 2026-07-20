const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const fs = require("fs");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.ethereal.email",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

exports.sendPayslipEmail = async (employee, payroll) => {
  if (!employee.email) {
    console.log(`No email found for employee: ${employee.fullName}`);
    return;
  }

  return new Promise((resolve, reject) => {
    try {
      // Generate PDF in memory
      const doc = new PDFDocument({ margin: 50 });
      let buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", async () => {
        const pdfData = Buffer.concat(buffers);
        
        const mailOptions = {
          from: process.env.EMAIL_FROM || '"PaySphere" <no-reply@paysphere.com>',
          to: employee.email,
          subject: `Payslip for ${payroll.month}/${payroll.year}`,
          text: `Hello ${employee.fullName},\n\nPlease find attached your payslip for ${payroll.month}/${payroll.year}.\n\nBest Regards,\nPaySphere Team`,
          attachments: [
            {
              filename: `Payslip_${payroll.month}_${payroll.year}.pdf`,
              content: pdfData,
            },
          ],
        };

        try {
          const info = await transporter.sendMail(mailOptions);
          console.log(`Payslip email sent to ${employee.email}: ${info.messageId}`);
          resolve(info);
        } catch (err) {
          console.error("Error sending email:", err);
          reject(err);
        }
      });

      // Build PDF content
      doc.fontSize(20).text("PaySphere", { align: "center" });
      doc.moveDown();
      doc.fontSize(16).text(`Payslip for ${payroll.month}/${payroll.year}`, { align: "center" });
      doc.moveDown(2);
      
      doc.fontSize(12).text(`Employee Name: ${employee.fullName}`);
      doc.text(`Role: ${employee.role || "N/A"}`);
      doc.text(`Company: ${employee.companyName}`);
      doc.moveDown();
      
      doc.text(`Base Salary: Rs. ${payroll.baseSalary.toFixed(2)}`);
      doc.text(`Leave Days: ${payroll.leaveDays} (Rs. -${payroll.leaveDeduction.toFixed(2)})`);
      doc.text(`Overtime Hours: ${payroll.overtimeHours} (Rs. +${payroll.overtimePay.toFixed(2)})`);
      doc.text(`Bonus: Rs. +${payroll.bonus.toFixed(2)}`);
      doc.text(`Deductions: Rs. -${payroll.deductions.toFixed(2)}`);
      doc.moveDown();
      
      doc.fontSize(14).text(`Net Salary: Rs. ${payroll.netSalary.toFixed(2)}`, { underline: true });
      doc.end();

    } catch (error) {
      console.error("Error generating PDF:", error);
      reject(error);
    }
  });
};
