const nodemailer = require('nodemailer');

async function sendTempPassword(email, tempPassword) {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Manager Account Temporary Password',
      text: `Welcome!\n\nYour temporary password is: ${tempPassword}\n\nPlease log in and change your password for security.\n\nIf you did not request this, please ignore this email.`,
      html: `<p>Welcome!</p><p>Your temporary password is: <strong>${tempPassword}</strong></p><p>Please log in and change your password for security.</p>`,
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (err) {
    console.error("Error sending email:", err.message);
    throw new Error("Failed to send email: " + err.message);
  }
}

module.exports = sendTempPassword;
