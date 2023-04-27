const { SHIPPING_BASE_PRICE } = require("../config/constrant");
const { findSocketIdInConnectedUserList } = require("../helpers");
const {
  Province,
  District,
  Ward,
  ShippingAddress,
  sequelize,
} = require("../models");

// Lấy danh sách tỉnh/ thành phố
const getProvince = async (req, res, next) => {
  try {
    const list = await Province.findAll();
    if (list) {
      return res.status(200).json(list);
    }
  } catch (error) {
    return next({ code: 400, msg: "Failed" });
  }
};
// api: lấy danh sách huyện/quận theo id province
// Note: chỉ lấy huyện/quận; không lấy phường & đường
const getDistrict = async (req, res, next) => {
  try {
    const { id } = req.query;
    const data = await District.findAll({
      where: {
        province_id: id,
      },
      attributes: ["id", "name", "prefix"],
    });
    if (data) {
      return res.status(200).json(data);
    }
  } catch (error) {
    next({ code: 400, msg: "Bad request" });
  }
};
//Lấy danh sách phường
const getWard = async (req, res, next) => {
  try {
    const { district } = req.query;
    const data = await Ward.findAll({
      where: {
        district_id: district,
      },
      attributes: ["id", "name", "prefix"],
    });
    if (data) {
      return res.status(200).json({ wards: data });
    }
  } catch (error) {
    next({ code: 400, msg: "Bad Request" });
  }
};
// thêm địa chỉ nhận hàng
const addNewShippingAddress = async (req, res, next) => {
  try {
    const { id } = req.user;
    let { newAddress } = req.body;

    let defaultAddress = null;
    ShippingAddress.findAll({
      where: {
        user_id: id,
        delete: false,
        // defaultAddress: true,
      },
    })
      .then((result) => {
        if (result.length >= 5) throw new Error("Thêm tối đa 5 địa chỉ");
        for (let i = 0; i < result.length; i++) {
          if (result[i].defaultAddress) {
            defaultAddress = result[i];
            break;
          }
        }
        newAddress = {
          user_id: id,
          address: newAddress.address.ward,
          reciver: newAddress.name,
          phone: newAddress.phone,
          details: newAddress.address.details,
        };
        if (defaultAddress == null) {
          newAddress.defaultAddress = true;
        }

        return ShippingAddress.create(newAddress);
      })
      .then(() => res.status(200).send("success"))
      .catch((e) => {
        if (e.message === "Thêm tối đa 5 địa chỉ")
          return next({ code: 400, msg: "Thêm tối đa 5 địa chỉ" });
        next({});
      });
    return;
  } catch (error) {
    next({});
  }
};
//Lấy danh sách địa chỉ nhận hàng
const getShippingAddressList = async (req, res, next) => {
  try {
    const { id } = req.user;
    let shippingAddList = await ShippingAddress.findAll({
      where: {
        user_id: id,
        delete: false,
      },
      include: {
        model: Ward,
        as: "ward",
        include: {
          model: District,
          as: "district",
          attributes: {
            exclude: ["id"], // lấy tất cả ngoại trừ ID
          },
          include: {
            model: Province,
            as: "province",
            // attributes: ['code', 'name']
          },
        },
      },
      order: [["defaultAddress", "DESC"]],
    });
    res.status(200).send({ list: shippingAddList });
  } catch (error) {
    next({});
  }
};
//đặt địa chỉ mặc định
const putSetDefaultDeliveryAddress = async (req, res, next) => {
  try {
    const { user } = req;
    const { addressId } = req.body;
    let address = await ShippingAddress.findOne({
      where: {
        user_id: user.id,
        id: addressId,
        delete: false,
      },
    });
    if (address) {
      if (address.defaultAddress) return res.status(200).send("success");
      let defaultAddress = await ShippingAddress.findOne({
        where: {
          user_id: user.id,
          defaultAddress: true,
        },
      });
      if (defaultAddress) {
        defaultAddress.defaultAddress = 0;
        await defaultAddress.save();
      }
      address.defaultAddress = 1;
      await address.save();
      res.status(200).send("success");
    } else {
      next({ code: 404, msg: "Không tìm thấy địa chỉ" });
    }
  } catch (error) {
    next({});
  }
};
const delAddDeliveryAddress = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { addressId } = req.query;
    //
    let address = await ShippingAddress.findOne({
      where: {
        user_id: id,
        id: addressId,
      },
    });
    //

    if (address) {
      address.delete = true;
      await address.save();
      res.status(200).send("Xóa thành công");
    } else {
      next({ code: 404, msg: "không tìm thấy địa chỉ" });
    }
  } catch (error) {
    next({});
  }
};
const caculateShippingCost = async (req, res, next) => {
  try {
    const { numOfProduct, provinceId } = req.query;
    let basePrice = SHIPPING_BASE_PRICE[parseInt(provinceId) - 1];
    if (numOfProduct < 3) {
      res.status(200).send({ cost: basePrice });
    } else {
      let shippingCost = basePrice * (Math.floor(numOfProduct / 3) * 0.2 + 1);
      res.status(200).send({ cost: shippingCost });
    }
  } catch (error) {
    next({});
  }
};
module.exports = {
  getProvince,
  getDistrict,
  getWard,
  addNewShippingAddress,
  getShippingAddressList,
  putSetDefaultDeliveryAddress,
  delAddDeliveryAddress,
  caculateShippingCost,
};
