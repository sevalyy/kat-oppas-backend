"use strict";
const { SALT_ROUNDS } = require("../config/constants");
const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "users",
      [
        {
          name: "Anne",
          email: "a@a.com",
          telephone: 1234567,
          password: bcrypt.hashSync("a", SALT_ROUNDS),
          createdAt: new Date(),
          updatedAt: new Date(),
          aboutMe: "",
          credits: 5,
          blockedCredits: 0,
        },
        {
          name: "Bo",
          email: "b@b.com",
          telephone: 2345678,
          password: bcrypt.hashSync("b", SALT_ROUNDS),
          createdAt: new Date(),
          updatedAt: new Date(),
          aboutMe: "",

          credits: 5,
          blockedCredits: 0,
        },
        {
          name: "Celine",
          email: "c@c.com",
          telephone: 3456789,
          password: bcrypt.hashSync("c", SALT_ROUNDS),
          createdAt: new Date(),
          updatedAt: new Date(),
          aboutMe: "",

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
