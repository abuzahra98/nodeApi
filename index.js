const express = require('express');
const cors = require('cors');
const queries = require('./queries');
const { client } = require('./server');
const { body, validationResult } = require('express-validator');
// Create an express app
const app = express();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
require('dotenv').config()
app.use(cors());
const bodyParser = require('body-parser');
app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send('Welcome on our library Dawood!');
});


//books api ***********************************************************************

// app.get('/books', async (req, res) => {
//   try {
//     const books = await queries.getAll('books');
//     res.json(books);
//   } catch (error) {
//     console.error(error);
//     res.sendStatus(500);
//   }
// });


app.get('/books', authenticateToken, async (req, res) => {
  try {
    const books = await queries.getAll('books');
    res.json(books);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) return res.sendStatus(401); // No token provided

try {
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Invalid token
   
    req.user = user;
    next();
  });
  
} catch (error) {
  
}
}

app.get('/books/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const books = await queries.getById(id, 'books');
    res.json(books);

  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.post('/books', async (req, res) => {
  const { title, image, description } = req.body;
  try {
    await queries.insertRow(title, image, description, 'books');
    res.status(200).json({ response: [{ isSucsess: true }] });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error inserting data into database');
  }
});
// app.post('/users', async (req, res) => {
//   const { user_name  } = req.body;
//   try {
//     await queries.login(user_name , 'users');
//     res.status(200).json({ response: [{ isSucsess: true }] });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error inserting data into database');
//   }
// });

app.delete('/books/:bookId', async (req, res) => {
  const bookId = req.params.bookId;
  try {
    await queries.deleteRow(bookId, 'books');
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});


//auther api ***********************************************************************

app.get('/auther', async (req, res) => {
  try {
    const auther = await queries.getAll('auther');
    res.json(auther);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});



//users api ***********************************************************************


app.post('/users', [
  body('user_name').notEmpty().withMessage('User name is required'),
  body('img').notEmpty().withMessage('Image is required'),
  body('password').notEmpty().withMessage('Password is required'),
  body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { user_name, img, password, email } = req.body;
  try {
    await queries.insertUser(user_name, img, password, email, 'users');
    // res.send('Data inserted into database');
    res.status(200).json({ response: [{ isSucsess: true }] });
  } catch (error) {
    console.error(error);
    res.status(400).json({ errors: [{ msg: 'User already exists' }] });

    // res.status(500).send('Error inserting data into database');
  }
});


app.get('/users', async (req, res) => {
  try {
    const user = await queries.getAll('users');
    res.json(user);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});


app.post('/signin', [
  body('user_name').notEmpty().withMessage('user_name is required').withMessage('Invalid user_name'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { user_name, password } = req.body;
  try {
    const user = await queries.getUserByUserName(user_name, 'users');
    if (!user) {
      return res.status(401).json({ errors: [{ msg: 'user not found' }] });
    }

    // const isMatch = await bcrypt.compare(password, user.password);
    if (!(password === user.password)) {
      return res.status(401).json({ errors: [{ msg: 'user name or password is wrong' }] });
    }
    else {
      const payload = {
        user: {
          id: user.id,
          user_name:user.user_name
        }
      };
      // const secretKey = crypto.randomBytes(32).toString('hex');
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '9d' });
      res.status(200).json({ data: [{ token }] });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});



// Start the server on port 3000 **************************************************

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

