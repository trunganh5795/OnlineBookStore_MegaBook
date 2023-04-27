const { Op, QueryTypes } = require("sequelize");
const { Book, sequelize } = require("../models");
const { client } = require("./statistic.controller");

// api: Lấy 1 sản phẩm theo id
const getProduct = async (req, res, next) => {
  try {
    const { id } = req.query;
    // Lấy tổng quan sản phẩm
    const result = await Book.findByPk(+id, {
      attributes: {
        exclude: [
          "sku",
          "title2",
          "desc2",
          "bestbook",
          "createdAt",
          "updatedAt",
        ],
      },
    });
    // Trả về
    return res.status(200).json(result);
  } catch (error) {
    // console.error(error);
    return next({ msg: "Không thể lấy dữ liệu", code: 500 });
  }
};

// api: Lấy tất cả sản phẩm và phân trang
const getAllProducts = async (req, res, next) => {
  try {
    let { page, perPage, filterField, filterValue, sorterField, sorterValue } =
      req.query;
    if (!page) page = 1;
    if (!perPage) perPage = 8;
    // lấy toàn bộ danh sách cho trang admin
    let whereClause = {
      status: "active",
    };
    let sortClause = ["bookId", "ASC"];
    if (filterValue) {
      whereClause[filterField] = filterValue;
    }
    if (sorterField && sorterValue) {
      sortClause = [];
      sortClause.push(sorterField);
      sortClause.push(sorterValue.includes("des") ? "DESC" : "ASC");
    }
    // bỏ cái page = -1 này nè
    if (parseInt(page) === -1) {
      const result = await Book.findAll({
        order: [["bookId", "DESC"]],
      });
      return res.status(200).json({ data: result });
    } else {
      const nSkip = (parseInt(page) - 1) * perPage;
      const result = await Book.findAndCountAll({
        offset: nSkip,
        limit: +perPage,
        where: whereClause,
        order: [sortClause],
        // attributes: ["bookId", "title", "stars", 'author', 'publicOfYear', 'comment', 'img', 'instock', 'price', 'discount']
      });

      return res.status(200).json(result);
    }
  } catch (error) {
    next({});
  }
};

// // api: tìm kiếm sản phẩm trên mysql, ko dùng cái này, chỉ để test
const getSearchProducts = async (req, res, next) => {
  try {
    let { value, page, perPage } = req.query;
    value = value.replace(/\s+/g, "%");
    //'  A B  C   D EF ' ===> #A#B#C#D#EF#
    // pagination
    if (!page) page = 1;
    if (!perPage) perPage = 8;
    const nSkip = (parseInt(page) - 1) * perPage;
    const result = await Book.findAndCountAll({
      offset: nSkip,
      limit: +perPage,
      where: {
        name: sequelize.where(
          sequelize.fn("LOWER", sequelize.col(`Book.title`)),
          { [Op.like]: `%${value.toLowerCase()}%` }
        ),
        status: "active",
      },
    });

    res.status(200).send(result);
  } catch (error) {
    return next({});
  }
};

// api: lọc sản phẩm mới nhất  ( get product by category )
const getAllProductsByType = async (req, res, next) => {
  try {
    let { category, perPage, page, sortType, price_from, price_to } = req.query;
    category = parseInt(category);
    perPage = parseInt(perPage);

    if (category == undefined || !Number.isInteger(category)) category = 0;
    if (!page) page = 1;
    if (!perPage) perPage = 8;
    const nSkip = (parseInt(page) - 1) * perPage;
    let order = [["createdAt", "DESC"]];
    let whereClause = {
      status: "active",
      category: category,
    };
    switch (+sortType) {
      case 1:
        order = [["price", "DESC"]];
        break;
      case 2:
        order = [["price", "ASC"]];
        break;
      case 3:
        order = [["publicOfYear", "DESC"]];
        break;
      case 4:
        sortType = {};
        if (price_to < price_from)
          return next({ code: 400, msg: "Xảy ra lỗi" });
        whereClause.price = {
          [Op.between]: [price_from, price_to],
        };
      default:
        break;
    }

    let products = await Book.findAndCountAll({
      offset: nSkip,
      limit: perPage,
      where: whereClause,
      order: order,
      attributes: [
        "bookid",
        "title",
        "stars",
        "author",
        "publicOfYear",
        "comment",
        "img",
        "instock",
        "price",
        "discount",
        "enable_discount",
        "start_time",
        "end_time",
        "total_rate",
      ],
    });

    if (products) {
      return res.status(200).json(products);
    } else {
      return res.status(200).json({ count: 0, rows: [] });
    }
  } catch (error) {
    return next({});
  }
};
// api :  Loc
const getRecommendProducts = async (req, res, next) => {
  try {
    let query = req.body;
    let idList = [];
    for (let item of query) {
      idList.push(item.id);
    }
    let result = await Book.findAll({
      where: {
        [Op.or]: [{ bookId: idList }],
      },
      attributes: {
        exclude: [
          "QRcodeImg",
          "category",
          "width",
          "height",
          "comment",
          "createdAt",
          "updatedAt",
          "bookId",
        ],
        //Lấy tất cả ngoại trừ các thuộc tính
      },
      order: [sequelize.literal(`field(bookid,${idList});`)],
      //Order theo bookid theo thứ tự trong idList
    });
    res.status(200).send(result);
  } catch (error) {
    return next({});
  }
};
// get top sell for all
const getTopSell = async (req, res, next) => {
  try {
    let result = await sequelize.query(
      "select `bookId` as `BookId`,`title`,`price`,`instock`,`stars`,`img`,`discount`, top_sell.sold as `sold` from books as b INNER JOIN ( select `book_id`, sum(`quantity`) as `sold` from order_details group by book_id order by sum(`quantity`) desc limit 10) as top_sell on b.bookId = top_sell.book_id where `status` = 'active';",
      { type: QueryTypes.SELECT }
    );
    // thêm { type: QueryTypes.SELECT } để result được bọc trong 1 mảng , nếu ko có nó sẽ là mảng trong mảng
    // thêm { type: QueryTypes.SELECT } nó sẽ lấy dữ liệu cần ra thôi, ko lấy các dữ liệu dư thừa khác (metadata)
    res.status(200).send(result);
  } catch (error) {
    return next({});
  }
};
//get top sell by category
const getTopSellByCategory = async (req, res, next) => {
  const { type } = req.params;
  try {
    let result = await sequelize.query(
      "select `bookId` as `BookId`,`title`,`price`,`instock`,`stars`,`img`,`discount`, top_sell.total_sell as `sold` from books INNER JOIN ( select `book_id`, sum(`quantity`) as total_sell from order_details group by book_id) as top_sell on books.bookId = top_sell.book_id where `status` = 'active' and `category`=:category order by total_sell desc;",
      {
        replacements: { category: type },
        type: QueryTypes.SELECT,
      }
    );

    res.status(200).send(result);
  } catch (error) {
    return next({});
  }
};
// Api: Tìm kiếm sản phẩm client trên server Elastic
const getProductByNameElk = async (req, res, next) => {
  try {
    let { value, page, perPage, sortType, price_from, price_to } = req.query;
    if (!page) page = 1;
    if (!perPage) perPage = 2;
    let priceRange = {};
    switch (+sortType) {
      case 1:
        sortType = {
          price: {
            order: "desc",
          },
        };
        break;
      case 2:
        sortType = {
          price: {
            order: "asc",
          },
        };
        break;
      case 3:
        sortType = {
          publicOfYear: {
            order: "desc",
          },
        };
        break;
      case 4:
        sortType = {};
        priceRange = {
          gte: price_from,
          lte: price_to,
        };
        break;
      default:
        sortType = {};
        priceRange = {};
        break;
    }

    const result = await client.search({
      //Dùng client.helpers.search thay vì dùng client.search vì , client.helpers.search chỉ lấy data cần thiết không bao gồm các meta data ==> giảm bớt dung lượng response ==> cải thiện hiệu xuất
      index: "books",
      from: (+page - 1) * +perPage,
      size: +perPage,
      body: {
        query: {
          bool: {
            must: [
              {
                multi_match: {
                  query: value,
                  slop: 2, // số lần dịch chuyển từ ngữ trong cụm từ tìm kiếm để match với kết quả
                  fields: ["title^4", "author^3", "desc2^2", "description"],
                  type: "phrase",
                },
              },
              {
                match: {
                  status: "active",
                },
              },
              {
                range: {
                  instock: {
                    gt: 0,
                  },
                },
              },
              {
                range: {
                  price: priceRange,
                },
              },
            ],
          },
        },
        _source: {
          exclude: ["desc2", "title2", "createdAt", "updatedAt"],
        },
        sort: [sortType],
        aggs: {
          count: {
            value_count: {
              field: "bookId",
            },
          },
        },
      },
    });

    let data = result.body.hits.hits.map((item) => item._source);
    res.status(200).send({ data, count: result.body.aggregations.count.value });
  } catch (error) {
    next({});
  }
};
const getBestBook = async (req, res, next) => {
  try {
    let data = await Book.findOne({
      where: {
        bestbook: true,
      },
      attributes: [
        "bookId",
        "title",
        "author",
        "img",
        "category",
        "price",
        "desc2",
        "discount",
        "start_time",
        "end_time",
        "enable_discount",
        "instock",
      ],
    });
    res.status(200).send(data);
  } catch (error) {
    next({});
  }
};

const countNumOfSellById = async (req, res, next) => {
  try {
    const { id } = req.query;
    let data = await client.search({
      index: "order_details",
      body: {
        query: {
          match: {
            book_id: {
              query: id,
            },
          },
        },
        aggs: {
          total: {
            sum: {
              field: "quantity",
            },
          },
        },
      },
    });
    res.status(200).send(data.body.aggregations.total);
  } catch (error) {
    next({});
  }
};
module.exports = {
  getProduct,
  getAllProducts,
  getSearchProducts,
  getAllProductsByType,
  getRecommendProducts,
  getTopSell,
  getTopSellByCategory,
  getProductByNameElk,
  getBestBook,
  countNumOfSellById,
};
