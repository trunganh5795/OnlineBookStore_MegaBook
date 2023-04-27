"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("shippingaddresses", {
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
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      address: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "wards",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      reciver: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      phone: {
        type: Sequelize.STRING(11),
        allowNull: false,
      },
      details: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      defaultAddress: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("shippingaddresses");
  },
};
