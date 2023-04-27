const {
  Order,
  User,
  Predict_cancellation,
  Notification,
  sequelize,
} = require('../models');
const { Op } = require('sequelize');
const countOrderByStatus = async (req, res, next) => {
  try {
    let { start_date, end_date } = req.query;

    let data = await Order.findAll({
      group: 'status',
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('status')), 'total'],
      ],
      where: {
        [Op.and]: [
          {
            createdAt: {
              [Op.gte]: start_date,
            },
          },
          {
            createdAt: {
              [Op.lte]: end_date,
            },
          },
        ],
      },
    });
    res.status(200).send(data);
  } catch (error) {
    // console.log(error)
    next({});
  }
};
//get order by status
const getOrderList = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin')
      return next({
        msg: 'Unauthorized.',
        code: 401,
      });
    let {
      start_date,
      end_date,
      paymentType,
      status,
      page,
      perPage,
      filters,
      search,
      option,
    } = req.query;
    option = +option;
    if (!page) page = 1;
    if (!perPage) perPage = 8;
    const nSkip = (parseInt(page) - 1) * perPage;
    let whereClause = {};
    let whereUserClause = {}; //tim theo ten user
    whereClause = {
      [Op.and]: [
        {
          createdAt: {
            [Op.gte]: start_date,
          },
        },
        {
          createdAt: {
            [Op.lte]: end_date,
          },
        },
      ],
    };
    if (filters) {
      if (Array.isArray(filters)) {
        whereClause.payment = {
          [Op.in]: filters,
        };
      } else {
        whereClause.payment = filters;
      }
    }
    if (+status) whereClause.status = status;
    if (paymentType) {
      whereClause.payment = paymentType;
    }
    if (option) {
      search = search.replace(/\s+/g, '%');
      if (option === 1) {
        whereUserClause.name = sequelize.where(
          sequelize.fn('LOWER', sequelize.col(`name`)),
          { [Op.like]: `%${search.toLowerCase()}%` }
        );
      } else {
        whereClause.id = search;
      }
    }
    const list = await Order.findAndCountAll({
      offset: nSkip,
      limit: +perPage,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name'],
          where: whereUserClause,
        },
        {
          model: Predict_cancellation,
          as: 'ratio',
        },
      ],
      where: whereClause,
      order: [['createdAt', 'DESC']],
    });
    return res.status(200).json(list);
  } catch (error) {
    console.log(error);
    next({});
  }
};

const comfirmOrderBulk = async (req, res, next) => {
  try {
    let { ids } = req.body;
    let orderData = await Order.findAll({
      attributes: ['user_id', 'id'],
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });

    let notificationList = [];
    for (let order of orderData) {
      notificationList.push({
        user_id: order.user_id,
        text: `Đơn hàng ${order.id} đã xác nhận`,
        order_id: order.id,
      });
    }

    // Use transaction instead ==> :)
    Promise.all([
      Order.update(
        {
          status: 3,
        },
        {
          where: {
            id: {
              [Op.in]: ids,
            },
          },
        }
      ),
      Notification.bulkCreate(notificationList),
    ])
      .then(() => res.status(200).send('OK'))
      .catch(() => next({}));
  } catch (error) {
    // console.log(error);
    next({});
  }
};
module.exports = {
  countOrderByStatus,
  getOrderList,
  comfirmOrderBulk,
};
