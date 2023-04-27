const jwt = require("jsonwebtoken");
const constants = require("../constrants/index");

// tạo một jwt với account id
const encodedToken = (secretKey, user, expire = constants.JWT_EXPIRES_TIME) => {
  return jwt.sign(
    {
      iss: process.env.JWT_ISS,
      sub: user,
    },
    secretKey,
    { expiresIn: expire }
  );
};

module.exports = {
  encodedToken,
};
