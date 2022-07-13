"use strict";
const { Model } = require("sequelize");
const reservation = require("./reservation");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    static associate(models) {
      user.hasMany(models.reservation, {
        foreignKey: "providerUserId",
        as: "provider",
      });
      user.hasMany(models.reservation, {
        foreignKey: "requesterUserId",
        as: "requester",
      });
    }
  }
  user.init(
    {
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, unique: true, allowNull: false },
      telephone: DataTypes.STRING,
      password: { type: DataTypes.STRING, allowNull: false },
      aboutMe: { type: DataTypes.STRING, allowNull: false },

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
