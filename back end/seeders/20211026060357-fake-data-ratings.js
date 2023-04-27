"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let fake_data = [];
    for (let i = 1; i < 20; i++) {
      // for (let z = 0; z < 10; z++) {
      let value = Math.floor(Math.random() * 5) + 1;
      let comment = "";
      if (value == 5) {
        comment = "Excellent";
      } else if (value == 4) {
        comment = "Good";
      } else {
        comment = "Not Good";
      }
      let rating = {
        value: value,
        comment: comment,
        user_id: i,
        book_id: 85626,
      };
      fake_data.push(rating);
      // }
    }
    await queryInterface.bulkInsert("ratings", fake_data, {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("ratings", null, {});
  },
};
