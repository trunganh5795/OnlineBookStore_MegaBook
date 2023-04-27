"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      dateOfBirth: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      role: {
        type: Sequelize.ENUM({
          values: ["client", "admin"],
        }),
        allowNull: false,
        defaultValue: "client",
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      balance: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      img: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      active: {
        type: Sequelize.ENUM({
          values: ["unverified", "active", "block"],
        }),
        defaultValue: "unverified",
      },
      address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      phone_no: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      gender: {
        type: Sequelize.ENUM({
          values: ["male", "female"],
        }),
        allowNull: true,
      },
      verifyCode: {
        type: Sequelize.INTEGER(6).UNSIGNED,
        allowNull: true,
      },
      authType: {
        type: Sequelize.ENUM({
          values: ["local", "google", "facebook"],
        }),
        allowNull: false,
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
    await queryInterface.dropTable("users");
  },
};
