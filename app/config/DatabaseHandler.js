const Sequelize = require("sequelize");
const keys = require("../credentials/keys");

const sequelize = new Sequelize(keys.dbURI);

sequelize
  .authenticate()
  .then(() => {
    console.log('Connected to MySQL.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
