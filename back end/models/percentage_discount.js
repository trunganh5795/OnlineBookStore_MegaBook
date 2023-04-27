"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Percentage_discount extends Model {
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
  Percentage_discount.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      percent: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: [[0]],
            msg: "Value must be beteween 0 and 100",
          },
          max: {
            args: [[100]],
            msg: "Value must be beteween 0 and 100",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Percentage_discount",
      tableName: "percentage_discounts",
      timestamps: false,
    }
  );
  return Percentage_discount;
};
