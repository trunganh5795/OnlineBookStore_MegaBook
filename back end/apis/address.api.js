const addressApi = require("express").Router();
const addressController = require("../controllers/address.controller");
const passportAuth = require("../middleware/passport.middleware");

// api: lấy danh sách các tỉnh thành phố
addressApi.get("/province", addressController.getProvince);

// api: lấy danh sách huyện/quận theo id tỉnh
addressApi.get("/district", addressController.getDistrict);

// api: lấy danh sách phường, đường theo id huyện
addressApi.get("/ward", addressController.getWard);

// api: Lấy danh sách địa chỉ nhận hàng
addressApi.get(
  "/delivery",
  passportAuth.jwtAuthentication,
  addressController.getShippingAddressList
);
// api: Thêm địa chỉ nhận hàng
addressApi.post(
  "/delivery",
  passportAuth.jwtAuthentication,
  addressController.addNewShippingAddress
);

// // api: Xoá 1 địa chỉ nhận hàng
addressApi.delete(
  "/delivery",
  passportAuth.jwtAuthentication,
  addressController.delAddDeliveryAddress
);

// api: cài mặc định 1 địa chỉ nhận hàng
addressApi.put(
  "/delivery",
  passportAuth.jwtAuthentication,
  addressController.putSetDefaultDeliveryAddress
);

addressApi.get("/shippingcost", addressController.caculateShippingCost);
module.exports = addressApi;
