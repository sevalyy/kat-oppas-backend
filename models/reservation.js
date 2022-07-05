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
      startDate: { type: DataTypes.DATEONLY, allowNull: false },
      endDate: { type: DataTypes.DATEONLY, allowNull: false },
      description: { type: DataTypes.STRING, allowNull: false },
      status: DataTypes.INTEGER,
      latitude: { type: DataTypes.DOUBLE, allowNull: false },
      longitude: { type: DataTypes.DOUBLE, allowNull: false },
    },
    {
      sequelize,
      modelName: "reservation",
    }
  );
  return reservation;
};
