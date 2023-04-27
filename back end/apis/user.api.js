const express = require("express");
const userApi = express.Router();
const userController = require("../controllers/user.controller");
const passportAuth = require("../middleware/passport.middleware");

// api: get  user
userApi.get("/", passportAuth.jwtAuthentication, userController.getUser);
// api: update user
userApi.put(
  "/update",
  passportAuth.jwtAuthentication,
  userController.putUpdateUser
);

module.exports = userApi;
