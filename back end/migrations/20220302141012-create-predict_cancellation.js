"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("predict_cancellations", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: "orders",
          },
          key: "id",
        },
      },
      ratio: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      contact_time: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
    await queryInterface.dropTable("predict_cancellations");
  },
};
