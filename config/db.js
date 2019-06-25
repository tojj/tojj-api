const mongoose = require('mongoose');
const config = require('./config');

const connectToDb = () => {
  mongoose.connect(config.db_host, { useNewUrlParser: true })
      .then(() => console.log('MongoDB connected'))
      .catch(err => console.log(err));
}

module.exports = connectToDb;