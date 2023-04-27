const { Server } = require("socket.io");
const { jwtAuthSocketIO } = require("../middleware/socket.io.auth");

let io;
let connectionUserList = [];
module.exports = {
  init: function (server) {
    io = new Server(server, {
      cors: {
        origin: ["http://localhost:3000", "https://magabook.shop"],
        methods: ["GET", "POST"],
        // allowedHeaders: ["my-custom-header"],
        credentials: true,
      },
    });
    io.use(jwtAuthSocketIO);
    return io;
  },
  getIO: function () {
    if (!io) {
      throw new Error("Can't get io instance before calling .init()");
    }
    return io;
  },
  connectedUser: connectionUserList,
};
