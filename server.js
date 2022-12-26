const { Client } = require('pg');
const client = new Client({
  host: 'localhost',
  port:'5432',
  database: 'natasha'
});

client.connect((error) => {
    if (error) throw error;
    console.log('Connected to the database');
  });

module.exports = {
  client,
};