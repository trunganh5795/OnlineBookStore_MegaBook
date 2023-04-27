"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ShippingAddress extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Ward, User, Order }) {
      // define association here
      this.hasOne(Ward, { foreignKey: "id", sourceKey: "address", as: "ward" });
      this.belongsToMany(User, {
        foreignKey: "user_id",
        as: "user",
        through: "user_address",
      });
      this.belongsToMany(Order, {
        foreignKey: "id",
        as: "order",
        through: "order_address",
      });
    }
  }
  ShippingAddress.init(
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
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      address: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Ward",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      reciver: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: [[10, 11]],
            msg: "Your phone number isnot valid",
            //string length between 10 and 11
          },
        },
      },
      details: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      defaultAddress: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      delete: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "ShippingAddress",
      tableName: "shippingaddresses",
      timestamps: false,
    }
  );
  return ShippingAddress;
};
