"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({
      Order_detail,
      ShippingAddress,
      User,
      Province,
      Predict_cancellation,
    }) {
      // define association here
      this.hasMany(Order_detail, {
        foreignKey: "order_id",
        as: "order_detail",
      });
      this.hasOne(ShippingAddress, {
        sourceKey: "address",
        foreignKey: "id",
        // as: 'shippingAddress'
      });
      this.hasOne(Province, { sourceKey: "province", foreignKey: "id" });
      this.hasOne(Predict_cancellation, {
        sourceKey: "id",
        foreignKey: "order_id",
        as: "ratio",
      });
      this.belongsTo(User, {
        foreignKey: "user_id",
        targetKey: "id",
        as: "user",
      });
    }
  }
  Order.init(
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
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "2",
        // validate: {
        //     isIn: {
        //         // ["Đã Thanh Toán","Chưa Thanh Toán","Chờ Vận Chuyển", "Đang Vận Chuyển", "Đã Hoàn Thành", "Đã Hủy"]
        //         args: ["1", "2", "3", "4", "5","6"],
        //         msg: "Invalid value"
        //     }
        // }

        // Chưa thanh toán
        // Chờ xác nhận
        // Chờ vận chuyển
        // Đang vận chuyển
        // Đã hoàn thành
        // Đã hủy
      },
      payment: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
          model: "Payment_method",
          key: "paymentId",
        },
      },
      address: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "ShippingAddress",
          key: "id",
        },
      },
      total: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      isRate: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      shipping: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      voucher_discount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      province: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Province",
          key: "id",
        },
      },
      paylink: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Order",
      tableName: "orders",
    }
  );
  return Order;
};
