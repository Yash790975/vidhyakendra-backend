const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    // host: 'smtp.gmail.com',
    // port: 587,
    // secure: false,
    // auth: {
    //   user: process.env.EMAIL_USER,
    //   pass: process.env.EMAIL_PASS,
    // },
  });
};

const sendOTPEmail = async (email, otp, mobile) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"School Management System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'OTP Verification - School Management System',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .header {
              background-color: #ff6b35;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              background-color: white;
              padding: 30px;
              border-radius: 0 0 5px 5px;
            }
            .otp-box {
              background-color: #f0f0f0;
              border: 2px dashed #ff6b35;
              padding: 20px;
              text-align: center;
              font-size: 32px;
              font-weight: bold;
              color: #ff6b35;
              margin: 20px 0;
              letter-spacing: 5px;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>OTP Verification</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>You have requested to verify your mobile number <strong>${mobile}</strong> for School Management System.</p>
              <p>Your One-Time Password (OTP) is:</p>
              <div class="otp-box">${otp}</div>
              <p><strong>This OTP is valid for 10 minutes.</strong></p>
              <p>If you didn't request this verification, please ignore this email.</p>
              <p>Thank you,<br>School Management System Team</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error); 
    throw new Error('Failed to send OTP email');
  }
};

const sendWelcomeEmail = async (email, instituteName, ownerName) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"School Management System" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Welcome to School Management System',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f9f9f9;
            }
            .header {
              background-color: #4CAF50;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              background-color: white;
              padding: 30px;
              border-radius: 0 0 5px 5px;
            }
            .button {
              display: inline-block;
              padding: 12px 30px;
              background-color: #4CAF50;
              color: white;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome! 🎉</h1>
            </div>
            <div class="content">
              <p>Dear ${ownerName},</p>
              <p>Congratulations! Your institute <strong>${instituteName}</strong> has been successfully onboarded to our School Management System.</p>
              <p>Your mobile number has been verified and your account is now active.</p>
              <p>You can now access all the features of our platform to manage your institute efficiently.</p>
              <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
              <p>Best regards,<br>School Management System Team</p>
            </div>
            <div class="footer">
              <p>© 2025 School Management System. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    // Don't throw error for welcome email failure
    return false;
  }
};

module.exports = {
  sendOTPEmail,
  sendWelcomeEmail,
};