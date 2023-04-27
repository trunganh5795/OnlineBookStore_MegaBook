const notifyApi = require("express").Router();
const { getAllNotifyByUser } = require("../controllers/notify.controller");
const passportAuth = require("../middleware/passport.middleware");

notifyApi.get("/", passportAuth.jwtAuthentication, getAllNotifyByUser);
module.exports = notifyApi;
