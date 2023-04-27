const express = require('express');
const orderApi = express.Router();
const orderController = require('../controllers/order.controller');
const passportAuth = require('../middleware/passport.middleware');
// api: lấy danh sách đơn hàng
orderApi.get(
  '/list',
  passportAuth.jwtAuthentication,
  orderController.getOrderList
);

// api: lấy chi tiết 1 đơn hàng
orderApi.get(
  '/',
  passportAuth.jwtAuthentication,
  orderController.getOrderDetails
);

// get order's progress
orderApi.get(
  '/progress',
  passportAuth.jwtAuthentication,
  orderController.getOrderProgress
);

// api: tạo 1 đơn hàng (tách nhiều sản phẩm ra mỗi sp 1 đơn)
orderApi.post(
  '/',
  passportAuth.jwtAuthentication,
  orderController.postCreateOrder
);

orderApi.put(
  '/cancel',
  passportAuth.jwtAuthentication,
  orderController.userCancelOrder
);

module.exports = orderApi;
