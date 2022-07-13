"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "transactions",
      [
        {
          reason: "2 days oppas",
          transferedCredits: 3,
          transactionTime: "2022-08-19",
          createdAt: new Date(),
          updatedAt: new Date(),
          reservationId: 1,
          fromUserId: 1,
          toUserId: 2,
        },
        {
          reason: "10 days oppas",
          transferedCredits: 1,
          transactionTime: "2022-07-17",
          createdAt: new Date(),
          updatedAt: new Date(),
          reservationId: 2,
          fromUserId: 3,
          toUserId: 1,
        },
        {
          reason: "4 days oppas",
          transferedCredits: 4,
          transactionTime: "2022-08-13",
          createdAt: new Date(),
          updatedAt: new Date(),
          reservationId: 3,
          fromUserId: 2,
          toUserId: 3,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("transactions", null, {});
  },
};
