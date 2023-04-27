"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("orders", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: "users",
          },
          key: "id",
        },
      },
      status: {
        type: Sequelize.ENUM({
          // values: ["Đã Thanh Toán","Chưa Thanh Toán","Chờ Vận Chuyển", "Đang Vận Chuyển", "Đã Hoàn Thành", "Đã Hủy"]
          values: ["1", "2", "3", "4", "5"],
        }),
      },
      payment: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: "payment_methods",
          },
          key: "paymentId",
        },
      },
      voucher: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: "vouchers",
          },
          key: "id",
        },
      },
      address: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: "shippingaddresses",
          },
          key: "id",
        },
      },
      province: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "provinces",
          key: "id",
        },
      },
      total: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      isRate: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("orders");
  },
};
