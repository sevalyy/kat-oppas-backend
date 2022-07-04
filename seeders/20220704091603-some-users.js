"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "users",
      [
        {
          name: "Anne",
          email: "a@a.com",
          telephone: 1234567,
          password: "a",
          createdAt: new Date(),
          updatedAt: new Date(),
          aboutMe: "",
          imageUrl: "",
          latitude: 52.34,
          longitude: 4.86,
          credits: 5,
          blockedCredits: 0,
        },
        {
          name: "Bo",
          email: "b@b.com",
          telephone: 2345678,
          password: "b",
          createdAt: new Date(),
          updatedAt: new Date(),
          aboutMe: "",
          imageUrl: "",
          latitude: 52.35,
          longitude: 4.87,
          credits: 5,
          blockedCredits: 0,
        },
        {
          name: "Celine",
          email: "c@c.com",
          telephone: 3456789,
          password: "c",
          createdAt: new Date(),
          updatedAt: new Date(),
          aboutMe: "",
          imageUrl: "",
          latitude: 52.35,
          longitude: 4.88,
          credits: 5,
          blockedCredits: 0,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};
