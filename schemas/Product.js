const mongoose = require("mongoose")
const Schema = mongoose.Schema

let productSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  desc: { type: String, required: true },
  link: { type: String, required: true },
  image: { type: String }
})

module.exports = mongoose.model("Product", productSchema)