"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Order_detail, Rating, Book_author }) {
      // define association here
      // this.hasMany(Book_author, { foreignKey: 'bookid', sourceKey: 'bookId', as: 'author' })
      this.belongsToMany(Order_detail, { through: "orderDetail_book" });
      this.hasMany(Rating, {
        foreignKey: "book_id",
        sourceKey: "bookId",
        as: "ratings",
      });
    }
  }
  Book.init(
    {
      bookId: {
        type: DataTypes.NUMBER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "active",
      },
      QRcodeImg: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      category: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      sku: {
        type: DataTypes.STRING(15),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title2: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      short_description: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      desc2: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
      },
      width: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      height: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      author: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      instock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please enter the number of quantity",
          },
          isInt: { msg: "Must be an integer number" },
          min: {
            args: [[0]],
            msg: "Value must be greater than zero",
          },
        },
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Please enter the number of price",
          },
          isInt: { msg: "Price must be an integer number" },
          min: {
            args: [0],
            msg: "Price must be greater than zero",
          },
        },
      },
      publisher: {
        type: DataTypes.INTEGER,
        allowNull: true,
        // validate: {
        //   notEmpty: {
        //     msg: "Couldnot be empty"
        //   }
        // }
      },
      publicOfYear: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          // checkValidYear(value) {
          //   if (value - new Date().getFullYear()) {
          //     throw new Error("Invalid public year");
          //   }
          // }
          min: {
            args: [1],
            msg: `Invalid year, year must be positive number}`,
          },
          // max: {
          //   args: [new Date().getFullYear()],
          //   msg: `Invalid year`
          // }
        },
      },
      img: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      comment: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      stars: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      discount: {
        type: DataTypes.INTEGER,
        defaultValue: null,
        validate: {
          min: 1,
          max: 99,
        },
      },
      start_time: {
        type: DataTypes.DATE,
        defaultValue: null,
      },
      end_time: {
        type: DataTypes.DATE,
        defaultValue: null,
      },
      enable_discount: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      bestbook: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      total_rate: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "Book",
      tableName: "books",
    }
  );
  return Book;
};
