"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "categories",
      [
        {
          name: "Kinh Tế",
          createdAt: "2022-07-04 10:30:10",
          updatedAt: "2022-07-04 10:30:10",
        },
        {
          name: "Văn Học",
          createdAt: "2022-07-04 10:30:10",
          updatedAt: "2022-07-04 10:30:10",
        },
        {
          name: "Sức Khỏe",
          createdAt: "2022-07-04 10:30:10",
          updatedAt: "2022-07-04 10:30:10",
        },
        {
          name: "Giáo Dục",
          createdAt: "2022-07-04 10:30:10",
          updatedAt: "2022-07-04 10:30:10",
        },
        {
          name: "Thể Thao - Du Lịch",
          createdAt: "2022-07-04 10:30:10",
          updatedAt: "2022-07-04 10:30:10",
        },
        {
          name: "Truyện",
          createdAt: "2022-07-04 10:30:10",
          updatedAt: "2022-07-04 10:30:10",
        },
        {
          name: "Tâm Lý - Giới Tính",
          createdAt: "2022-07-04 10:30:10",
          updatedAt: "2022-07-04 10:30:10",
        },
        // {
        //   name: 'education'
        // },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("categories", null, {});
  },
};
