const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

module.exports = {
  PORT: process.env.PORT || 4000,
  DB_PATH: process.env.DB_PATH || path.resolve(__dirname, '../database/carolina_sweet.db'),
  NODE_ENV: process.env.NODE_ENV || 'development'
};
