const {
  trackingViews,
  trackingAddToCart,
  trackingPurchase,
} = require("../controllers/tracking.controller");

const trackingApi = require("express").Router();
trackingApi.post("/view", trackingViews);
trackingApi.post("/addtocart", trackingAddToCart);
// trackingApi.get('/addpurchase', trackingPurchase)
module.exports.trackingApi = trackingApi;
