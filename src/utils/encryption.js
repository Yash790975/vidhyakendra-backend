const crypto = require("crypto");
/*
To Generate ADMIN key use this cammand in you terminal or command prompt
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
*/
const IV_LENGTH = 16;

const encryptPassword = (password, adminKey) => {
  
  const key = crypto.createHash("sha256")
    .update(process.env.ADMIN_ENCRYPTION_KEY + adminKey)
    .digest();

  // Generate random IV
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(password, "utf8", "hex");
  encrypted += cipher.final("hex");

  // Return both encrypted text and IV (IV is needed to decrypt later)
  return iv.toString("hex") + ":" + encrypted;
};

const decryptPassword = (encryptedPassword, adminKey) => {
  const [ivHex, encrypted] = encryptedPassword.split(":");
  const iv = Buffer.from(ivHex, "hex");

  const key = crypto.createHash("sha256")
    .update(process.env.ADMIN_ENCRYPTION_KEY + adminKey)
    .digest();

  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};

const generateAdminKey = () => crypto.randomBytes(16).toString("hex");

module.exports = {
  encryptPassword,
  decryptPassword,
  generateAdminKey,
};
