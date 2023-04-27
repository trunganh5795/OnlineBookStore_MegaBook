"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("vouchers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      start_time: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      end_time: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      apply: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: "categories",
          },
          key: "id",
        },
      },
      minSpend: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      used: {
        type: Sequelize.INTEGER,
        allowNull: false,
        default: 0,
      },
      description: {
        type: Sequelize.STRING,
      },
      delete: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        default: false,
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
    await queryInterface.dropTable("vouchers");
  },
};
