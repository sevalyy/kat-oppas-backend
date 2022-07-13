"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "transactions",
      [
        {
          reason: "For demo purposes, not real",
          creditsChange: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          reservationId: 3,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("transactions", null, {});
  },
};
