const mongoose = require("mongoose")
const Schema = mongoose.Schema

let subscriberSchema = new Schema({
  email:      String,
  joined:     Date
})

module.exports = mongoose.model("Subscriber", subscriberSchema)