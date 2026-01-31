const statusCode = require("../enums/statusCode");
const CustomError = require("../exceptions/CustomError");
const Admin = require("../models/Admin"); 
const mongoose = require("mongoose");
 
const nodemailer = require('nodemailer');
 


const { encryptPassword, decryptPassword, generateAdminKey } = require("../utils/encryption");
const otpStore = {};

const add = async (data) => {
  try {
    const existing = await Admin.findOne({ email: data.email });
    if (existing) {
      throw new CustomError("Admin with this email already exists", statusCode.BAD_REQUEST);
    }

     
    const adminKey = generateAdminKey(); 
    data.key = adminKey;

    // Encrypt password using global key + admin key
     const tempPassword = data.password; 
    data.password = encryptPassword(data.password, adminKey);

    const admin = await Admin.create(data);
    admin.key="";
    

 const subject = 'Welcome to Vidhya Kendra School Management System Admin Panel';
    const text = `
Hello ${data.name || ''},

Your admin account has been created for Vidhya Kendra School Management System Admin Panel.

Your login credentials are:

Email: ${data.email}
Temporary Password: ${tempPassword}

Please login and change your password immediately.

Thank you,
Vidhya Kendra School Management System Team
    `;

 try {
      await sendOTP(data.email, null, subject, text); // reuse sendOTP to send email, OTP is null
    } catch (err) {
      throw new CustomError("Failed to send welcome email. Please try again.", statusCode.INTERNAL_SERVER_ERROR);
    }







    return admin;
  } catch (error) {
    throw new CustomError(error.message || "Failed to add admin", statusCode.INTERNAL_SERVER_ERROR);
  }
};

const update = async (data) => {
  try {
    const id = data.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid admin ID format", statusCode.BAD_REQUEST);
    }

    const admin = await Admin.findById(id);
    if (!admin) {
      throw new CustomError("Admin not found", statusCode.NOT_FOUND);
    }

    if (data.email && data.email !== admin.email) {
      const conflict = await Admin.findOne({ _id: { $ne: id }, email: data.email });
      if (conflict) {
        throw new CustomError("Another admin with this email already exists", statusCode.BAD_REQUEST);
      }
       admin.email = data.email;
    }

      if (data.name) {
      admin.name = data.name;
    }

    
    if (data.password) {      
      admin.password = encryptPassword(data.password, admin.key);
    }

    const updatedAdmin = await admin.save();
    updatedAdmin.key="";
    return updatedAdmin;
  } catch (error) {
    throw new CustomError(error.message || "Failed to update admin", statusCode.INTERNAL_SERVER_ERROR);
  }
};

const remove = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid admin ID format", statusCode.BAD_REQUEST);
    }

    const admin = await Admin.findByIdAndDelete(id);
    if (!admin) {
      throw new CustomError("Admin not found", statusCode.NOT_FOUND);
    }

    return admin;
  } catch (error) {
    throw new CustomError(error.message || "Failed to delete admin", statusCode.INTERNAL_SERVER_ERROR);
  }
}
const getById = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid admin ID format", statusCode.BAD_REQUEST);
    }

    const admin = await Admin.findById(id).lean();
    if (!admin) {
      throw new CustomError("Admin not found", statusCode.NOT_FOUND);
    }

    
    delete admin.password;
    delete admin.key;

    return admin;
  } catch (error) {
    throw new CustomError(error.message || "Failed to fetch admin", statusCode.INTERNAL_SERVER_ERROR);
  }
};

const getAll = async () => {
  try {
    const admins = await Admin.find().sort({ createdAt: -1 }).lean();
    const safeAdmins = admins.map((admin) => {
      delete admin.password;
      delete admin.key;
      return admin;
    });

    return safeAdmins;
  } catch (error) {
    throw new CustomError(error.message || "Failed to fetch admins", statusCode.INTERNAL_SERVER_ERROR);
  }
};


 


const verifyLogin = async (email, password) => {
  try {
    if (!email || !password) {
      throw new CustomError("Email and password are required", statusCode.BAD_REQUEST);
    }

    const admin = await Admin.findOne({ email }).lean();
    if (!admin) {
      throw new CustomError("Invalid email or password", statusCode.UNAUTHORIZED);
    }

    console.log("Password :", password);

    const decryptedPassword = decryptPassword(admin.password, admin.key);
    console.log("Decrypted Password :", decryptedPassword);

    if (decryptedPassword !== password) {
      throw new CustomError("Invalid email or password", statusCode.UNAUTHORIZED);
    }

    admin.key = "";
    return admin;

  } catch (error) {
    console.error("Admin Login Error:", error);

    if (error instanceof CustomError) {
      throw error;
    }

    throw new CustomError("Login failed", statusCode.INTERNAL_SERVER_ERROR);
  }
};








const requestOTP = async (email) => {
  try {
    if (!email) {
      throw new CustomError("Email is required.", statusCode.BAD_REQUEST);
    }

    const admin = await Admin.findOne({ email }).lean();
    if (!admin) {
      throw new CustomError("No admin is registered with this email address.", statusCode.UNAUTHORIZED);
    }

    const otp = generateOTP();
    otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // 5 minutes expiry
var subject='Password Reset OTP for Vidhya Kendra School Management System Admin Panel';
 var text= `
Hello,

We received a request to reset the password for your Vidhya Kendra School Management System Admin Panel account.

Your One-Time Password (OTP) for password reset is: ${otp}

This OTP is valid for the next 5 minutes. Please do not share it with anyone.

If you did not request a password reset, please ignore this email.

Thank you,
Vidhya Kendra School Management System Team
    `;

    try {
  await sendOTP(email, otp, subject, text);
} catch (err) {
  throw new CustomError("Failed to send OTP email. Please try again.", statusCode.INTERNAL_SERVER_ERROR);
}


    return `OTP has been sent successfully to the email: ${email}.`;
  } catch (error) {
    throw new CustomError(error.message || "Failed to send OTP.", statusCode.INTERNAL_SERVER_ERROR);
  }
};

const verifyOTP = async (email, otp) => {
  try {
    if (!email || !otp) {
      throw new CustomError("Both email and OTP are required.", statusCode.BAD_REQUEST);
    }

    const record = otpStore[email];
    if (!record) throw new CustomError("OTP not found. Please request a new one.", statusCode.BAD_REQUEST);
    if (record.expiresAt < Date.now()) throw new CustomError("OTP has expired. Please request a new one.", statusCode.BAD_REQUEST);
    if (record.otp != otp) throw new CustomError("Invalid OTP. Please try again.", statusCode.BAD_REQUEST);

    return `OTP has been successfully verified for the email: ${email}.`;
  } catch (error) {
    throw new CustomError(error.message || "Failed to verify OTP.", statusCode.INTERNAL_SERVER_ERROR);
  }
};

const changePassword = async (email, newPassword, otp) => {
  try {
    if (!email || !newPassword || !otp) {
      throw new CustomError("Email, OTP, and new password are all required.", statusCode.BAD_REQUEST);
    }

    const record = otpStore[email];
    if (!record) throw new CustomError("OTP not found. Please request a new one.", statusCode.BAD_REQUEST);
    if (record.expiresAt < Date.now()) throw new CustomError("OTP has expired. Please request a new one.", statusCode.BAD_REQUEST);
    if (record.otp != otp) throw new CustomError("Invalid OTP. Please try again.", statusCode.BAD_REQUEST);

    const admin = await Admin.findOne({ email });
    if (!admin) throw new CustomError("Admin not found with this email address.", statusCode.NOT_FOUND);

    admin.password = encryptPassword(newPassword, admin.key);
    await admin.save();

    delete otpStore[email];

    return "Password has been changed successfully.";
  } catch (error) {
    throw new CustomError(error.message || "Failed to change password.", statusCode.INTERNAL_SERVER_ERROR);
  }
};

// helper function 
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);  
}
const transporter = nodemailer.createTransport({
  // host: 'smtpout.secureserver.net',
  // port: 465,
  // secure: true,
  // auth: {
  //   user: process.env.EMAIL_USER, 
  //   pass: process.env.EMAIL_PASS,
  // },
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
  },
});
async function sendOTP(email, otp,subject,text) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
      text: text,
    html: `<p>${text.replace(/\n/g, '<br>')}</p>`
  };

  await transporter.sendMail(mailOptions);
}



module.exports={
    add,
    update,
    remove,
    getById,
    getAll,
    verifyLogin,
    requestOTP,
    verifyOTP,
    changePassword
}