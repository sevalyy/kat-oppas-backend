"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      transaction.belongsTo(models.reservation, {
        foreignKey: "reservationId",
      });
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
