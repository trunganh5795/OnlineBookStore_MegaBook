"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Author extends Model {
    static associate({ Book_author }) {
      // this.belongsToMany(Book_author, { foreignKey: 'id', targetKey: 'authorid',through:'author_book' })
    }
  }
  Author.init(
    {
      id: {
        type: DataTypes.NUMBER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nationality: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "N/A",
      },
    },
    {
      sequelize,
      modelName: "Author",
      tableName: "authors",
    }
  );
  return Author;
};
