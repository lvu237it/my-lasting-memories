const { Sequelize } = require('sequelize-cockroachdb');

const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/../.env` });

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

module.exports = sequelize;
