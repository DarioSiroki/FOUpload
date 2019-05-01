const Sequelize = require("sequelize");
const path = require("path");
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

const sequelize = new Sequelize(process.env.DB_URI);
sequelize
  .authenticate()
  .then(() => {
    console.log('Connected to MySQL.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
