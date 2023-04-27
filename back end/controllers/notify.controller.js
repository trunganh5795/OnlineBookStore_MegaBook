const { Notification } = require("../models");
const getAllNotifyByUser = async (req, res, next) => {
  try {
    let { user } = req;
    let { page } = req.query;
    let perPage = 8;
    if (!page) page = 1;

    const nSkip = (parseInt(page) - 1) * perPage; // 8 item 1 trang
    let result = await Notification.findAndCountAll({
      where: {
        user_id: user.id,
      },
      order: [["createdAt", "DESC"]],
      offset: nSkip,
      limit: perPage,
    });
    res.status(200).send(result);
  } catch (error) {
    next({});
  }
};
module.exports = {
  getAllNotifyByUser,
};
