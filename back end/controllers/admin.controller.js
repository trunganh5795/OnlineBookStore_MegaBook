const {
  Notification,
  Predict_cancellation,
  Book,
  sequelize,
  Order,
  User,
  Voucher,
  Percentage_discount,
  amount_discount,
} = require('../models');
const axios = require('axios').default;
const QRCode = require('qrcode');
const { Op, QueryTypes } = require('sequelize');
const { cloudinary } = require('../config/cloudinary.config');
const io = require('../config/socket.io.config');
const {
  findSocketIdInConnectedUserList,
  removeVietnameseTones,
} = require('../helpers');
const { status } = require('../config/constrant');
const { client } = require('./statistic.controller');
const bcrypt = require('bcryptjs');
const jwtConfig = require('../config/jwt.config');
const constrants = require('../constrants');
const { rqs, clientRecombee } = require('../config/recombee.config');
// fn: upload product avatar to cloudinary
const uploadProductAvt = async (title, avtFile, folder = '/products') => {
  try {
    title = title.replace(' ', '-');
    const result = await cloudinary.uploader.upload(avtFile, {
      public_id: `${title}-${new Date().getTime()}`,
      folder,
    });
    const { secure_url } = result;
    return secure_url;
  } catch (error) {
    throw error;
  }
};
const uploadQrCodeIamge = async (title, fileBase64) => {
  try {
    title = title.replace(' ', '-');
    const result = await cloudinary.uploader.upload(fileBase64, {
      public_id: `${title}-qrcode-${new Date().getTime()}`,
      folder: '/qrcode',
    });
    const { secure_url } = result;
    return secure_url;
  } catch (error) {
    throw error;
  }
};
const genQrCode = async (qrCodeURL) => {
  return QRCode.toDataURL(qrCodeURL, {
    errorCorrectionLevel: 'H',
    version: 5,
    mode: 'alphanumeric',
  });
};

const adminLogin = async (req, res, next) => {
  try {
    const { userName, password } = req.body;
    if (!(userName && password)) return next({ code: 400, msg: 'Bad request' });
    let userDetail = await User.findOne({
      where: { email: userName, active: 'active', role: 'admin' },
    });
    if (userDetail) {
      let isMatchPassword = bcrypt.compareSync(
        password.toString(),
        userDetail.password
      );
      if (!isMatchPassword) {
        return next({ code: 401, msg: 'Email hoặc mật khẩu không đúng' });
      }
      //tạo access token
      let token = jwtConfig.encodedToken(process.env.JWT_SECRET_KEY, {
        email: userDetail.email,
        id: userDetail.id,
      });

      const expiresIn = new Date(Date.now() + constrants.COOKIE_EXPIRES_TIME);
      // ! gửi token lưu vào cookie và chỉ đọc

      res.cookie('access_token', token, {
        httpOnly: true,
        expires: expiresIn,
      });
      return res.status(200).json({ name: userDetail.name });
      // }
    } else {
      return next({ code: 401, msg: 'Email hoặc mật khẩu không đúng' });
    }
  } catch (error) {
    return next({});
  }
};
// api: Thêm sản phẩm
const addProduct = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin')
      return next({
        msg: 'Unauthorized.',
        code: 401,
      });
    const {
      category,
      sku,
      title,
      price,
      instock,
      // description,
      author,
      publisher,
      avatar,
      width,
      height,
      publicOfYear,
      desc,
    } = req.body.product;
    if (!(avatar && title && price && instock && width && height))
      return next({ code: 400, msg: 'Bad request' });
    const avtUrl = await uploadProductAvt(title, avatar);

    // Tạo sản phẩm mới
    const newProduct = await Book.create({
      category,
      sku,
      title,
      price,
      instock: +instock,
      // description,
      author,
      publisher,
      img: avtUrl,
      width,
      height,
      publicOfYear,
      QRcodeImg: 'http://localhost:7000/non', // nhập đại URL nào đó vì ko cho null , xuống dưới tạo mã QR rồi update lại sau
      description: desc,
    });

    clientRecombee.send(
      new rqs.SetItemValues(
        newProduct.bookId,
        {
          bookId: newProduct.bookId,
          author,
          publisher,
          category,
          description: desc,
          publicOfYear,
          instock: +instock,
          discount: 0,
          price,
          status: 'active',
          stars: 0,
          title,
          comment: 0,
        },
        {
          cascadeCreate: true,
        }
      )
    );

    let qrCodeURL = process.env.FONT_END_PUBLIC_URL
      ? process.env.FONT_END_PUBLIC_URL + `/qrcode/${newProduct.BookId}`
      : `http://localhost:3000/qrcode/${newProduct.BookId}`;
    let base64QRcode = await genQrCode(qrCodeURL);
    let qrCodeImageURL = await uploadQrCodeIamge(
      newProduct.title,
      base64QRcode
    );

    newProduct.QRcodeImg = qrCodeImageURL;
    await newProduct.save();

    res.status(200).send('OK');
  } catch (error) {
    return next({});
  }
};

// api: Cập nhật sản phẩm ==> dùng cho trang cập nhật, và qr code
const updateProduct = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin')
      return next({
        msg: 'Unauthorized.',
        code: 401,
      });
    const product = req.body;
    const { bookId, discount, time, ...rest } = product;
    const book = await Book.findByPk(+bookId);
    if (!rest.avatar) {
      book.set({
        ...rest,
        img: book.img,
        start_time: time[0],
        end_time: time[1],
      });
    } else {
      const avtUrl = await uploadProductAvt(rest.title, rest.avatar);
      book.set({
        ...rest,
        img: avtUrl,
        start_time: time[0],
        end_time: time[1],
      });
    }

    await book.save();
    return res.status(200).json({ message: 'Cập nhật thành công' });
  } catch (error) {
    return res.status(500).json({ message: 'Xảy ra lỗi' });
  }
};

// Api lấy thuộc tính người dùng theo thuộc tính : tất cả, tên , sdt, mã khác hàng
const getCustomerListByValue = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin')
      return next({
        msg: 'Unauthorized.',
        code: 401,
      });
    let { page, perPage, option, value, filterStatus, filterRole } = req.query;

    if (!page) page = 1;
    if (!perPage) perPage = 10;
    const nSkip = (parseInt(page) - 1) * perPage;
    value = value.replace(/\s+/g, '%');
    let whereClause = {};
    option = +option; // parse to Intefer
    if (option === 0) {
      option = null;
    } else if (option === 1) {
      option = 'name';
    } else if (option === 2) {
      option = 'phone_no';
    } else if (option === 3) {
      option = 'id';
    } else if (option === 4) {
      option = 'email';
    }

    if (option)
      whereClause[option] = sequelize.where(
        sequelize.fn('LOWER', sequelize.col(`User.${option}`)),
        { [Op.like]: `%${value.toLowerCase()}%` }
      );
    if (filterRole) whereClause.role = filterRole;
    if (filterStatus) whereClause.active = filterStatus;
    let result = await User.findAndCountAll({
      offset: nSkip,
      limit: +perPage,
      where: whereClause,
    });

    res.status(200).send(result);
  } catch (error) {
    next({});
  }
};
// // api: khoá 1 người dùng
const delCustomer = async (req, res, next) => {
  try {
    const { userId } = req.query;
    const customer = await User.findByPk(userId);
    if (customer) {
      await customer.update({
        active: 'block',
      });
      return res.status(200).send('OK');
    } else {
      next({});
    }
  } catch (error) {
    next({});
  }
};
const releaseCustomer = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const customer = await User.findByPk(userId);
    if (customer) {
      await customer.update({
        active: 'active',
      });
      return res.status(200).send('OK');
    } else {
      next({});
    }
  } catch (error) {
    next({});
  }
};

// api: lấy danh sách đơn hàng
const getOrderList = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin')
      return next({
        msg: 'Unauthorized.',
        code: 401,
      });
    let {
      page,
      perPage,
      filterStatusValue,
      filterPaymentValue,
      sorterField,
      sorterValue,
    } = req.query;
    if (!page) page = 1;
    if (!perPage) perPage = 8;
    const nSkip = (parseInt(page) - 1) * perPage;
    let whereClause = {};
    let sorter = [];
    if (filterStatusValue) whereClause.status = filterStatusValue;
    if (filterPaymentValue) whereClause.payment = filterPaymentValue;
    if (sorterField && sorterValue) {
      sorter.push([sorterField, sorterValue.includes('des') ? 'DESC' : 'ASC']);
    } else {
      sorter = [['createdAt', 'DESC']];
    }

    const list = await Order.findAndCountAll({
      offset: nSkip,
      limit: +perPage,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
        {
          model: Predict_cancellation,
          as: 'ratio',
          // attributes: ['name']
        },
      ],
      where: whereClause,
      order: sorter,
    });
    return res.status(200).json(list);
  } catch (error) {
    return res.status(401).json({});
  }
};
// // api: cập nhật trạng thái đơn hàng
const postUpdateOrderStatus = async (req, res, next) => {
  try {
    // if (req.user.role !== 'admin' || req.user.role !== 'staff') return next({
    //   msg: 'Unauthorized.',
    //   code: 401,
    // });
    const { id, orderStatus } = req.body;
    let order = await Order.findByPk(id);
    let msg = `Đơn hàng ${order.id} ${status[orderStatus - 1]}`;
    if (order) {
      Promise.all([
        Notification.create({
          user_id: order.user_id,
          text: msg,
          order_id: id,
        }),
        order.update({ ...order, status: orderStatus }),
      ])
        .then(() => {
          let socketId = findSocketIdInConnectedUserList(
            io.connectedUser,
            order.user_id
          );
          io.getIO().to(socketId).emit('test', { id: order.id, msg });
          return res.status(200).json({});
        })
        .catch((error) => {
          next({});
        });
    } else {
      next({ code: 404, msg: 'Không tìm thấy đơn hàng' });
    }
  } catch (error) {
    // console.log(error)
    next({});
  }
};
//Api : Lấy chi tiết sản phẩm theo Id, lấy đầy đủ chi tiết hơn so với API product
const getProductDetailsByAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin')
      return next({
        msg: 'Unauthorized.',
        code: 401,
      });
    const { id } = req.query;
    const result = await Book.findByPk(+id);
    // Trả về
    if (result) {
      return res.status(200).json(result);
    } else {
      next({ code: 404, msg: 'Không tìm thấy sản phẩm' });
    }
  } catch (error) {
    return res.status(400).json({ message: 'Không thể lấy dữ liệu' });
  }
};
const getOrderListByValue = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin')
      return next({
        msg: 'Unauthorized.',
        code: 401,
      });
    let {
      value,
      option,
      page,
      perPage,
      filterStatusValue,
      filterPaymentValue,
      sorterField,
      sorterValue,
    } = req.query;
    if (!page) page = 1;
    if (!perPage) perPage = 8;
    const nSkip = (parseInt(page) - 1) * perPage;

    //0 là tìm tất cả
    value = value.replace(/\s+/g, '%');
    //'  A B  C   D EF ' ===> %A%B%C%D%EF%
    let whereClause = {};
    let sorter = [];
    if (filterStatusValue) whereClause.status = filterStatusValue;
    if (filterPaymentValue) whereClause.payment = filterPaymentValue;
    if (sorterField && sorterValue) {
      sorter.push([sorterField, sorterValue.includes('des') ? 'DESC' : 'ASC']);
    } else {
      sorter = [['createdAt', 'DESC']];
    }
    if (+option === 0) return getOrderList(req, res, next);
    else if (+option === 1) {
      // 1 là tìm theo tên khách hàng
      let result = await Order.findAndCountAll({
        offset: nSkip,
        limit: +perPage,
        where: whereClause,
        include: {
          model: User,
          where: {
            name: sequelize.where(
              sequelize.fn('LOWER', sequelize.col(`name`)),
              { [Op.like]: `%${value.toLowerCase()}%` }
            ),
          },
          attributes: ['name'],
          as: 'user',
        },
        order: sorter,
      });
      return res.status(200).send(result);
    } else {
      whereClause.id = +value;
      let result = await Order.findAndCountAll({
        offset: nSkip,
        limit: +perPage,
        where: whereClause,
        include: {
          model: User,
          attributes: ['name'],
          as: 'user',
        },
        order: sorter,
      });
      return res.status(200).send(result);
    }
  } catch (error) {
    next({});
  }
};
const addNewVoucher = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin')
      return next({
        msg: 'Unauthorized.',
        code: 401,
      });
    const { code, apply, value, minSpend, total, time, type } = req.body.data;
    let existCode = await Voucher.findOne({
      where: {
        code,
        // delete: 0,
        // end_time: {
        //   [Op.lt]: new Date()
        // }
      },
    });
    if (existCode) return res.status(409).send('Mã giảm giá đã có');
    let voucher = await Voucher.create({
      code: code.toUpperCase(),
      apply,
      quantity: total,
      start_time: time[0],
      end_time: time[1],
      minSpend,
    });

    if (type === 1) {
      await Percentage_discount.create({
        id: voucher.id,
        percent: value,
      });
    } else if (type == 2) {
      await amount_discount.create({
        id: voucher.id,
        amount: value,
      });
    }
    res.status(200).send('OK');
  } catch (error) {
    next({});
  }
};
const getAllVouchers = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin')
      return next({
        msg: 'Unauthorized.',
        code: 401,
      });
    let { page, perPage, stateFilterValue } = req.query;
    if (!page) page = 1;
    if (!perPage) perPage = 8;
    const nSkip = (parseInt(page) - 1) * perPage;
    let whereClause = { delete: 0 };
    if (stateFilterValue) {
      if (stateFilterValue === 1) {
        //voucher đang diễn ra
        whereClause.start_time = {
          [Op.lte]: new Date(),
        };
        whereClause.end_time = {
          [Op.gte]: new Date(),
        };
      } else if (stateFilterValue === 2) {
        //voucher sắp diễn ra
        whereClause.start_time = {
          [Op.gte]: new Date(),
        };
        whereClause.end_time = {
          [Op.gte]: new Date(),
        };
      } else {
        //=3 voucher đã kết thúc
        whereClause.start_time = {
          [Op.lte]: new Date(),
        };
        whereClause.end_time = {
          [Op.lte]: new Date(),
        };
      }
    }

    let voucherList = await Voucher.findAndCountAll({
      offset: nSkip,
      limit: +perPage,
      include: [
        {
          model: amount_discount,
          as: 'amount',
          attributes: ['amount'],
        },
        {
          model: Percentage_discount,
          as: 'percentage',
          attributes: ['percent'],
        },
      ],
      order: [['createdAt', 'DESC']],
      where: whereClause,
    });

    res.status(200).send(voucherList);
  } catch (error) {
    next({});
  }
};
const deleteVoucher = async (req, res, next) => {
  if (req.user.role !== 'admin')
    return next({
      msg: 'Unauthorized.',
      code: 401,
    });
  let code = req.query.code;
  try {
    await Voucher.update({ delete: 1 }, { where: { code } });
    res.status(200).send('OK');
  } catch (error) {
    next({});
  }
};
const updateVoucherDetails = async (req, res, next) => {
  // chỉ đc update số lượng và thời gian kết thúc, thời gian bắt đầu
  try {
    if (req.user.role !== 'admin')
      return next({
        msg: 'Unauthorized.',
        code: 401,
      });
    const { data } = req.body;
    let voucher = await Voucher.findByPk(data.id, {
      where: {
        delete: 0,
      },
    });
    if (voucher) {
      if (voucher.used > data.quantity) {
        next({ code: 500, msg: 'invalid value' });
      } else {
        await voucher.update({
          quantity: data.quantity,
          start_time: data.time[0],
          end_time: data.time[1],
          minSpend: data.minSpend,
        });
        res.status(200).send({});
      }
    } else {
      next({ code: 404, msg: 'not found' });
    }
  } catch (error) {
    next({});
  }
};

const getVoucherByCategory = async (req, res, next) => {
  try {
    let voucherType = req.query.categories.map((item) => {
      if (!item) return null;
      return parseInt(item);
    });

    let voucherList = await Voucher.findAndCountAll({
      include: [
        {
          model: amount_discount,
          as: 'amount',
          attributes: ['amount'],
        },
        {
          model: Percentage_discount,
          as: 'percentage',
          attributes: ['percent'],
        },
      ],
      order: [['createdAt', 'DESC']],
      where: {
        delete: 0,
        apply: {
          //thuộc tính apply là null or 1
          [Op.or]: voucherType,
        },
      },
    });
    res.status(200).send(voucherList);
  } catch (error) {
    next({});
  }
};
const getVoucherListByValue = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin')
      return next({
        msg: 'Unauthorized.',
        code: 401,
      });
    let { value, option, stateFilterValue } = req.query;
    if (+option === 0) return getAllVouchers(req, res, next);
    else if (+option === 1) {
      let whereClause = {
        code: value,
        delete: 0,
      };
      if (stateFilterValue) {
        if (stateFilterValue === 1) {
          //voucher đang diễn ra
          whereClause.start_time = {
            [Op.lte]: new Date(),
          };
          whereClause.end_time = {
            [Op.gte]: new Date(),
          };
        } else if (stateFilterValue === 2) {
          //voucher sắp diễn ra
          whereClause.start_time = {
            [Op.gte]: new Date(),
          };
          whereClause.end_time = {
            [Op.gte]: new Date(),
          };
        } else {
          //=3 voucher đã kết thúc
          whereClause.start_time = {
            [Op.lte]: new Date(),
          };
          whereClause.end_time = {
            [Op.lte]: new Date(),
          };
        }
      }
      // tìm bởi giá trị code
      let voucherList = await Voucher.findAndCountAll({
        include: [
          {
            model: amount_discount,
            as: 'amount',
            attributes: ['amount'],
          },
          {
            model: Percentage_discount,
            as: 'percentage',
            attributes: ['percent'],
          },
        ],
        order: [['createdAt', 'DESC']],
        where: whereClause,
      });

      return res.status(200).send(voucherList);
    } else {
      return next({});
    }
  } catch (error) {
    return next({});
  }
};
const adminSearchProduct = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin')
      return next({
        msg: 'Unauthorized.',
        code: 401,
      });
    let {
      value,
      page,
      perPage,
      option,
      filterField,
      filterValue,
      sorterField,
      sorterValue,
    } = req.query;
    if (!page) page = 1;
    if (!perPage) perPage = 10;
    let query = {
      //Dùng client.helpers.search thay vì dùng client.search vì , client.helpers.search chỉ lấy data cần thiết không bao gồm các meta data ==> giảm bớt dung lượng response ==> cải thiện hiệu xuất
      index: 'books',
      from: (page - 1) * perPage,
      size: perPage,
      body: {
        query: {
          bool: {
            must: [
              {
                multi_match: {
                  query: value,
                  slop: 2,
                  fields: ['title^3', 'author^2', 'description'],
                  type: 'phrase',
                },
              },
            ],
          },
        },
        _source: [
          'bookId',
          'title',
          'category',
          'price',
          'instock',
          'img',
          'author',
          'width',
          'height',
          'QRcodeImg',
          'publicOfYear',
          'publisher',
        ],
        aggs: {
          count: {
            value_count: {
              field: 'bookId',
            },
          },
        },
      },
    };
    if (filterValue && filterField) {
      if (typeof filterValue === 'string') {
        query.body.query.bool.filter = [
          {
            term: {
              [filterField]: filterValue,
            },
          },
        ];
      } else {
        query.body.query.bool.filter = [
          {
            terms: {
              [filterField]: filterValue,
            },
          },
        ];
      }
    }
    if (sorterValue && sorterField) {
      query.body.sort = [
        {
          [sorterField]: {
            order: sorterValue.includes('des') ? 'DESC' : 'ASC',
          },
        },
      ];
    }
    const result = await client.search(query);

    res.status(200).send({
      count: result.body.aggregations.count.value,
      rows: result.body.hits.hits,
    });
  } catch (error) {
    next({});
  }
};
const calculateCancellationRate = async (orderid, userid, next) => {
  try {
    let rate = await client.helpers.search({
      index: 'orders',
      body: {
        query: {
          bool: {
            must: [
              {
                match: {
                  payment: 1,
                },
              },
              {
                match: {
                  user_id: userid,
                },
              },
            ],
            filter: {
              bool: {
                should: [
                  {
                    terms: {
                      status: [5, 6],
                    },
                  },
                ],
              },
            },
          },
        },
        _source: ['id', 'status', 'shipping', 'total'],
      },
    });

    let ratio = 0;
    if (rate.length) {
      ratio =
        rate.reduce(
          (count, item, index) => (item.status === '5' ? count + 1 : count),
          0
        ) / rate.length;
    }
    let order = await sequelize.query(
      'select total,shipping,voucher,sum(quantity) as quantity  from book_store.orders left join book_store.order_details on orders.id = order_details.order_id where id = $id;',
      {
        type: QueryTypes.SELECT,
        bind: {
          id: orderid,
        },
        // raw: false,
        // plain: false,
        // nest:false
      }
    );
    if (order[0].quantity) {
      let predict = await axios
        .get('http://localhost:5000/getratio', {
          params: {
            totalOrder: rate.length,
            ratio,
            total: order[0].total,
            shipping: order[0].shipping,
            voucher: order[0].voucher ? order[0].voucher : 0,
            quantity: +order[0].quantity,
            note: order[0].note ? order[0].note : 0,
          },
        })
        .then((result) => result.data.ratio);
      return predict;
    } else {
      throw new Error();
    }
  } catch (error) {
    throw new Error();
  }
};
const updateNumOfContact = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin')
      return next({
        msg: 'Unauthorized.',
        code: 401,
      });
    const { orderId } = req.body;
    await Predict_cancellation.increment(
      { contact_time: 1 },
      { where: { order_id: orderId } }
    );
    res.status(200).send('Cập nhật thành công');
  } catch (error) {
    next({});
  }
};
const getRecombeeToken = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin')
      return next({
        msg: 'Unauthorized.',
        code: 401,
      });
    let token = await client.helpers.search({
      index: 'recombeetoken',
      body: {
        query: {
          match_all: {},
        },
      },
    });
    res.status(200).send({ token: token[0].token });
  } catch (error) {
    next({});
  }
};

module.exports = {
  adminSearchProduct,
  addProduct,
  updateProduct,
  getCustomerListByValue,
  getOrderList,
  postUpdateOrderStatus,
  getProductDetailsByAdmin,
  getOrderListByValue,
  addNewVoucher,
  getAllVouchers,
  getVoucherListByValue,
  deleteVoucher,
  updateVoucherDetails,
  getVoucherByCategory,
  calculateCancellationRate,
  updateNumOfContact,
  getRecombeeToken,
  // updateTest,
  uploadProductAvt,
  adminLogin,
  delCustomer,
  releaseCustomer,
};
