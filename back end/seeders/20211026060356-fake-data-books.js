"use strict";
let databook = require("../data/fakedata.json");
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
      "books",
      [
        {
          updatedAt: "2022-10-10 10:30:10",
          QRcodeImg: "/images/qrcode",
          title: "delelted",
          description:
            "If data is the new oil, then machine learning is the drill. As companies gain access to ever-increasing quantities of raw data, the ability to deliver state-of-the-art predictive models that support business decision-making becomes more and more valuable. In this book, you’ll work on an end-to-end project based around a realistic data set and split up into bite-sized practical exercises. This creates a case-study approach that simulates the working conditions you’ll experience in real-world data science projects. You’ll learn how to use key Python packages, including pandas, Matplotlib, and scikit-learn, and master the process of data exploration and data processing, before moving on to fitting, evaluating, and tuning algorithms such as regularized logistic regression and random forest. Now in its second edition, this book will take you through the end-to-end process of exploring data and delivering machine learning models. Updated for 2021, this edition includes brand new content on XGBoost, SHAP values, algorithmic fairness, and the ethical concerns of deploying a model in the real world. By the end of this data science book, you’ll have the skills, understanding, and confidence to build your own machine learning models and gain insights from real data.",
          width: 100,
          height: 100,
          author: "Stephen Klosterman",
          instock: 100,
          price: 35,
          publisher: "",
          publicOfYear: "2021",
          img: "http://localhost:7000/products/Data-Science-Projects-with-Python.jpg",
          category: 8,
          status: "active",
          createdAt: "2022-10-10 10:30:10",
          discount: 0,
        },
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
    await queryInterface.bulkDelete("books", null, {});
  },
};
