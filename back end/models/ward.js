"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Ward extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ ShippingAddress, District }) {
      // define association here
      this.belongsToMany(ShippingAddress, {
        foreignKey: "address",
        through: "ward_address",
      });
      this.belongsTo(District, { foreignKey: "district_id", as: "district" });
    }
  }
  Ward.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      prefix: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      district_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // references: {
        //     model: 'districts',
        //     key: 'id'
        // },
        // onDelete: 'CASCADE',
        // onUpdate: 'CASCADE'
      },
    },
    {
      sequelize,
      modelName: "Ward",
      tableName: "wards",
      timestamps: false,
    }
  );
  return Ward;
};
