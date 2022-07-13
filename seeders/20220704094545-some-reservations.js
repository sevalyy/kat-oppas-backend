"use strict";
const { REV_STATUS_CREATED } = require("../config/constants");
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "reservations",
      [
        {
          startDate: "2022-08-17",
          endDate: "2022-08-19",
          description: "for my lovely cat, I'm looking for a host for 3 days",
          status: REV_STATUS_CREATED,
          latitude: 52.34,
          longitude: 4.86,
          imageUrl: "https://cataas.com/cat?width=300",

          createdAt: new Date(),
          updatedAt: new Date(),
          requesterUserId: 1,
          providerUserId: null,
        },
        {
          startDate: "2022-07-17",
          endDate: "2022-07-17",
          description: "is there somebody to take care of my cat for 1 days",
          status: REV_STATUS_CREATED,
          latitude: 52.35,
          longitude: 4.87,
          imageUrl: "https://cataas.com/cat?width=300",

          createdAt: new Date(),
          updatedAt: new Date(),
          requesterUserId: 3,
          providerUserId: null,
        },
        {
          startDate: "2022-08-10",
          endDate: "2022-08-13",
          description:
            "my cat has fooding and water device. he just needs some cuddle",
          status: REV_STATUS_CREATED,
          latitude: 52.35,
          longitude: 4.88,
          imageUrl: "https://cataas.com/cat?width=300",

          createdAt: new Date(),
          updatedAt: new Date(),
          requesterUserId: 2,
          providerUserId: null,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("reservations", null, {});
  },
};
