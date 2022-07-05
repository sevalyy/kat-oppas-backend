"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "transactions",
      [
        {
          reason: "2 days oppas",
          transferedCredits: 2,
          transactionTime: "2022-08-19",
          createdAt: new Date(),
          updatedAt: new Date(),
          reservationId: 1,
          fromUserId: 1,
          toUserId: 2,
        },
        {
          reason: "10 days oppas",
          transferedCredits: 10,
          transactionTime: "2022-07-27",
          createdAt: new Date(),
          updatedAt: new Date(),
          reservationId: 2,
          fromUserId: 3,
          toUserId: 1,
        },
        {
          reason: "5 days oppas",
          transferedCredits: 5,
          transactionTime: "2022-08-15",
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
