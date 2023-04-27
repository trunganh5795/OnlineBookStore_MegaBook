const errorMsg = (err, req, res, next) => {
  // console.log("error.handler.js middleware Handle Error")
  console.log(err);
  let statusCode = err.code || 500;
  let msg = err.msg || "Xảy ra lỗi, thử lại sau !";
  res.status(statusCode).send(msg);
};
module.exports = { errorMsg };
