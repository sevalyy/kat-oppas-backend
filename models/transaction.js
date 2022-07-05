"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class transaction extends Model {
    static associate(models) {
      transaction.belongsTo(models.reservation, {
        foreignKey: "reservationId",
      });
      transaction.hasOne(models.user, { foreignKey: "fromUserId" });
      transaction.hasOne(models.user, { foreignKey: "toUserId" });
    }
  }
  transaction.init(
    {
      reason: DataTypes.STRING,
      transferedCredits: DataTypes.INTEGER,
      transactionTime: DataTypes.DATEONLY,
    },
    {
      sequelize,
      modelName: "transaction",
    }
  );
  return transaction;
};
