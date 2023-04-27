const adminApi = require('express').Router();
const adminController = require('../controllers/admin.controller');
const passportAuth = require('../middleware/passport.middleware');

adminApi.post('/login', adminController.adminLogin);
// api: thêm 1 sản phẩm
adminApi.post(
  '/products/add',
  passportAuth.jwtAuthentication,
  adminController.addProduct
);

// api: cập nhật 1 sản phẩm
adminApi.put(
  '/products/update',
  passportAuth.jwtAuthentication,
  adminController.updateProduct
);

adminApi.get(
  '/customer/by',
  passportAuth.jwtAuthentication,
  adminController.getCustomerListByValue
);

// // api: xoá 1 người dùng
adminApi.delete(
  '/customer/del',
  passportAuth.jwtAuthentication,
  adminController.delCustomer
);
//api: mở khóa người dùng
adminApi.put(
  '/customer/release',
  passportAuth.jwtAuthentication,
  adminController.releaseCustomer
);

// api: lấy danh sách đơn hàng
adminApi.get(
  '/order',
  passportAuth.jwtAuthentication,
  adminController.getOrderList
);
adminApi.get(
  '/order/by',
  passportAuth.jwtAuthentication,
  adminController.getOrderListByValue
);

// api: cập nhật trạng thái đơn hàng
adminApi.post(
  '/order',
  passportAuth.jwtAuthentication,
  adminController.postUpdateOrderStatus
);
adminApi.put(
  '/update-num-contact',
  passportAuth.jwtAuthentication,
  adminController.updateNumOfContact
);
/////////// get product's info //////
adminApi.get(
  '/product',
  passportAuth.jwtAuthentication,
  adminController.getProductDetailsByAdmin
);
adminApi.get(
  '/product-search-by-name',
  passportAuth.jwtAuthentication,
  adminController.adminSearchProduct
);
adminApi.post(
  '/voucher',
  passportAuth.jwtAuthentication,
  adminController.addNewVoucher
);
adminApi.get(
  '/voucher',
  passportAuth.jwtAuthentication,
  adminController.getAllVouchers
);
adminApi.get(
  '/voucher/by',
  passportAuth.jwtAuthentication,
  adminController.getVoucherListByValue
);
adminApi.get('/voucher/type', adminController.getVoucherByCategory);
adminApi.delete(
  '/voucher',
  passportAuth.jwtAuthentication,
  adminController.deleteVoucher
);
adminApi.put(
  '/voucher',
  passportAuth.jwtAuthentication,
  adminController.updateVoucherDetails
);

adminApi.get(
  '/recombeetoken',
  passportAuth.jwtAuthentication,
  adminController.getRecombeeToken
);

module.exports = adminApi;
