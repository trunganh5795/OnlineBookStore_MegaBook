const jwt = require('jsonwebtoken');
const { User } = require('../models');
const cookie = require('cookie');
const jwtAuthSocketIO = async (socket, next) => {
  try {
    let token = cookie.parse(socket.request.headers.cookie).access_token;
    //if not exist cookie[access_token] -> isAuth = false -> next
    if (!token) {
      next(new Error('invalid'));
      return;
    }
    //verify jwt
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (decoded) {
      // console.log("Passport Middleware: ", decoded);
      const { id } = decoded.sub;
      const user = await User.findByPk(id);
      if (user) {
        socket.user = user;
      } else {
        socket.user = null;
      }
    }
    next();
  } catch (error) {
    console.log('Socket IO authentica error: ', error);
    next(new Error('invalid'));
  }
};
module.exports = {
  jwtAuthSocketIO,
};
