const commentController = require("../controllers/comment.controller");
const passportAuth = require("../middleware/passport.middleware");
const commentApi = require("express").Router();
commentApi.get("/", commentController.getCommentList);
commentApi.post(
  "/",
  passportAuth.jwtAuthentication,
  commentController.postComment
);

module.exports = commentApi;
