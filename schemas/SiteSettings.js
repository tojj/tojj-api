const mongoose = require("mongoose")
const Schema = mongoose.Schema

let siteSchema = new Schema({
  active:      Boolean,
})

module.exports = mongoose.model("SiteSettings", siteSchema)