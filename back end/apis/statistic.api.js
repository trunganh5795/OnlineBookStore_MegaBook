const statisticApi = require("express").Router();
const {
  countOrderAndTotal,
  countRate,
  getLatestOrder,
  histogramOrder,
  getTop5BestSell,
  getTop5LocationSell,
  getTop5Total,
  getTop5LocationTotal,
  getTop5SellByCategory,
  countTotalSellById,
  numOfOrderByStatus,
  numOfNewUserByDay,
} = require("../controllers/statistic.controller");
const passportAuth = require("../middleware/passport.middleware");
// statisticApi.get('/ordercount', passportAuth.jwtAuthentication, countOrder)
statisticApi.get(
  "/countorder",
  passportAuth.jwtAuthentication,
  countOrderAndTotal
);
statisticApi.get(
  "/classifyorder",
  passportAuth.jwtAuthentication,
  numOfOrderByStatus
);
statisticApi.get(
  "/numofnewuser",
  passportAuth.jwtAuthentication,
  numOfNewUserByDay
);
statisticApi.get("/countrate", passportAuth.jwtAuthentication, countRate);
statisticApi.get(
  "/latestorder",
  passportAuth.jwtAuthentication,
  getLatestOrder
);
statisticApi.get("/histogram", passportAuth.jwtAuthentication, histogramOrder);
statisticApi.get(
  "/totalbyid",
  passportAuth.jwtAuthentication,
  countTotalSellById
);
statisticApi.get("/top5sell", passportAuth.jwtAuthentication, getTop5BestSell);
statisticApi.get(
  "/top5location",
  passportAuth.jwtAuthentication,
  getTop5LocationSell
);
statisticApi.get("/top5total", passportAuth.jwtAuthentication, getTop5Total); // top 5 sản phẩm có doanh thu cao nhất
statisticApi.get(
  "/top5locationtotal",
  passportAuth.jwtAuthentication,
  getTop5LocationTotal
);
statisticApi.get(
  "/top5sellByCategory",
  passportAuth.jwtAuthentication,
  getTop5SellByCategory
);
module.exports = statisticApi;
