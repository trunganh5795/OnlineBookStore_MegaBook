"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("provinces", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      code: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("provinces");
  },
};
