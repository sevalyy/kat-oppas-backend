"use strict";
const { Model } = require("sequelize");
const reservation = require("./reservation");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      user.hasMany(models.reservation);
    }
  }
  user.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, unique: true, allowNull: false },
      telephone: DataTypes.INTEGER,
      password: { type: DataTypes.STRING, allowNull: false },
      aboutMe: { type: DataTypes.STRING, allowNull: false },
      imageUrl: { type: DataTypes.STRING, allowNull: false },
      latitude: { type: DataTypes.INTEGER, allowNull: false },
      longitude: { type: DataTypes.INTEGER, allowNull: false },
      credits: DataTypes.INTEGER,
      blockedCredits: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "user",
    }
  );
  return user;
};
