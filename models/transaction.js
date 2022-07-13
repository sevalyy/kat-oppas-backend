"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class transaction extends Model {
    static associate(models) {
      transaction.belongsTo(models.user, {
        foreignKey: "reservationId",
      });
    }
  }
  transaction.init(
    {
      reason: DataTypes.STRING,
      creditsChange: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "transaction",
    }
  );
  return transaction;
};
