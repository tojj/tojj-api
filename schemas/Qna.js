const mongoose = require("mongoose")
const Schema = mongoose.Schema

let qnaSchema = new Schema({
  question: { type: String, required: true },
  answer:   { type: String },
  counter:  Number,
  category: { type: String, required: true }
})

module.exports = mongoose.model("Qna", qnaSchema)