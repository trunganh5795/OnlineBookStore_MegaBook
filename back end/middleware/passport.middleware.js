const passport = require("passport");
const GooglePlusTokenStrategy = require("passport-google-token").Strategy;
const { User } = require("../models");
// const { User } = require('../models');
// const UserModel = require('../models/account.models/user.model');
const jwt = require("jsonwebtoken");
// const express = require('express');

//authentication with JWT
const jwtAuthentication = async (req, res, next) => {
  try {
    res.locals.isAuth = false;
    let token = null;
    // if (express().get('env') === 'production') token = req.query.token;
    // else
    token = req.cookies.access_token;
    //if not exist cookie[access_token] -> isAuth = false -> next
    if (!token) {
      next({ code: 401, msg: "Unauthorized" });
      return;
    }
    //verify jwt
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (decoded) {
      const { id } = decoded.sub;
      const user = await User.findByPk(id);
      if (user) {
        res.locals.isAuth = true;
        req.user = user;
      }
    }
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized.",
      error,
    });
  }
};

// ! xác thực với google plus
// get secretkey : https://console.cloud.google.com/apis/credentials/oauthclient/120601317207-antrd8qc33vhe0ndig1gg42olb7rabeu.apps.googleusercontent.com?project=react-login-343803
//config passwport
passport.use(
  new GooglePlusTokenStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id, name } = profile;

        const { familyName, givenName } = name;
        const email = profile.emails[0].value;

        // kiểm tra email đã tồn tại hay chưa => null là chưa
        const localUser = await User.findOne({
          where: {
            email,
            authType: "local",
          },
        });

        if (localUser) return done(null, localUser);

        const user = await User.findOne({
          where: {
            email,
            authType: "google",
          },
        });
        if (user) return done(null, user);

        // tạo account và user tương ứng
        const newAccount = await User.create({
          authType: "google",
          name: familyName + " " + givenName,
          email,
          password: 123456, // Không quan tâm vì login bằng google, nhập vô cho có khỏi báo lỗi
          dateOfBirth: null,
          gender: "male",
          address: "Empty",
          phone_no: "0978369565",
          active: "active",
          verifyCode: 123456,
          authType: "google",
        });
        done(null, newAccount);
      } catch (error) {
        console.log(error);
        done(error, false);
      }
    }
  )
);

module.exports = {
  jwtAuthentication,
};
