// const AccountModel = require('../models/account.models/account.model');
// const VerifyModel = require('../models/account.models/verify.model');
// const UserModel = require('../models/account.models/user.model');
const mailConfig = require('../config/mail.config');
// const helper = require('../helpers');
// const constants = require('../constants');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { Op } = require('sequelize');
const helpers = require('../helpers');
const constrants = require('../constrants');
// //fn: Gửi mã xác thực để đăng ký
// const postSendVerifyCode = async (req, res) => {
//   try {
//     const { email } = req.body;
//     //Kiểm tra tài khoản đã tồn tại hay chưa
//     const account = await AccountModel.findOne({ email });

//     //nếu tồn tại, thông báo lỗi, return
//     if (account) {
//       let suffixError =
//         account.authType === 'local'
//           ? ''
//           : `bởi đăng nhập với ${account.authType}`;
//       let error = `Email đã được sử dụng ${suffixError} !`;
//       return res.status(400).json({ message: error });
//     }

//     //cấu hình email sẽ gửi
//     const verifyCode = helper.generateVerifyCode(constants.NUMBER_VERIFY_CODE);
//     const mail = {
//       to: email,
//       subject: 'Mã xác thực tạo tài khoản',
//       html: mailConfig.htmlSignupAccount(verifyCode),
//     };

//     //lưu mã vào database để xác thực sau này
//     await VerifyModel.findOneAndDelete({ email });
//     await VerifyModel.create({
//       code: verifyCode,
//       email,
//       dateCreated: Date.now(),
//     });

//     //gửi mail
//     const result = await mailConfig.sendEmail(mail);

//     //if success
//     if (result) {
//       return res.status(200).json({ message: 'success' });
//     }
//   } catch (error) {
//     return res.status(400).json({
//       message: 'Gửi mã thất bại',
//       error,
//     });
//   }
// };
const verifyAccount = async (req, res) => {
  let { email, code } = req.body.account;
  const account = await User.findOne({
    where: { email, verifyCode: code },
  });
  account.active = 'active';
  await account.save();
  res.status(200).send(account);
};
//fn: Đăng ký tài khoản
const postSignUp = async (req, res, next) => {
  try {
    const { email, password, name, dateOfBirth, gender } = req.body.account;
    // Kiểm tra rỗng , vì một số trường đăng nhập bằng gmail cho phép rỗng
    if (!(email && password && name && dateOfBirth && gender))
      return next({ code: 400, msg: 'Bad Request' });
    //Kiểm tra tài khoản đã tồn tại hay chưa
    const account = await User.findOne({
      where: {
        email,
      },
    });

    //nếu tồn tại, thông báo lỗi, return
    if (account) {
      let error = `Email or Phone already exist !`;
      return next({ code: 409, msg: error });
    }
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);
    // Tạo code xác minh tài khoản
    let verifyCode = helpers.generateVerifyCode(constrants.NUMBER_VERIFY_CODE);
    // Tạo tạo tài khoản và user tương ứng
    await User.create({
      email,
      password: hashPassword,
      name,
      dateOfBirth,
      gender,
      active: 'active',
      verifyCode: verifyCode,
      authType: 'local',
    });

    return res.status(200).json({ message: 'successful' });
  } catch (error) {
    return next({ code: 500, msg: 'Something went wrong' });
  }
};

// //fn: Gửi mã xác thực để lấy lại mật khẩu
// const postSendCodeForgotPW = async (req, res, next) => {
//   try {
//     const { email } = req.body;
//     //Kiểm tra tài khoản đã tồn tại hay chưa
//     const account = await AccountModel.findOne({ email });

//     //nếu tồn tại, thông báo lỗi, return
//     if (!account)
//       return res.status(406).json({ message: 'The Account doesn't exist' });

//     //cấu hình email sẽ gửi
//     const verifyCode = helper.generateVerifyCode(constants.NUMBER_VERIFY_CODE);
//     const mail = {
//       to: email,
//       subject: 'Change password',
//       html: mailConfig.htmlResetPassword(verifyCode),
//     };

//     //lưu mã vào database để xác thực sau này
//     await VerifyModel.findOneAndDelete({ email });
//     await VerifyModel.create({
//       code: verifyCode,
//       email,
//       dateCreated: Date.now(),
//     });

//     //gửi mail
//     const result = await mailConfig.sendEmail(mail);

//     //if success
//     if (result) {
//       return res.status(200).json({ message: 'success' });
//     }
//   } catch (error) {
//     return res.status(409).json({
//       message: 'Fail',
//       error,
//     });
//   }
// };

// //fn: reset password
// const postResetPassword = async (req, res, next) => {
//   try {
//     const { email, password, verifyCode } = req.body.account;

//     // kiểm tra mã xác thực
//     const isVerify = await helper.isVerifyEmail(email, verifyCode);

//     if (!isVerify) {
//       return res.status(401).json({ message: 'Invalid code' });
//     }
//     //check userName -> hash new password -> change password
//     const hashPassword = await bcrypt.hash(
//       password,
//       parseInt(process.env.SALT_ROUND),
//     );

//     const response = await AccountModel.updateOne(
//       { email, authType: 'local' },
//       { password: hashPassword },
//     );

//     //check response -> return client
//     if (response.n) {
//       //xoá mã xác nhận
//       await VerifyModel.deleteOne({ email });
//       return res.status(200).json({ message: 'Success' });
//     } else {
//       return res.status(409).json({ message: 'Something want wrong' });
//     }
//   } catch (error) {
//     return res.status(409).json({ message: 'Something want wrong' });
//   }
// };

module.exports = {
  // postSendVerifyCode,
  postSignUp,
  // postSendCodeForgotPW,
  // postResetPassword,
  verifyAccount,
};
