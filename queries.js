
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

const getById = async (id, tableName) => {
  try {
    //   const result = await client.query(`SELECT * FROM ${tableName}`);
    const result = await client.query(`
      SELECT * FROM ${tableName} WHERE id = $1
       `, [id]);
    return result.rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const insertRow = async (title, image, description, tableName) => {
  try {
    await client.query(`
        INSERT INTO ${tableName} (title, image, description)
        VALUES ($1, $2, $3);
      `, [title, image, description]);
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


const insertUser = async (user_name, img, password, email, tableName) => {
  try {
    await client.query(`
        INSERT INTO ${tableName} (user_name, img, password, email)
        VALUES ($1, $2, $3, $4);
      `, [user_name, img, password, email]);
  } catch (error) {
    console.error(error);
    throw error;
  }
};


const getUserByUserName = async (user_name, table) => {
   
    const result = await client.query(`SELECT * FROM ${table} WHERE user_name = $1`, [user_name]);
    if (result.rows.length > 0) {
      return result.rows[0];
    } else {
      return null;
    }
 
};


module.exports = { getAll, insertRow, deleteRow, getById, insertUser ,getUserByUserName };