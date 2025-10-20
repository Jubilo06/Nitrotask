import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Configure your email transporter
// Example: Using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "gmail", // Use 'smtp.mailgun.org', 'smtp.sendgrid.net' etc. for other services
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send a single email
export const sendEmail = async (to, subject, htmlContent) => {
  const mailOptions = {
    from: process.env.EMAIL_USER, // Your sender email
    to: to,
    subject: subject,
    html: htmlContent, // Use HTML for rich formatting
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email to %s: %s", to, error);
    // In a production app, you might want to log this error to a monitoring system
    return false;
  }
};

// Example for SendGrid (if you choose that path):
/*
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (to, subject, htmlContent) => {
    const msg = {
        to: to,
        from: 'your_verified_sender_email@example.com', // Must be a verified sender in SendGrid
        subject: subject,
        html: htmlContent,
    };
    try {
        await sgMail.send(msg);
        console.log('Email sent to %s via SendGrid', to);
        return true;
    } catch (error) {
        console.error('Error sending email via SendGrid to %s:', to, error.response?.body || error);
        return false;
    }
};
*/
