"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await [
      queryInterface.addColumn("reservations", "requesterUserId", {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      }),

      queryInterface.addColumn("transactions", "reservationId", {
        type: Sequelize.INTEGER,
        references: {
          model: "reservations",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      }),
      queryInterface.addColumn("reservations", "providerUserId", {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      }),
      queryInterface.addColumn("transactions", "fromUserId", {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      }),
      queryInterface.addColumn("transactions", "toUserId", {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      }),
    ];
  },

  async down(queryInterface, Sequelize) {
    await [
      queryInterface.removeColumn("reservations", "requesterUserId"),
      queryInterface.removeColumn("transactions", "reservationId"),
      queryInterface.removeColumn("reservations", "providerUserId"),
      queryInterface.removeColumn("transactions", "fromUserId"),
      // queryInterface.removeColumn("transactions", "toUserId"),
    ];
  },
};
