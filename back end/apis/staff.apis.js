const staffController = require("../controllers/staff.controller");
const passportAuth = require("../middleware/passport.middleware");
const staffApi = require("express").Router();
// const accountController = require('../controllers/account.controller');

// Gửi mã xác nhận để đăng ký tài khoản
// accountApi.post('/verify', accountController.postSendVerifyCode);
// gửi mã xác thực để verify tài khoản
staffApi.get(
  "/countoderbystatus",
  passportAuth.jwtAuthentication,
  staffController.countOrderByStatus
);
staffApi.get(
  "/getorderbystatus",
  passportAuth.jwtAuthentication,
  staffController.getOrderList
);
staffApi.put(
  "/confimorderbulk",
  passportAuth.jwtAuthentication,
  staffController.comfirmOrderBulk
);

// Đăng ký tài khoản
// staffApi.get('/signup', accountController.postSignUp);

// // Gửi mã xác nhận để lấy lại mật khẩu
// accountApi.post('/verify/forgot', accountController.postSendCodeForgotPW);

// // reset password
// accountApi.post('/reset-pw', accountController.postResetPassword);

module.exports = staffApi;
