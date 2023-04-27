"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface
      .createTable("order_details", {
        order_id: {
          allowNull: false,
          type: Sequelize.INTEGER,
          references: {
            model: {
              tableName: "orders",
            },
            key: "id",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
        book_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: {
              tableName: "books",
            },
            key: "bookId",
          },
          onDelete: "NO ACTION",
          onUpdate: "CASCADE",
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
          "ALTER TABLE `order_details` ADD PRIMARY KEY (`order_id`, `book_id`)"
        );
      });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("order_details");
  },
};
