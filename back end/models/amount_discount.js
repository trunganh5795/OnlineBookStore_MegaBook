"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Amount_discount extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Voucher }) {
      // define association here
      this.belongsTo(Voucher, { foreignKey: "id", targetKey: "id" });
    }
  }
  Amount_discount.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: [[1]],
            msg: "Value must be greater than 1",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "amount_discount",
      tableName: "amount_discounts",
      timestamps: false,
    }
  );
  return Amount_discount;
};
