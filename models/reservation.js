"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class reservation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      reservation.belongsTo(models.user, { foreignKey: "requesterUserId" });
      reservation.belongsTo(models.user, { foreignKey: "providerUserId" });
      reservation.hasOne(models.transaction);
    }
  }
  reservation.init(
    {
      startDate: DataTypes.DATEONLY,
      endDate: DataTypes.DATEONLY,
      description: DataTypes.STRING,
      status: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "reservation",
    }
  );
  return reservation;
};
