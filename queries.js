
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

const getById = async (auther_id, tableName) => {
  try {
    //   const result = await client.query(`SELECT * FROM ${tableName}`);
    const result = await client.query(`
      SELECT * FROM ${tableName} WHERE auther_id = $1
       `, [auther_id]);
    return result.rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const insertRow = async (title, image, tableName) => {
  try {
    await client.query(`
        INSERT INTO ${tableName} (title, image)
        VALUES ($1, $2);
      `, [title, image]);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const deleteRow = async (bookId, tableName) => {
  try {
    await client.query(`DELETE FROM ${tableName} WHERE id = $1`, [bookId]);
    console.log(bookId, 'deleted');
  } catch (error) {
    console.error(error);
    throw error;
  }
};


module.exports = { getAll, insertRow, deleteRow, getById };