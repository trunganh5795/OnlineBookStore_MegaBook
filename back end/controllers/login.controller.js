const { User } = require("../models");
// const mailConfig = require('../configs/mail.config');
const constants = require("../constrants");
const bcrypt = require("bcryptjs");
const jwtConfig = require("../config/jwt.config");
// fn: đăng nhập local
// Note: login success -> create refresh token -> create jwt -> set cookie client
const postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body.account;
    let userDetail = await User.findOne({
      where: {
        email: email,
        active: "active",
        authType: "local",
        role: "client",
      },
    });
    if (userDetail) {
      let isMatchPassword = bcrypt.compareSync(
        password.toString(),
        userDetail.password
      );
      if (!isMatchPassword) {
        return next({ code: 401, msg: "Email hoặc mật khẩu không đúng" });
      }

      // tạo mã refresh token
      const refreshToken = jwtConfig.encodedToken(
        process.env.JWT_SECRET_REFRESH_KEY,
        { email: userDetail.email, id: userDetail.id },
        constants.JWT_REFRESH_EXPIRES_TIME
      );

      //tạo access token
      let token = jwtConfig.encodedToken(process.env.JWT_SECRET_KEY, {
        email: userDetail.email,
        id: userDetail.id,
      });

      //nếu không duy trì đăng nhập thì giữ trạng thái sống token là session
      const EXPIRE_IN_MILISECOND = new Date(
        Date.now() + constants.COOKIE_EXPIRES_TIME
      );
      // ! gửi token lưu vào cookie và chỉ đọc

      res.cookie("access_token", token, {
        httpOnly: true,
        expires: EXPIRE_IN_MILISECOND,
      });
      return res.status(200).json({ refreshToken, message: "success" });
      // }
    } else {
      res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
    }
  } catch (error) {
    res.status(500).json({ message: "Đăng nhập thất bại. Thử lại", error });
  }
};

// fn: Đăng nhập với google
const postLoginWithGoogle = async (req, res, next) => {
  try {
    // user from middleware passport
    const { user } = req;
    // // nếu user có type = local thì báo lỗi
    if (user.authType === "local") {
      return res.status(401).json({ message: "Email has been used." });
    }

    // tạo refresh token
    const refreshToken = jwtConfig.encodedToken(
      process.env.JWT_SECRET_REFRESH_KEY,
      { id: user.id, email: user.email, keepLogin: true },
      constants.JWT_REFRESH_EXPIRES_TIME
    );
    // //save refresh token into database
    // await AccountModel.updateOne({ _id: user._id }, { refreshToken });

    //create JWToken -> set header -> send client
    const token = jwtConfig.encodedToken(process.env.JWT_SECRET_KEY, {
      id: user.id,
      email: user.email,
    });

    // if (express().get('env') === 'production') {
    //   if (token)
    //     return res.status(200).json({ token, refreshToken, success: true });
    // } else {
    const expiresIn = new Date(Date.now() + constants.COOKIE_EXPIRES_TIME);
    //set cookie for web browser
    res.cookie("access_token", token, {
      httpOnly: true,
      expires: expiresIn,
    });
    res.status(200).json({ refreshToken, success: true });
    // }
  } catch (error) {
    return res.status(401).json({ message: "Lỗi! Vui lòng thử lại.", error });
  }
};

// fn: check authenticate with jwt -> return isAuth
const getAuth = (req, res, next) => {
  if (res.locals.isAuth) return res.json({ isAuth: res.locals.isAuth });

  return res.json({ isAuth: false });
};

// fn: logout
const postLogout = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    return res.status(200).json({ message: "success" });
  } catch (error) {
    // console.error(error);
    return res.status(409).json({ message: "failed" });
  }
};

module.exports = {
  postLogin,
  postLoginWithGoogle,
  getAuth,
  postLogout,
};
