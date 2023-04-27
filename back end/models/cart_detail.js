"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cart_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Cart_detail.init(
    {
      cart_id: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      book_id: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: [[0]],
            msg: "Value must be greater than zero",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Cart_detail",
    }
  );
  return Cart_detail;
};
