"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let fake_data = [];
    for (let i = 1; i < 121; i++) {
      //order id từ 1 đến 120
      let bookId = [];
      for (let j = 0; j < 3; j++) {
        let book_id = Math.floor(Math.random() * 86) + 1;
        while (bookId.find((item) => item === book_id)) {
          book_id = Math.floor(Math.random() * 86) + 1;
        }
        let data = {
          order_id: i,
          book_id,
          quantity: Math.floor(Math.random() * 2) + 1,
        };
        bookId.push(book_id);
        fake_data.push(data);
      }
    }

    await queryInterface.bulkInsert("order_details", fake_data, {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("order_details", null, {});
  },
};
