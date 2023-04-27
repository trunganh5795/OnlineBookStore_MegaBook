// const UserModel = require('../models/account.models/user.model');
const { User } = require("../models");
const { uploadProductAvt } = require("./admin.controller");
// api: get user
const getUser = async (req, res, next) => {
  try {
    //if check authentication wrong then return error
    if (!res.locals.isAuth)
      return next({ code: 401, msg: "Bạn không có quyền" });
    //else get information user -> send client
    const { id } = req.user;

    const infoUser = await User.findByPk(+id, {
      attributes: [
        "id",
        "dateOfBirth",
        "email",
        "phone_no",
        "address",
        "name",
        "gender",
        "img",
        "balance",
      ],
    });

    //send information user except _id
    res.status(200).json({ user: infoUser });
  } catch (error) {
    next({});
  }
};

// api: update user
const putUpdateUser = async (req, res, next) => {
  try {
    if (!res.locals.isAuth) {
      return res.status(400).json({ message: "Không thể lấy thông tin user" });
    }
    let imgURL = null;
    const { name, gender, dateOfBirth, avatar } = req.body.value;
    const { id } = req.user;
    let userDetail = await User.findByPk(id);
    // userDetail return chi tiết user nếu cần
    if (avatar) {
      imgURL = await uploadProductAvt(
        `${userDetail.name}-${userDetail.id}`,
        avatar,
        "/user-avatar"
      );
    }

    if (userDetail) {
      const response = await userDetail.update({
        name,
        gender,
        dateOfBirth,
        img: imgURL,
      });
      if (response) {
        return res.status(200).json({ message: "success" });
      }
    } else {
      return next({ code: 400, msg: "Không tìm thấy user" });
    }
  } catch (error) {
    next({});
  }
};

//export
module.exports = {
  getUser,
  putUpdateUser,
};
