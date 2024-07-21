"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Booking.init(
    {
      flightId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userID: {
        types: DataTypes.INTEGER,
        allowNull: false,
      },
      status: DataTypes.ENUM,
      allowNull: false,
      values: ["InProgress", "Booked", "Cancelled"],
      defaultValue: "INProgress",
    },
    {
      sequelize,
      modelName: "Booking",
    }
  );
  return Booking;
};
