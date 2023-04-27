"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "districts",
      {
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
        prefix: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        province_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "provinces",
            key: "id",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
      },
      {
        indexes: [
          //Tạo index đề tối ưu truy vấn
          {
            name: "DistrictsProvinceIdIndex",
            unique: true,
            fields: ["province_id"],
          },
        ],
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("districts");
  },
};
