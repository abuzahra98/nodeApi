const { Client } = require('pg');
const client = new Client({
  host: '144.76.131.189',
  port:'8083',
  database: 'postgres',
  user:'postgres',
  password:'postgres'

});

client.connect((error) => {
    if (error) throw error;
    console.log('Connected to the database');
  });

module.exports = {
  client,
};