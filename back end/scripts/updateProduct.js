// Helper scripts :D

const { Book } = require('../models');
const updateTest = async () => {
  try {
    for (let i = 1; i < 7612; i++) {
      let book = await Book.findByPk(i);
      if (book) {
        await book.update({
          title2: removeVietnameseTones(book.title),
          desc2: removeVietnameseTones(book.description),
        });
      }
    }
  } catch (error) {}
};
module.exports = {
  updateTest,
};
