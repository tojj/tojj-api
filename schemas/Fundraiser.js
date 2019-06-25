const mongoose = require("mongoose")
const Schema = mongoose.Schema

let fundraiserSchema = new Schema({
  name:   { type: String, required: true },
  desc:   { type: String },
  image:  { type: String, required: true, unique: true },
  link:   { type: String }
})



module.exports = mongoose.model("Fundraiser", fundraiserSchema)