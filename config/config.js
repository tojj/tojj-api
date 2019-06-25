const dotenv = require('dotenv')
dotenv.config()

const config = {
  db_host: process.env.MONGO_API,
  mail: process.env.MAIL_API,
  PORT: process.env.SERVER_PORT
}

module.exports = config

