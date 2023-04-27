"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Province extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ District, Order }) {
      // define association here
      this.hasMany(District, { foreignKey: "id", as: "district" });
      this.belongsToMany(Order, {
        targetKey: "province",
        foreignKey: "id",
        through: "province_orders",
      });
    }
  }
  Province.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Province",
      tableName: "provinces",
      timestamps: false,
    }
  );
  return Province;
};
