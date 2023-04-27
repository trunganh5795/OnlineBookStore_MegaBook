"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate({ User }) {
      this.belongsTo(User, { foreignKey: "user_id", targetKey: "id" });
    }
  }
  Notification.init(
    {
      id: {
        type: DataTypes.NUMBER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.NUMBER,
        allowNull: false,
        references: {
          model: "User",
          key: "id",
        },
        onDelete: "NO ACTION",
        onUpdate: "NO ACTION",
      },
      text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      order_id: {
        type: DataTypes.NUMBER,
        allowNull: false,
        references: {
          model: "Order",
          key: "id",
        },
        onDelete: "NO ACTION",
        onUpdate: "NO ACTION",
      },
    },
    {
      sequelize,
      modelName: "Notification",
      tableName: "notifications",
    }
  );
  return Notification;
};
