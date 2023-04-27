"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("books", {
      bookId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      QRcodeImg: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM({
          values: ["hide", "active", "delete"],
        }),
        allowNull: false,
        defaultValue: "active",
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      sku: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      short_description: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      category: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: "categories",
          },
          key: "id",
        },
      },
      width: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      height: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      author: {
        type: Sequelize.STRING,
        allowNull: true,
        // references: {
        //   model: {
        //     tableName: 'book_authors'
        //   },
        //   key: 'bookid'
        // }
      },
      instock: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      publisher: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      publicOfYear: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      comment: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      stars: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      img: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      discount: {
        type: Sequelize.INTEGER,
        default: 0,
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
    await queryInterface.dropTable("books");
  },
};
