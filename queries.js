
const { client } = require('./server');

const getAll = async (tableName) => {
    try {
      const result = await client.query(`SELECT * FROM ${tableName}`);
      return result.rows;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  
  const insertBook = async (title, image) => {
    try {
      await client.query(`
        INSERT INTO books (title, image)
        VALUES ($1, $2);
      `, [title, image]);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  
  const deleteBook = async (bookId) => {
    try {
      await client.query('DELETE FROM books WHERE id = $1', [bookId]);
      console.log(bookId, 'deleted');
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  
  module.exports = { getAll, insertBook, deleteBook };