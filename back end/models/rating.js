"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Book, User }) {
      // define association here
      this.belongsTo(User, {
        foreignKey: "user_id",
        targetKey: "id",
        as: "user",
      });
      this.belongsTo(Book, {
        foreignKey: "book_id",
        targetKey: "bookId",
        as: "book",
      });
    }
  }
  Rating.init(
    {
      id: {
        type: DataTypes.NUMBER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      value: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: [[1]],
            msg: "Value must be between 1 and 5",
          },
          max: {
            args: [[5]],
            msg: "Value must be between 1 and 5",
          },
        },
      },
      comment: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      user_id: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
      book_id: {
        type: DataTypes.NUMBER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Rating",
      tableName: "ratings",
    }
  );
  return Rating;
};
