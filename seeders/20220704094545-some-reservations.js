"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "reservations",
      [
        {
          startDate: "2022-08-17",
          endDate: "2022-08-19",
          description: "for my lovely cat, I'm looking for a host for 2 days",
          status: 1,
          latitude: 52.34,
          longitude: 4.86,
          imageUrl: "https://cataas.com/cat?width=300",

          createdAt: new Date(),
          updatedAt: new Date(),
          requesterUserId: 1,
          providerUserId: 2,
        },
        {
          startDate: "2022-07-17",
          endDate: "2022-07-27",
          description: "is there somebody to take care of my cat for 10 days",
          status: 2,
          latitude: 52.35,
          longitude: 4.87,
          imageUrl: "https://cataas.com/cat?width=300",

          createdAt: new Date(),
          updatedAt: new Date(),
          requesterUserId: 3,
          providerUserId: 1,
        },
        {
          startDate: "2022-08-10",
          endDate: "2022-08-15",
          description:
            "my cat has fooding and water device. he just needs some cuddle",
          status: 1,
          latitude: 52.35,
          longitude: 4.88,
          imageUrl: "https://cataas.com/cat?width=300",

          createdAt: new Date(),
          updatedAt: new Date(),
          requesterUserId: 2,
          providerUserId: 3,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("reservations", null, {});
  },
};
