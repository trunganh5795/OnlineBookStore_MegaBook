const {
  Rating,
  User,
  Order,
  Order_detail,
  sequelize,
  Book,
} = require('../models');
const postComment = async (req, res, next) => {
  try {
    const { orderId, data } = req.body;
    const { user } = req;

    if (user.role !== 'client')
      return next({ code: 401, msg: 'Bạn không có quyền' });
    let order = await Order.findByPk(orderId, {
      where: {
        status: '4',
        isRate: false,
      },
    });
    for (let i = 0; i < data.length; i++) {
      if (!data[i].rate)
        return next({ code: 400, msg: 'Đánh giá không hợp lệ' });
    }
    if (order) {
      let orderDetail = await Order_detail.findAll({
        where: {
          order_id: orderId,
        },
      });
      let ratingBulk = [];
      let bookUpdateBulk = [];
      for (let i = 0; i < data.length; i++) {
        let isExsist = orderDetail.findIndex(
          (ele) => ele.book_id === data[i].bookId
        );
        if (isExsist !== -1) {
          ratingBulk.push({
            value: data[i].rate,
            user_id: user.id,
            book_id: data[i].bookId,
            comment: data[i].comment,
          });

          bookUpdateBulk.push({
            bookId: data[i].bookId,
            stars: sequelize.fn(`${data[i].rate} + `, sequelize.col('stars')),
            comment: sequelize.fn(
              `${data[i].comment ? 1 : 0} + `,
              sequelize.col('comment')
            ),
            total_rate: sequelize.fn(`1 + `, sequelize.col('total_rate')),
          });
        } else {
          return next({ code: 500, msg: 'Xảy ra lỗi vui lòng thử lại' });
        }
      }
      order.set({
        isRate: true,
      });
      // await order.save()

      Promise.all([
        Rating.bulkCreate(ratingBulk),
        order.save(),
        Book.bulkCreate(bookUpdateBulk, {
          updateOnDuplicate: ['stars', 'comment', 'total_rate'],
        }),
      ])
        .then((e) => res.send('success'))
        .catch((err) => {
          next({});
        });
    } else {
      return next({ code: 409, msg: 'Đánh giá không thành công' });
    }
  } catch (error) {
    next({});
  }
};

//Get comment list by book id
const getCommentList = async (req, res, next) => {
  try {
    let { id } = req.query; //book id
    let commentDetail = await Rating.findAll({
      include: {
        model: User,
        as: 'user',
        attributes: ['name', 'img'],
      },
      attributes: ['value', 'comment', 'createdAt'],
      where: {
        book_id: id,
      },
    });
    res.status(200).send(commentDetail);
  } catch (error) {
    next({});
  }
};

module.exports = {
  getCommentList,
  postComment,
};
