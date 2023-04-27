"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Predict_cancellation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Order }) {
      // define association here
      this.belongsTo(Order, {
        foreignKey: "order_id",
        targetKey: "id",
        as: "order",
      });
    }
  }
  Predict_cancellation.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      order_id: {
        type: DataTypes.NUMBER,
        allowNull: false,
        primaryKey: true,
        foreignKey: true,
        references: {
          model: "Order",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      ratio: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      contact_time: {
        type: DataTypes.NUMBER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Predict_cancellation",
      tableName: "predict_cancellations",
    }
  );
  return Predict_cancellation;
};
