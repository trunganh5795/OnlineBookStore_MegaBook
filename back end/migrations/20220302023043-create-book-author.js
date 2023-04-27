"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("book_authors", {
      bookid: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: {
            tableName: "books",
          },
          key: "bookId",
        },
      },
      authorid: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: {
            tableName: "authors",
          },
          key: "id",
        },
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("book_authors");
  },
};
