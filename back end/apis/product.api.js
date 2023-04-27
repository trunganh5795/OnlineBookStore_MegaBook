const productApi = require("express").Router();
const productController = require("../controllers/product.controller");

// api: Lấy 1 sản phẩm theo id
productApi.get("/", productController.getProduct);

productApi.get("/bestbook", productController.getBestBook);

productApi.get("/getsellbyid", productController.countNumOfSellById);

// // api: Lấy danh sách sản phẩm liên quan
// productApi.get('/list/related', productController.getProductList);

// api: lấy danh sách và phân trang
productApi.get("/all", productController.getAllProducts);

// // api: tìm kiếm sản phẩm
// productApi.get('/search', productController.getSearchProducts);
productApi.get("/search", productController.getProductByNameElk);

// api: lọc sản phẩm
productApi.get("/filter", productController.getAllProductsByType);
// api: get top sell
productApi.get("/topsell", productController.getTopSell);
// api: get top sell by type
productApi.get("/topsell/:type", productController.getTopSellByCategory);

// productApi.post('/list/recommend',productController.getRecommendProducts)

module.exports = productApi;
