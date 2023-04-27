const {
  Order,
  sequelize,
  Order_detail,
  amount_discount,
  Percentage_discount,
  Predict_cancellation,
  Notification,
  Book,
  Voucher,
  ShippingAddress,
  Ward,
  District,
  Province,
} = require("../models");
const { Op } = require("sequelize");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// var recombee = require('recombee-api-client');
const { calculateShippingFee, discountByVoucher } = require("../helpers");
const { calculateCancellationRate } = require("./admin.controller");
const { trackingPurchase } = require("./tracking.controller");
const { rqs, clientRecombee } = require("../config/recombee.config");
// var rqs = recombee.requests;
// var client = new recombee.ApiClient(process.env.RECOMBEE_DATABASE, process.env.RECOMBEE_SECRET_KEY, { region: process.env.RECOMBEE_REGION });
// api: lấy danh sách đơn hàng
const success_url =
  process.env.NODE_ENV === "production"
    ? process.env.STRIPE_SUCCESS_URL
    : "http://localhost:3000/account/orders";
const cancel_url =
  process.env.NODE_ENV === "production"
    ? process.env.STRIPE_CANCEL_URL
    : "http://localhost:3000/";

const getOrderList = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const orderList = await Order.findAll({
      where: {
        user_id,
      },
      include: {
        model: Order_detail,
        as: "order_detail",
        include: {
          model: Book,
          as: "product",
          attributes: ["title", "BookId"],
        },
      },
      // attributes:['isRate'],
      order: [["createdAt", "DESC"]],
    });
    if (orderList) {
      return res.status(200).json({ list: orderList });
    }
    return res.status(200).json({ list: [] });
  } catch (error) {
    // console.error(error);
    return res.status(401).json({ list: [] });
  }
};
// api: lấy chi tiết 1 đơn hàng
const getOrderDetails = async (req, res, next) => {
  try {
    const { orderId } = req.query;
    let whereClause =
      req.user.role === "client" ? { user_id: req.user.id } : {};
    //nếu là admin thì chỉ cần query theo orderID
    // nếu là client thì cần cả orderId và user_id
    let orderDetail = await Order.findByPk(orderId, {
      where: whereClause,
      include: [
        {
          model: Order_detail,
          as: "order_detail",
          include: {
            model: Book,
            as: "product",
            attributes: ["bookId", "title", "price"],
          },
        },
        {
          model: ShippingAddress,
          include: {
            model: Ward,
            as: "ward",
            include: {
              model: District,
              as: "district",
              attributes: {
                exclude: ["id"],
              },
              include: {
                model: Province,
                as: "province",
                attributes: ["code", "name"],
              },
            },
          },
        },
      ],
    });

    return res.status(200).json(orderDetail);
  } catch (error) {
    // console.error(error);
    return res.status(400).json({});
  }
};
const getOrderProgress = async (req, res, next) => {
  try {
    const { orderId } = req.query;
    let whereClause = {
      order_id: orderId,
    };
    if (req.user.role === "client") {
      const { id } = req.user;
      whereClause.user_id = id;
    }
    let result = await Notification.findAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
    });
    res.status(200).send(result);
  } catch (error) {
    next({});
  }
};
// api: tạo 1 đơn hàng (tách nhiều sản phẩm ra mỗi sp 1 đơn)
const postCreateOrder = async (req, res, next) => {
  let order = null;
  try {
    const data = req.body;
    const user_id = req.user.id;
    const {
      deliveryAdd,
      paymentMethod,
      province,
      productList,
      note,
      voucherId,
    } = data;
    let orderList = [];
    let trackingList = [];
    let total = 0;
    if (productList.length === 0) return next({}); // trường hợp dùng postman gửi lên mảng rỗng
    for (let i = 0; i < productList.length; i++) {
      const product = await Book.findByPk(productList[i].bookId, {
        where: {
          status: "active",
          instock: {
            [Op.gt]: 0,
          },
        },
      });
      if (!product) return next({});
      if (product.instock < productList[i].quantity)
        return next({ code: 401, msg: "this product has been out of stock" });
      orderList.push({
        book_id: productList[i].bookId,
        quantity: productList[i].quantity,
        title: product.title,
        img: product.img,
        price: product.price,
        discount: product.enable_discount ? product.discount : 0,
      });
      if (
        productList[i].rcm &&
        productList[i].rcmtype &&
        productList[i].index
      ) {
        trackingList.push({
          recombeeid: productList[i].rcm,
          recommend_type: productList[i].rcmtype,
          index: productList[i].index,
          bookid: productList[i].bookId,
          action: 2,
        });
      }
      total +=
        product.price *
        ((100 - (product.enable_discount ? product.discount : 0)) / 100) *
        productList[i].quantity;
    }
    let status = "1"; //chưa thanh toán
    if (paymentMethod === 1) status = "2"; //paymentMethod === 1 là COD, status = 2 là chờ xac nhan
    let shipping = calculateShippingFee(province, productList.length);
    let voucherDiscount = 0;
    if (voucherId) {
      let voucher = await Voucher.findByPk(voucherId, {
        include: [
          {
            model: amount_discount,
            as: "amount",
            attributes: ["amount"],
          },
          {
            model: Percentage_discount,
            as: "percentage",
            attributes: ["percent"],
          },
        ],
        where: {
          delete: 0,
          end_time: {
            [Op.lte]: new Date(),
          },
          used: {
            [Op.lt]: sequelize.col("quantity"),
          },
        },
      });
      if (voucher) {
        voucherDiscount = discountByVoucher(productList, voucher, total);
      } else {
        return next({ code: 404, msg: "Voucher không hợp lệ" });
      }
    }
    //check shipping address:
    let address = await ShippingAddress.findByPk(deliveryAdd, {
      where: {
        user_id,
      },
    });

    if (!address) next({});
    trackingPurchase(trackingList);
    order = await Order.create({
      user_id,
      payment: paymentMethod,
      voucher: voucherId,
      status,
      address: deliveryAdd,
      total,
      province,
      shipping,
      voucher_discount: voucherDiscount,
    });
    await Order_detail.bulkCreate(
      orderList.map((item) => ({
        order_id: order.id,
        book_id: item.book_id,
        quantity: item.quantity,
        discount: item.discount,
      }))
    );
    if (paymentMethod === 3 || paymentMethod === 2) {
      //stripe card return url
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: "vnd",
              product_data: {
                name: `Tiền sản phẩm`,
              },
              unit_amount: total - voucherDiscount,
            },
            quantity: 1,
          },
        ],
        shipping_options: [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: {
                amount: shipping,
                currency: "vnd",
              },
              display_name: "Thời gian nhận hàng",
              delivery_estimate: {
                minimum: {
                  unit: "business_day",
                  value: 1,
                },
                maximum: {
                  unit: "business_day",
                  value: 5,
                },
              },
            },
          },
        ],
        expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
        mode: "payment",
        metadata: { orderId: order.id },
        success_url,
        cancel_url,
      });
      order.paylink = session.url;
      await order.save();
      return res.status(200).json({ direct: session.url });
    } else {
      //paymentMethod == 1 COD
      let batchRecombee = productList.map((item) => {
        return new rqs.AddPurchase(user_id, item.bookId);
      });
      clientRecombee.send(new rqs.Batch(batchRecombee));
      let ratio = await calculateCancellationRate(order.id, user_id, next);
      await Promise.all([
        Predict_cancellation.create({
          order_id: order.id,
          ratio,
        }),
        Notification.create({
          user_id,
          order_id: order.id,
          text: `Đơn hàng ${order.id} đang chờ xác nhận`,
        }),
      ]);
      return res.status(200).json({});
    }
  } catch (error) {
    // console.log(error)
    if (order) {
      order.destroy().then().catch(next({}));
    }
    return next({});
  }
};
//api webhook stripe payment
const webHookStripeEvent = async (req, res, next) => {
  try {
    const sig = req.headers["stripe-signature"];
    let event;
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.WEBHOOK_SECRET
    ); //https://dashboard.stripe.com/test/webhooks/we_1LBbC3C8xirXWd44i3PZOHlY
    let order_id = event.data.object.metadata.orderId;
    await Order.update(
      { status: "2" }, //1 nghĩa là trạng thái chờ xác nhận
      { where: { id: order_id } }
    );
    let order_details = await Order_detail.findAll({
      where: {
        order_id,
      },
    });
    let batchRecombee = order_details.map((item) => {
      return new rqs.AddPurchase(Order.user_id, item.book_id);
    });
    clientRecombee.send(new rqs.Batch(batchRecombee));
    res.send("OK");
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
};
const userCancelOrder = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const { id } = req.user; //userId
    let order = await Order.findByPk(orderId, {
      where: {
        [Op.or]: [{ status: "1" }, { status: "2" }],
        user_id: id,
      },
    });
    if (order) {
      order.status = "6";
      order.save();
      res.status(200).send("OK");
    } else {
      res.status(404).send("Not found");
    }
  } catch (error) {
    // console.log(error);
    next({});
  }
};
module.exports = {
  getOrderList,
  getOrderDetails,
  postCreateOrder,
  webHookStripeEvent,
  getOrderProgress,
  userCancelOrder,
};
