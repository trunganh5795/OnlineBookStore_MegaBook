import constants from '../constants/index';
import axios from 'axios';

const queryString = (query = '') => {
  if (!query || query === '') return [];
  let result = [];
  let q = query;
  // xoá ký tự '?' nếu có
  if (q[0] === '?') q = q.slice(1, q.length);
  // tách các cụm query ['t=0', 'key=1']
  const queryList = q.split('&');
  result = queryList.map((str) => {
    let res = {};
    let temp = str.split('=');
    if (temp.length <= 1) res[temp[0]] = '';
    else res[temp[0]] = temp[1];
    return res;
  });

  return result;
};

// fn: phân tích query param url
// vd: key = p-reg-brand, value = Apple => {brand: {$regex: /^Apple$/i}}
// option p- là thuộc tính trong Product Model
const analysisQuery = (key = '', value = '') => {
  try {
    if (key === '') return;
    let result = {};

    // split '-' => ["p", "reg", "brand"]
    const options = key.split('-');

    // lấy main key là phần tử cuối trong mảng
    const mainKey = options[options.length - 1];

    // Note:nếu tồn tại "p" thì là thuộc tính của product model
    const isProductAttr = options.indexOf('p') === -1 ? false : true;

    // Note: nếu tồn tại "reg" tức là chuỗi cần bỏ vào regex
    const isRegex = options.indexOf('reg');

    // Note: nếu tồn tại "o" tức chuỗi là 1 object
    const isObject = options.indexOf('o');

    // value tồn tại ";" tức là đa giá trị
    const compositeValues = value.split(';');
    if (compositeValues.length <= 1) {
      // Note: đơn giá trị
      if (isRegex !== -1) {
        // giá trị value là 1 regex
        const newObj = {};
        newObj[mainKey] = { $regex: `${value}` };
        Object.assign(result, newObj);
      } else if (isObject !== -1) {
        //  giá trị value là 1 object
        const newObj = JSON.parse(`{${value}}`);
        result[mainKey] = newObj;
      } else {
        // không chứa key đặc biệt
        result[mainKey] = `${value}`;
      }
    } else {
      // Note: nhiều giá trị [values]
      result['$or'] = [];
      if (isRegex !== -1) {
        // giá trị value là 1 regex
        compositeValues.forEach((valueItem) => {
          const newObj = {};
          newObj[mainKey] = { $regex: `${valueItem}` };
          result['$or'].push(newObj);
        });
      } else if (isObject !== -1) {
        //  giá trị value là 1 object
        compositeValues.forEach((valueItem) => {
          const newObj = {};
          newObj[mainKey] = JSON.parse(`{${valueItem}}`);
          result['$or'].push(newObj);
        });
      } else {
        // không chứa key đặc biệt
        compositeValues.forEach((valueItem) => {
          const newObj = {};
          newObj[mainKey] = `${valueItem}`;
          result['$or'].push(newObj);
        });
      }
    }

    // return
    return { isProductAttr, result };
  } catch (error) {
    // error
    return { isProductAttr: true, result: {} };
  }
};

// fn: định dạng chuỗi truy vấn
const formatQueryString = (str = '') => {
  let result = str;
  // xoá tất cả ký tự đặc biệt
  result = str.replace(/[`~!@#$%^&*()_|+\-=?;:<>{}[\]\\/]/gi, '');
  // thay khoảng trắng thành dấu cộng
  result = result.replace(/[\s]/gi, '+');
  return result;
};

// fn: hàm rút gọn tên sản phẩm
const reduceProductName = (name, length = 56) => {
  if (!name) {
    return 'Đang cập nhật';
  } else {
    let result = name;
    if (name && name.length >= length) {
      result = name.slice(0, length) + ' ...';
    }
    return result;
  }
};
const translateToEn = async (encodedParams) => {
  const options = {
    method: 'POST',
    url: 'https://google-translate1.p.rapidapi.com/language/translate/v2',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'X-RapidAPI-Key': '396423ff00mshc42c3ff8a074bbdp17576djsn1ec6ba82e016',
      'X-RapidAPI-Host': 'google-translate1.p.rapidapi.com',
    },
    data: encodedParams,
  };
  return axios
    .request(options)
    .then(function (response) {
      return response.data.data.translations[0].translatedText;
    })
    .catch(function (error) {
      return null;
    });
};
// fn: hàm format giá sản phẩm
const formatProductPrice = (price) => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};
const calculateShippingFee = (pronviceId, numOfProduct) => {
  let basePrice = constants.SHIPPING_BASE_PRICE[pronviceId - 1];
  if (numOfProduct < 3) {
    return basePrice;
  } else {
    return basePrice * (Math.floor(numOfProduct / 3) * 0.2 + 1);
  }
};
// fn: tính tỉ lệ sao của sản phẩm [1,2,3,4,5]
const calStar = (rates) => {
  const total = rates.reduce((a, b) => a + b, 0);
  if (total === 0) return 0;
  let rateTotal = 0;
  for (let i = 0; i < 5; ++i) {
    rateTotal += rates[i] * (i + 1);
  }
  return rateTotal / total;
};

// fn: chuyển key product thành tiếng Việt, vd: color => màu sắc

const convertCategoryIdToString = (key) => {
  let category = constants.CATEGORIES.find((item) => item.value === key);
  if (category) {
    return category.title;
  } else {
    return 'Tất cả';
  }
};
// fn: chuyên width màn hình window -> size theo ant design
const convertWidthScreen = (size = 576) => {
  if (size < 576) return 'xs';
  if (size >= 576 && size < 768) return 'sm';
  if (size >= 768 && size < 992) return 'md';
  if (size >= 992 && size < 1200) return 'lg';
  if (size >= 1200 && size < 1600) return 'xl';
  return 'xxl';
};

// fn: Hàm chuyển rate thành text
const convertRateToText = (rate = 0) => {
  switch (rate) {
    case 0:
      return 'Rất tệ';
    case 1:
      return 'Không hay';
    case 2:
      return 'Bình thường';
    case 3:
      return 'Tạm được';
    case 4:
      return 'Hay';
    case 5:
      return 'Rất hay';
    default:
      return 'Sản phẩm bình thường';
  }
};

// fn: format thời gian
const formatDate = (date = new Date().getTime()) => {
  var months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]; // Store month names in array
  const d = new Date(date);
  const y = d.getFullYear(),
    m = d.getMonth(),
    day = d.getDate();

  return `${day} ${months[m]}, ${y}`;
};

//fn: chuyển loại sản phẩm từ số thành Model
const convertProductType = (type = 0) => {
  switch (type) {
    case 1:
      return 'Kinh Tế';
    case 2:
      return 'Văn Học';
    case 3:
      return 'Địa Danh - Du Lịch';
    case 4:
      return 'Giáo Dục';
    case 5:
      return 'Thể Thao - Sức Khỏe';
    case 6:
      return 'Truyện';
    default:
      return 'Tâm lý giới tính';
  }
};

// fn: random màu
const randomColor = () => {
  let r = Math.round(Math.random() * 254 + 1);
  let g = Math.round(Math.random() * 254 + 1);
  let b = Math.round(Math.random() * 254 + 1);
  return `rgb(${r},${g},${b})`;
};

// fn: generate autocomplete search options
const autoSearchOptions = () => {
  let result = [];
  return result;
};

// fn: chuyển đổi thời gian now -> dd/mm/yyyy
const formatOrderDate = (date = Date.now(), flag = 0) => {
  const newDate = new Date(date);
  const d = newDate.getDate(),
    m = newDate.getMonth() + 1,
    y = newDate.getFullYear();
  return flag === 0
    ? `${d}/${m}/${y}`
    : `${newDate.getHours()}:${newDate.getMinutes()} - ${d}/${m}/${y}`;
};

// fn: chuyển đổi tình trạng đơn hàng
const convertOrderStatus = (orderStatus = 0) => {
  switch (orderStatus) {
    case 1:
      return 'Chờ Thanh Toán';
    case 2:
      return 'Chưa Xác Nhận';
    case 3:
      return 'Chờ Lấy Hàng';
    case 4:
      return 'Đang Vận Chuyển';
    case 5:
      return 'Đã Hoàn Thành';
    default:
      return 'Đã Hủy';
  }
};

// fn: chuyển đổi phương thức thanh toán
const convertPaymentMethod = (payMethod = 0) => {
  switch (payMethod) {
    case 1:
      return 'COD';
    case 2:
      return 'QR code';
    default:
      return 'Card';
  }
};

// fn: tính tổng phí đơn hàng
const calTotalOrderFee = (order) => {
  let total = order.reduce(
    (total, item, index) => (total += item.quantity * item.product.price),
    0,
  );
  return total;
};
const getDiscountVoucher = (
  carts,
  voucher,
  voucherList,
  message,
  selectedVoucher,
) => {
  let total = carts.reduce((total, item, index) => {
    total += item.price * item.amount;
    return total;
  }, 0);
  let voucherObject = voucherList.find((item) => item.code === voucher);
  if (!voucherObject) {
    message.error('Invalid Voucher');
    return 0;
  }
  if (voucherObject.minSpend <= total) {
    selectedVoucher.current = voucherObject.id;
    if (voucherObject.amount.length) {
      return voucherObject.amount[0].amount;
    }
    if (voucherObject.apply === null) {
      if (voucherObject.percentage.length) {
        return (total * voucherObject.percentage[0].percent) / 100;
      }
    } else {
      let totalByType = carts.reduce((total, item, index) => {
        if (item.category === voucherObject.apply) {
          total += item.price * item.amount;
        }
        return total;
      }, 0);
      if (voucherObject.percentage.length) {
        return (totalByType * voucherObject.percentage[0].percent) / 100;
      }
    }
  }
  return 0;
};
const countRate = (pattern, cmtList) => {
  let count = cmtList.reduce((total, item) => {
    if (item.value === pattern) total += 1;
    return total;
  }, 0);

  return count;
};
const graphqlQuery = (since, until, frequency) => {
  let query = {
    query: `query MetricsComparisonWidgetQuery($databaseId: ID!, $since: DateTime!, $until: DateTime, $frequency: HistogramFrequency, $databaseCountsMetrics: [DatabaseCountsMetric!]!, $databaseMonetaryMetrics: [DatabaseMonetaryMetric!]!, $databaseRecommendationsQualityMetrics: [DatabaseRecommendationsQualityMetric!]!, $scenarios: [String!]) {
      database(id: $databaseId) {
        id
        currency
      statistics {
         countsHistogram(
            since: $since
          until: $until
           metrics: $databaseCountsMetrics
           scenarios: $scenarios
           frequency: $frequency
         ) {
           metric
          values
            __typename
          }
          monetaryHistogram(
            since: $since
            until: $until
            metrics: $databaseMonetaryMetrics
            scenarios: $scenarios
            frequency: $frequency
          ) {
           metric
            values
           __typename
         }
          recommendationsQualityHistogram(
          since: $since
          until: $until
            metrics: $databaseRecommendationsQualityMetrics
           scenarios: $scenarios
           frequency: $frequency
          ) {
            metric
            values
           __typename
          }
          __typename
        }
        __typename
      }
      __typename
    }
    `,
    operationName: 'MetricsComparisonWidgetQuery',
    variables: {
      databaseId: 'bookstore-dev',
      since: since,
      until: until,
      frequency: frequency,
      databaseCountsMetrics: ['numViews'],
      databaseMonetaryMetrics: [],
      databaseRecommendationsQualityMetrics: [],
      scenarios: null,
    },
  };
  return JSON.stringify(query);
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  formatQueryString,
  queryString,
  analysisQuery,
  reduceProductName,
  formatProductPrice,
  calStar,
  convertWidthScreen,
  convertRateToText,
  convertProductType,
  formatDate,
  randomColor,
  autoSearchOptions,
  formatOrderDate,
  convertOrderStatus,
  convertPaymentMethod,
  calTotalOrderFee,
  convertCategoryIdToString,
  getDiscountVoucher,
  countRate,
  calculateShippingFee,
  graphqlQuery,
  translateToEn,
};
