const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const isTest = process.env.NODE_ENV === 'test' || 
               process.env.npm_lifecycle_event === 'test' || 
               process.argv.some(arg => arg.includes('test'));

const defaultDbName = isTest ? 'carolina_sweet_test.db' : 'carolina_sweet.db';

module.exports = {
  PORT: process.env.PORT || 4000,
  DB_PATH: process.env.DB_PATH || path.resolve(__dirname, `../database/${defaultDbName}`),
  NODE_ENV: process.env.NODE_ENV || (isTest ? 'test' : 'development'),
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173',
  AUTH_REQUIRED: process.env.AUTH_REQUIRED === 'true'
};
