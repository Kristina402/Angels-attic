const asyncWrapper = require("../middleware/asyncWrapper");
const ErrorHandler = require("../utils/errorHandler");
const sendEmail = require("../utils/sendEmail");

// Send Contact Message to Attic Angels Email
exports.sendContactMessage = asyncWrapper(async (req, res, next) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return next(new ErrorHandler("Please fill in all fields", 400));
  }

  const emailMessage = `
    New Message from Contact Form:
    
    Name: ${name}
    Email: ${email}
    Subject: ${subject}
    
    Message:
    ${message}
  `;

  try {
    await sendEmail({
      email: "atticangels777@gmail.com",
      subject: `Contact Form: ${subject}`,
      message: emailMessage,
    });

    res.status(200).json({
      success: true,
      message: "Your message has been sent successfully to Attic Angels.",
    });
  } catch (error) {
    console.error("Contact Form Error:", error);
    return next(new ErrorHandler("Email service is currently unavailable. Please try again later.", 500));
  }
});
