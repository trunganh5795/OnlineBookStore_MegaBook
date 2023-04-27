"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let fake_data = [];
    for (let i = 1; i < 31; i++) {
      //user id từ 1 đến 30
      for (let j = 0; j < 4; j++) {
        let data = {
          user_id: i,
          status: "completed",
          payment: Math.floor(Math.random() * 3) + 1,
          total: Math.floor(Math.random() * 100 + 5),
        };
        fake_data.push(data);
      }
    }
    await queryInterface.bulkInsert("orders", fake_data, {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("orders", null, {});
  },
};
