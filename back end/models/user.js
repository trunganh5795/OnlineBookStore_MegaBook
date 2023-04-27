"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Rating, Order }) {
      this.hasMany(Rating, {
        foreignKey: "user_id",
        sourceKey: "id",
        as: "ratings",
      });
      this.hasMany(Order, {
        foreignKey: "user_id",
        sourceKey: "id",
        as: "orders",
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.NUMBER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      dateOfBirth: {
        type: DataTypes.DATE,
        allowNull: true,
        validate: {
          checkValidDate(value) {},
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "The email is required",
          },
          isEmail: {
            msg: "Invalid Email",
          },
          notNull: {
            msg: "The email couldn't be null",
          },
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "The name is required",
          },
          notNull: {
            msg: "The name couldn't be null",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      balance: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      img: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      active: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "unverified",
        validate: {
          isIn: {
            args: [["unverified", "active", "block"]],
            msg: "Invalid value",
          },
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "client",
        validate: {
          isIn: {
            args: [["client", "admin"]],
            msg: "Invalid value",
          },
        },
      },
      phone_no: {
        type: DataTypes.STRING(11),
        allowNull: true,
        validate: {
          len: {
            args: [[10, 11]],
            msg: "Your phone number isnot valid",
            //string length between 10 and 11
          },
        },
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isIn: {
            args: [["male", "female"]],
            msg: "Invalid value",
          },
        },
      },
      verifyCode: {
        type: DataTypes.INTEGER(6).UNSIGNED,
        allowNull: true,
      },
      authType: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "local",
        validate: {
          isIn: {
            args: [["local", "google", "facebook"]],
            msg: "Invalid value",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
    }
  );
  return User;
};
