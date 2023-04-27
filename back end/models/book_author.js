"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Book_author extends Model {
    static associate({ Author, Book }) {
      this.hasMany(Author, { foreignKey: "id", sourceKey: "authorid" });
      this.belongsTo(Book, { foreignKey: "bookid", targetKey: "bookId" });
    }
  }
  Book_author.init(
    {
      bookid: {
        type: DataTypes.NUMBER,
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
        type: DataTypes.NUMBER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: {
            tableName: "authors",
          },
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "Book_author",
      tableName: "book_authors",
    }
  );
  return Book_author;
};
