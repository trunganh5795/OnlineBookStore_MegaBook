"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("amount_discounts", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "vouchers",
          },
          key: "id",
        },
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("amount_discounts");
  },
};
