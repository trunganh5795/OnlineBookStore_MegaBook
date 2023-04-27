const { shippingBasePrice } = require("../constrants");
const moment = require("moment");
const generateVerifyCode = (n) => {
  // n is length of code
  if (n > 0) {
    let verifyCode = Math.floor(Math.random() * Math.pow(10, n));
    let len = verifyCode.toString().length;
    if (len < n) {
      //Nếu số chữ số chưa đủ thì thêm 0 vào bên phải, bằng cách x10
      verifyCode = verifyCode * Math.pow(10, n - len);
    }
    return verifyCode;
  } else {
    return;
  }
};
const findSocketIdInConnectedUserList = (userList, userId) => {
  // console.log("User List : ", userList);
  for (let i = 0; i < userList.length; i++) {
    if (userId === userList[i].userId) {
      return userList[i].socketId;
    }
  }
  return null;
};
const calculateShippingFee = (pronviceId, numOfProduct) => {
  let basePrice = shippingBasePrice[pronviceId - 1];
  if (numOfProduct < 3) {
    return basePrice;
  } else {
    return basePrice * (Math.floor(numOfProduct / 3) * 0.2 + 1);
  }
};
const discountByVoucher = (productList, voucher, total) => {
  if (voucher.minSpend <= total) {
    if (voucher.apply === null) {
      if (voucher.percentage.length) {
        return (total * voucher.percentage[0].percent) / 100;
      } else if (voucher.amount.length) {
        return voucher.amount[0].amount;
      }
    } else {
      let totalByType = productList.reduce((total, item, index) => {
        if (item.category === voucher.apply) {
          total += item.price * item.amount;
        }
        return total;
      }, 0);
      if (voucher.minSpend <= totalByType) {
        if (voucher.percentage.length) {
          return (totalByType * voucher.percentage[0].percent) / 100;
        } else {
          return voucher.amount[0].amount;
        }
      }
    }
  }
  return 0;
};
const getTimeRange = (start_date, end_date) => {
  // Giờ phải chuyển qua dạng UTC vì insert vào database theo giờ UTC
  if (start_date.includes("-7d/d")) {
    start_date = moment(new Date() - 7 * 24 * 60 * 60 * 1000)
      .utc()
      .format("YYYY-MM-DD");
  } else if (start_date.includes("-30d/d")) {
    start_date = moment(new Date() - 30 * 24 * 60 * 60 * 1000)
      .utc()
      .format("YYYY-MM-DD");
  } else if (start_date.includes("now/d")) {
    start_date = moment().startOf("day").utc().format("YYYY-MM-DD HH:mm:ss");
  }
  // if (end_date.includes('now/d')) end_date = new Date();
  if (end_date.includes("now/d"))
    end_date = moment().utc().format("YYYY-MM-DD HH:mm:ss");
  return [start_date, end_date];
};
const removeVietnameseTones = (str) => {
  str = str.replace(/(<([^>]+)>)/gi, "");
  str = str.replace(/(?:\r\n|\r|\n)/g, " ");
  str = str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    " "
  );
  str = str.trim();
  str = str.replace(/\s\s+/g, " ");
  return str;
};
module.exports = {
  generateVerifyCode,
  findSocketIdInConnectedUserList,
  calculateShippingFee,
  discountByVoucher,
  getTimeRange,
  removeVietnameseTones,
};
