const generateReferenceId = () => {
  const timestamp = Date.now();
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `${timestamp}${randomNum}`;
};

const generateInstituteCode = () => {
  const randomNum = Math.floor(100000000 + Math.random() * 900000000);
  return `VIDHKEND${randomNum}`;
};

const maskAadhaar = (aadhaarNumber) => {
  if (!aadhaarNumber || aadhaarNumber.length < 4) {
    return aadhaarNumber;
  }
  return `XXXX-XXXX-${aadhaarNumber.slice(-4)}`;
};

const maskPAN = (panNumber) => {
  if (!panNumber || panNumber.length < 4) {
    return panNumber;
  }
  return `XXXXXX${panNumber.slice(-4)}`;
};

module.exports = {
  generateReferenceId,
  generateInstituteCode,
  maskAadhaar,
  maskPAN
};