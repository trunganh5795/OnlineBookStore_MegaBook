// ! set environment variables
require('dotenv').config();

// ! import library
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
// const swaggerUi = require('swagger-ui-express');
const morgan = require('morgan');
// const swaggerDocument = require('./swagger.json');
// const cookie = require('cookie');
const app = express();
const server = require('http').createServer(app);
const socketIO = require('./config/socket.io.config');
socketIO.init(server);
// ! ================== import local file ===========//
const corsConfig = require('./config/cors.config');
const constants = require('./constrants');
const productApi = require('./apis/product.api');
const accountApi = require('./apis/account.api');
const loginApi = require('./apis/login.api');
const userApi = require('./apis/user.api');
const adminApi = require('./apis/admin.api');
const { errorMsg } = require('./middleware/error.handler');
const addressApi = require('./apis/address.api');
const orderApi = require('./apis/order.apis');
const commentApi = require('./apis/comment.api');
const notifyApi = require('./apis/notification.api');
const statisticApi = require('./apis/statistic.api');
const { webHookStripeEvent } = require('./controllers/order.controller');
const { trackingApi } = require('./apis/tracking.api');
const staffApi = require('./apis/staff.apis');
// ! ================== set port ================== //

// io.use(cookieParser());
// require('https').createServer({
//     cert: app.fs.readFileSync('/etc/ssl/hcmussh_certificate.crt'),
//     ca: app.fs.readFileSync('/etc/ssl/hcmussh_ca_bundle.crt'),
//     key: app.fs.readFileSync('/etc/ssl/hcmussh_private.key'),
// }, app);

const normalizePort = (port) => parseInt(port, 10);
const PORT = normalizePort(process.env.PORT || 7000);

// ! ================== set static path ================== //
app.use(express.static(path.join(__dirname, './img')));
const dev = app.get('env') !== 'production';
// console.log(dev)
if (!dev) {
    app.disable('x-powered-by');
    app.use(morgan('common'));
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '/src/build', 'index.html'));
    });
} else {
    app.use(morgan('dev'));
}

//
app.use('/stripe/webhook', express.raw({ type: "*/*" }))
app.post('/stripe/webhook', webHookStripeEvent)
// ph???i ????? c??i webhook n??y tr??n c??i app.use(cors()) v?? kh??ng bi???t c??i origin t??? stripe l?? g?? n???u ????? d?????i c??i app.use(cors()) th?? n?? s??? b??? block origin
// ! ============== config =================

app.use(express.json({ limit: constants.MAX_SIZE_JSON_REQUEST }));
app.use(express.urlencoded({ limit: constants.MAX_SIZE_JSON_REQUEST }));
app.use(cookieParser());
// app.use(cors(corsConfig));
// app.use(cors({
//     // allowedHeaders: "Authorization,Content-Type",
//     methods: "get",
//     origin: function (origin, callback) {
//         if (["http://778f-2405-4802-8118-4c00-a952-fc37-7f5-a200.ngrok.io"].indexOf(origin) !== -1) {
//             callback(null, true)
//         } else {
//             console.log("CORS blocked: ", origin); //
//             callback(new Error('Not allowed by CORS'))
//         }
//     }
// }));
app.use(cors())
app.disable('etag');

server.listen(PORT, () => {
    console.log(express().get('env'))
    console.log(`Server is listening on port ${PORT} !!`);
});

// ! ================== Routes - Api ================== //
// // api documentations
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/test', (req, res) => {
    try {
        console.log(req);
        res.send("OK")
    } catch (error) {
        console.log(error)
        res.status(500).send("fail")
    }

})
// api trang admin
app.use('/apis/admin', adminApi);
//api cho nh??n vi??n (staff)
app.use('/apis/staff', staffApi)
// api li??n quan ?????n address
app.use('/apis/address', addressApi);

// api li??n quan ?????n account
app.use('/apis/accounts', accountApi);

// api li??n quan user
app.use('/apis/user', userApi);

// api li??n quan ?????n login
app.use('/apis/login', loginApi);

// api li??n quan ?????n product
app.use('/apis/products', productApi);

// api li??n quan comment
app.use('/apis/comments', commentApi);

// api li??n quan ????n h??ng
app.use('/apis/orders', orderApi);
// api li??n quan ?????n th??ng b??o
app.use('/apis/notification', notifyApi);

// // api li??n qu???n ?????n th???ng k?? admin
app.use('/apis/statistic', statisticApi);
// api tracking
app.use('/apis/tracking', trackingApi);


// wrong url response
app.use((req, res, next) => {
    next({ msg: "Wrong URL", code: 400 })
})
app.use(errorMsg) // khai b??o middleware , khi g???i next({}) next c?? truy???n param th?? s??? g???i t???i middleware
socketIO.getIO().on('connection', (socket) => {
    // console.log('connect: ', socket.id);
    socketIO.connectedUser.push({ userId: socket.user.id, socketId: socket.id })
    socket.on('disconnect', () => {
        // console.log("disconnect: ", socket.id);
        let userIndex = socketIO.connectedUser.findIndex(user => user.socketId === socket.id)
        if (userIndex !== -1) socketIO.connectedUser.splice(userIndex, 1)
    })
});

// "username": "admin",
// "password": "Trunganh123!",
// "host": "database-1.cwurtsu5aftb.ap-southeast-1.rds.amazonaws.com",