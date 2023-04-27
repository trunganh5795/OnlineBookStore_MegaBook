"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Voucher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ amount_discount, Percentage_discount }) {
      // define association here
      this.hasMany(amount_discount, { foreignKey: "id", as: "amount" });
      this.hasMany(Percentage_discount, { foreignKey: "id", as: "percentage" });
    }
  }
  Voucher.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [5, 100],
        },
      },
      start_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      apply: {
        type: DataTypes.NUMBER,
        allowNull: true,
        references: {
          model: "Categories",
          key: "id",
        },
      },
      minSpend: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: DataTypes.INTEGER,
      used: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      description: DataTypes.STRING,
      delete: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Voucher",
      tableName: "vouchers",
    }
  );
  return Voucher;
};
