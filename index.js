const express = require('express');
const cors = require('cors');
const queries = require('./queries');
const { client } = require('./server');

// Create an express app
const app = express();
app.use(cors());
const bodyParser = require('body-parser');
app.use(bodyParser.json()); 


app.get('/', (req, res) => {
  res.send('Welcome on our library Dawood!');
});

 
app.get('/books', async (req, res) => {
  try {
    const books = await queries.getAll('books');
    res.json(books);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.get('/auther', async (req, res) => {
  try {
    const auther = await queries.getAll('auther');
    res.json(auther);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.get('/books/:auther_id', async (req, res) => {
  const auther_id = req.params.auther_id;
  try {
    const books = await queries.getById(auther_id,'books');
    res.json(books);

  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.post('/books', async (req, res) => {
  const { title, image } = req.body;
  try {
    await queries.insertRow(title, image, 'books');
    res.send('Data inserted into database');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error inserting data into database');
  }
});

app.delete('/books/:bookId', async (req, res) => {
  const bookId = req.params.bookId;
  try {
    await queries.deleteRow(bookId,'books');
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});




// Start the server on port 3000
const port = process.env.PORT || 443;
app.listen(port, () => {
  console.log(`API listening on port ${port}...`);
});


// client.query(`
//   CREATE TABLE auther (
//     id SERIAL PRIMARY KEY,
//     name TEXT NOT NULL
//   );
// `, (err, res) => {
//   console.log(err, res);
// });
// const createTableSql = `CREATE TABLE books (
//   id SERIAL PRIMARY KEY,
//   auther_id INTEGER REFERENCES auther(id),

//   title TEXT NOT NULL,
//   image TEXT NOT NULL UNIQUE
// )`;

// client.query(createTableSql, (error, result) => {
//   if (error) throw error; 
//   console.log('Table created');
// });

