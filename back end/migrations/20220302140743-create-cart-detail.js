"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface
      .createTable("cart_details", {
        cart_id: {
          allowNull: false,
          // autoIncrement: true,
          // primaryKey: true,
          type: Sequelize.INTEGER,
          references: {
            model: {
              tableName: "carts",
            },
            key: "id",
          },
        },
        book_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          // primaryKey: true,
          references: {
            model: {
              tableName: "books",
            },
            key: "bookId",
          },
        },
        quantity: {
          type: Sequelize.INTEGER,
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
      })
      .then(() => {
        return queryInterface.sequelize.query(
          "ALTER TABLE `cart_details` ADD PRIMARY KEY (`cart_id`, `book_id`)"
        );
      });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("cart_details");
  },
};
