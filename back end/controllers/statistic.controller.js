var { Client } = require("@elastic/elasticsearch");
var AWS = require("aws-sdk");
const createAwsElasticsearchConnector = require("aws-elasticsearch-connector");
const { Order_detail, sequelize, Book, Order } = require("../models");
const { QueryTypes, Op } = require("sequelize");
const { getTimeRange } = require("../helpers");

const awsConfig = new AWS.Config({
  accessKeyId: process.env.ELASTIC_AWS_ACCESS_KEY,
  secretAccessKey: process.env.ELASTIC_AWS_SECRET_KEY,
  region: "ap-southeast-1",
});
let client = new Client({
  ...createAwsElasticsearchConnector(awsConfig),
  node: process.env.ELASTIC_AWS_END_POINT,
});

// Dùng vẽ dash board
const countOrderAndTotal = async (req, res, next) => {
  try {
    if (req.user.role !== "admin")
      return next({ msg: "Bạn không có quyền truy cập", code: 401 });
    let { start_date, end_date } = req.query;
    // console.log(":::::::::::::", start_date, end_date);
    const result = await client.search({
      index: "orders",
      filterPath: "aggregations.group_by",
      body: {
        query: {
          bool: {
            must: [
              {
                range: {
                  createdAt: {
                    gte: start_date, //greater than equal
                    lte: end_date, //less than equal`
                    // gte: 'now-365d/d', //greater than equal
                    // lte: 'now/d'  //less than equal`
                  },
                },
              },
            ],
          },
        },
        aggs: {
          group_by: {
            date_histogram: {
              field: "createdAt",
              interval: "day", //year month week
            },
            aggs: {
              total_count: {
                value_count: {
                  field: "id",
                },
              },
              total_income: {
                sum: {
                  field: "total",
                },
              },
            },
          },
        },
      },
    });
    // console.log(result.body.aggregations.group_by)
    if (!result.body.aggregations) return res.status(200).send([]);
    //
    res.status(200).send(result.body.aggregations.group_by);
  } catch (error) {
    next({});
  }
};
// vẽ pie chart
const countRate = async (req, res, next) => {
  try {
    if (req.user.role !== "admin")
      return next({ msg: "Bạn không có quyền truy cập", code: 401 });
    let { start_time, end_time } = req.query;
    const result = await client.search({
      index: "ratings",
      filter_path: "aggregations.group_by_value.buckets",
      body: {
        query: {
          range: {
            createdAt: {
              gte: start_time, //greater than equal
              lte: end_time,
            },
          },
        },
        aggs: {
          group_by_value: {
            terms: {
              field: "value",
              order: {
                _key: "desc",
              },
            },
            aggs: {
              count_order: {
                value_count: {
                  field: "value",
                },
              },
            },
          },
        },
      },
    });
    res.status(200).send(result.body.aggregations.group_by_value.buckets);
  } catch (error) {
    next({});
  }
};
const getLatestOrder = async (req, res, next) => {
  try {
    if (req.user.role !== "admin")
      return next({ msg: "Bạn không có quyền truy cập", code: 401 });
    let { page, perPage } = req.query;
    if (!page) page = 1;
    if (!perPage) perPage = 2;

    const result = await client.search({
      index: "orders",
      // _source: false, // ko lấy data source , cái xài chỉ khi cần tổng hợp số liệu ko cần data source
      // refer : https://www.elastic.co/guide/en/elasticsearch/reference/current/search-fields.html#source-filtering
      filterPath: "hits.hits._source",
      body: {
        from: (page - 1) * perPage,
        size: perPage,
        query: {
          match_all: {},
        },
        _source: ["id", "userid", "total", "createdAt"],
        sort: [
          {
            createdAt: {
              order: "desc",
            },
          },
        ],
      },
    });

    if (!result.body.hits) return res.status(200).send([]);
    //
    res.status(200).send(result.body.hits.hits);
  } catch (error) {
    next({});
  }
};
const histogramOrder = async (req, res, next) => {
  try {
    if (req.user.role !== "admin")
      return next({ msg: "Bạn không có quyền truy cập", code: 401 });
    let { start_date, end_date } = req.query;
    const result = await client.search({
      index: "orders",
      filterPath: "aggregations.price_ranges",
      body: {
        query: {
          range: {
            createdAt: {
              gte: start_date, //greater than equal
              lte: end_date, //less than equal`
              // gte: 'now-365d/d', //greater than equal
              // lte: 'now/d'  //less than equal`
            },
          },
        },
        aggs: {
          price_ranges: {
            range: {
              field: "total",
              ranges: [
                { to: 100000.0 }, // 0 tới nhỏ hơn 100
                { from: 100000.0, to: 200000.0 }, //từ 100000 tới nhỏ hơn 200000
                { from: 200000.0, to: 300000.0 }, //từ 200000 tới nhỏ hơn 200000
                { from: 300000.0, to: 400000.0 }, //từ 300000 tới nhỏ hơn 200000
                { from: 400000.0, to: 500000.0 }, //từ 400000 tới nhỏ hơn 200000
                { from: 500000.0, to: 600000.0 }, //từ 500000 tới nhỏ hơn 200000
                { from: 600000.0, to: 700000.0 },
                { from: 700000.0, to: 800000.0 },
                { from: 800000.0, to: 900000.0 },
                { from: 900000.0, to: 1000000.0 },
                { from: 1000000.0 },
              ],
            },
          },
        },
      },
    });
    if (!result.body.aggregations) return res.status(200).send([]);
    res.status(200).send(result.body.aggregations.price_ranges);
  } catch (error) {
    next({});
  }
};
//Đến số lượng bán ra của 1 sản phẩm trong khoảng thời gian (nhóm theo từng ngày)
const countTotalSellById = async (req, res, next) => {
  try {
    if (req.user.role !== "admin")
      return next({ msg: "Bạn không có quyền truy cập", code: 401 });
    let { start_date, end_date, productId } = req.query;
    const result = await client.search({
      index: "order_details",
      filter_path: "aggregations.group_by.buckets",
      _source: false,
      body: {
        query: {
          bool: {
            must: [
              {
                term: {
                  book_id: productId,
                },
              },
              {
                range: {
                  createdAt: {
                    gte: start_date, //greater than equal
                    lte: end_date,
                    // gte: 'now-30d/d',
                    // lte: 'now/d'
                  },
                },
              },
            ],
          },
        },
        aggs: {
          group_by: {
            date_histogram: {
              field: "createdAt",
              interval: "day", //year month week
            },
            aggs: {
              quantity: {
                sum: {
                  field: "quantity", //Không cần sort , tự động xếp giảm dần theo quantity
                },
              },
            },
          },
        },
      },
    });
    //
    res.status(200).send(result.body.aggregations.group_by.buckets);
  } catch (error) {
    next({});
  }
};
//top 5 sản phẩm bán chạy nhất theo số lượng
const getTop5BestSell = async (req, res, next) => {
  try {
    if (req.user.role !== "admin")
      return next({ msg: "Bạn không có quyền truy cập", code: 401 });
    let { start_date, end_date } = req.query;
    const result1 = await client.search({
      index: "order_details",
      filter_path: "aggregations.topSellById.buckets",
      _source: false,
      body: {
        query: {
          range: {
            createdAt: {
              gte: start_date, //greater than equal
              lte: end_date,
              // gte: 'now-30d/d',
              // lte: 'now/d'
            },
          },
        },
        aggs: {
          topSellById: {
            terms: {
              field: "book_id",
              size: 5,
              order: { quantity: "desc" },
            },
            aggs: {
              quantity: {
                sum: {
                  field: "quantity",
                },
              },
            },
          },
        },
      },
    });

    let idList = result1.body.aggregations.topSellById.buckets.map(
      (item) => item.key
    );
    //
    const result = await client.search({
      index: "books",
      // filter_path: 'hits.hits._source',
      body: {
        query: {
          terms: {
            bookId: idList,
          },
        },
        _source: ["title", "bookId"], // sửa lại thành title
        sort: [
          {
            _script: {
              type: "number",
              script: {
                inline:
                  "if(doc['bookId'] != null){for(int i=0;i<params.sortOrder.length;i++){if(doc['bookId'].value==params.sortOrder[i]){return i}}}else{return 0;}",
                params: {
                  sortOrder: idList,
                },
              },
              order: "asc",
            },
          },
        ],
      },
    });
    if (result.body.hits) {
      for (let i = 0; i < result.body.hits.hits.length; i++) {
        result.body.hits.hits[i].numberOfSell =
          result1.body.aggregations.topSellById.buckets[i].quantity.value;
      }
      res.status(200).send(result.body.hits.hits);
    } else {
      res.status(200).send([]);
    }
  } catch (error) {
    next({});
  }
};
//top 5 sản phẩm theo doanh thu
const getTop5Total = async (req, res, next) => {
  try {
    if (req.user.role !== "admin")
      return next({ msg: "Bạn không có quyền truy cập", code: 401 });
    let { start_date, end_date } = req.query;
    let [start, end] = getTimeRange(start_date, end_date);
    // const result = await client.search({
    //     index: 'order_details',
    //     filter_path: 'aggregations.group_by_id.buckets',
    //     _source: false,
    //     body: {
    //         query: {
    //             range: {
    //                 createdAt: {
    //                     // gte: start_date, //greater than equal
    //                     // lte: end_date
    //                     gte: 'now-30d/d',
    //                     lte: 'now/d'
    //                 }
    //             }
    //         },
    //         aggs: {
    //             group_by_id: {
    //                 terms: {
    //                     field: 'book_id',
    //                     size: 5
    //                 },
    //             }
    //         }
    //     }
    // })
    //query theo id rồi nhân đơn giá

    // let data = await Order_detail.findAll({
    //     attributes: [
    //         'book_id',
    //         'discount',
    //         // [sequelize.fn("COUNT", sequelize.col("quantity")), "count"],
    //         [sequelize.literal('SUM(`Order_detail`.quantity * (1-`Order_detail`.discount/100)* `product`.price)'), 'total']
    //     ],
    //     include: {
    //         model: Book,
    //         as: 'product',
    //         attributes: ['title']
    //     },
    //     // group: ['book_id','discount']
    //     group: ['book_id'],
    //     limit: 5,
    //     where: {
    //         createdAt: {
    //             [Op.gte]: start,
    //             [Op.lte]: end
    //         }
    //     },
    //     order: [
    //         [[sequelize.literal('total'), 'DESC']]
    //     ]
    // })
    let data = await sequelize.query(
      "SELECT `Order_detail`.`book_id`, `Order_detail`.`discount`, SUM(`Order_detail`.quantity * (1-`Order_detail`.discount/100)* `product`.price) AS `total`, `product`.`bookId` AS `bookId`, `product`.`title` AS `title` FROM `order_details` AS `Order_detail` LEFT OUTER JOIN `books` AS `product` ON `Order_detail`.`book_id` = `product`.`bookId` WHERE (`Order_detail`.`createdAt` >= :start AND `Order_detail`.`createdAt` <= :end) GROUP BY `book_id` ORDER BY total DESC LIMIT 5;",
      {
        type: QueryTypes.SELECT,
        replacements: { start, end },
      }
    );
    console.log(data);
    // res.status(200).send(result.body.aggregations.group_by_id.buckets)
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    next({});
  }
};
// top 5 khu vực nhiều đơn nhất, thêm trường id của prvince vào cho dễ truy vấn
const getTop5LocationSell = async (req, res, next) => {
  try {
    if (req.user.role !== "admin")
      return next({ msg: "Bạn không có quyền truy cập", code: 401 });
    let { start_date, end_date } = req.query;
    const result = await client.search({
      index: "orders",
      filter_path: [
        "aggregations.topLocation.buckets",
        "aggregations.topLocation.buckets.hits.hits.hits",
      ],
      // _source: false,
      body: {
        query: {
          range: {
            createdAt: {
              gte: start_date, //greater than equal
              lte: end_date,
              // gte: 'now-30d/d',
              // lte: 'now/d'
            },
          },
        },
        aggs: {
          topLocation: {
            terms: {
              field: "province",
              size: 5,
            },
          },
        },
      }, // tự động sắp xếp theo doc_count nên ko cần sort nữa
    });
    // trả về id của province và số lượng tương ứng , id province có hàm chuyển từ id sang text không cần phải query lên server nữa
    res.status(200).send(result.body.aggregations.topLocation.buckets);
  } catch (error) {
    next({});
  }
};
// khu vực doanh thu cao nhất
const getTop5LocationTotal = async (req, res, next) => {
  try {
    if (req.user.role !== "admin")
      return next({ msg: "Bạn không có quyền truy cập", code: 401 });
    let { start_date, end_date } = req.query;
    const result = await client.search({
      index: "orders",
      filter_path: [
        "aggregations.topLocation.buckets",
        "aggregations.topLocation.buckets.hits.hits.hits",
      ],
      // _source: false,
      body: {
        query: {
          range: {
            createdAt: {
              gte: start_date, //greater than equal
              lte: end_date,
              // gte: 'now-30d/d',
              // lte: 'now/d'
            },
          },
        },
        aggs: {
          topLocation: {
            terms: {
              field: "province",
              // size: 5,
            },
            aggs: {
              total: {
                sum: {
                  field: "total",
                },
              },
              sales_bucket_sort: {
                bucket_sort: {
                  sort: [{ total: { order: "desc" } }],
                  size: 5,
                },
              },
            },
          },
        },
      },
    });
    //
    res.status(200).send(result.body.aggregations.topLocation.buckets);
  } catch (error) {
    next({});
  }
};
//top 5 sản phẩm bán chạy nhất theo danh mục
const getTop5SellByCategory = async (req, res, next) => {
  try {
    if (req.user.role !== "admin")
      return next({ msg: "Bạn không có quyền truy cập", code: 401 });
    let { start_date, end_date } = req.query;
    let [start, end] = getTimeRange(start_date, end_date);
    let result = await sequelize.query(
      "select `categories`.name , sum(quantity )AS quantity from order_details left join (books left join categories on `books`.category = `categories`.id) on `order_details`.book_id = `books`.bookId where(`order_details`.createdAt >= :start AND `order_details`.createdAt <= :end) group by `books`.category order by quantity desc;",
      {
        type: QueryTypes.SELECT,
        replacements: { start, end },
      }
    );
    //
    res.status(200).send(result);
  } catch (error) {
    console.log(error);
    next({});
  }
};
/// Phân loại đơn hàng theo trạng thái
const numOfOrderByStatus = async (req, res, next) => {
  try {
    if (req.user.role !== "admin")
      return next({ msg: "Bạn không có quyền truy cập", code: 401 });
    let { start_date, end_date } = req.query;
    let [start, end] = getTimeRange(start_date, end_date);
    let data = await sequelize.query(
      "select `status`, count(id) as total from orders where(`orders`.createdAt >= :start AND `orders`.createdAt <= :end) group by `status` order by `status`;",
      {
        type: QueryTypes.SELECT,
        replacements: { start, end },
      }
    );
    // console.log("asdasd")
    res.status(200).send(data);
  } catch (error) {
    next({});
  }
};
// Số lượng tài khoản đăng ký group by day:
const numOfNewUserByDay = async (req, res, next) => {
  try {
    if (req.user.role !== "admin")
      return next({ msg: "Bạn không có quyền truy cập", code: 401 });
    let { start_date, end_date } = req.query;
    let data = await client.search({
      index: "users",
      filter_path: "aggregations.group_by.buckets",
      // from:0,
      // size:10000, // default là 10 , chỉ trả về 10
      _source: false,
      body: {
        query: {
          range: {
            createdAt: {
              gte: start_date, //greater than equal
              lte: end_date,
              // gte: 'now-90d/d',
              // lte: 'now/d'
            },
          },
        },
        aggs: {
          group_by: {
            date_histogram: {
              field: "createdAt",
              interval: "day", //year month week day hour minute quarter
            },
          },
        },
      },
    });
    res.status(200).send(data.body.aggregations.group_by);
  } catch (error) {
    next({});
  }
};
module.exports = {
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
  client,
};
