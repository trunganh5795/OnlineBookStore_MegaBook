const { client } = require("./statistic.controller");

const trackingViews = async (req, res, next) => {
  try {
    const { rcmId, index, type, bookid } = req.body;
    if (rcmId && index >= 0 && type && bookid) {
      client.index({
        index: "tracking",
        body: {
          recombeeid: rcmId,
          recommend_type: type,
          index,
          action: 0, //0 : view , 1: add to cart ,2: purchase
          bookid,
        },
      });
    }
    res.status(200).send("done");
  } catch (error) {
    next({});
  }
};
const trackingAddToCart = async (req, res, next) => {
  try {
    const { rcmId, index, type, bookid } = req.body;

    if (rcmId && index >= 0 && type && bookid) {
      client.index({
        index: "tracking",
        body: {
          recombeeid: rcmId,
          recommend_type: type, // also buy or similar product
          index,
          action: 1, //0 : view , 1: add to cart ,2: purchase
          bookid,
        },
      });
      res.status(200).send("OK");
    } else {
      next({ code: 400, msg: "Bad request" });
    }
  } catch (error) {
    next({});
  }
};
const trackingPurchase = async (data) => {
  client.helpers.bulk({
    datasource: data,
    onDocument(doc) {
      return {
        index: { _index: "tracking" },
      };
    },
  });
};
module.exports = {
  trackingViews,
  trackingAddToCart,
  trackingPurchase,
};
