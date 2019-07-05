const mongoose = require("mongoose")
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const { salt } = require('../config/settings.json')

let eventSchema = new Schema({

  title:      { type: String, required: true },
  child:      { type: String, required: true },
  age:        { type: Number, required: true },
  image:      { type: String, required: true },
  desc:       { type: String, required: true },
  date:       Number,
  rsvp:       Number,
  location: { 
    street:   { type: String, required: true },
    zipcode:  { type: String, required: true },
    city:     { type: String, required: true }
  },
  swish: {
    number:   { type: Number },
    amount:   { type: String },
  },
  donate:     { type: Boolean },
  attending:  { type: Array },
  invited:    { type: Array },
  product:    { type: Schema.Types.ObjectId, ref: 'Product' },
  fundraiser: { type: Schema.Types.ObjectId, ref: 'Fundraiser' },
  link: { type: String, unique: true, required: true },

  guestUser: {
    firstName:   { type: String },
    lastName:    { type: String },
    email:       { type: String },
    phoneNumber: { type: String },
    address:     { type: String },
    zipcode:     { type: String },
    city:        { type: String },
  },
  password:      { type: String, required: true }
})

eventSchema.pre('save', async function(){
  // here we replace the password with the encrypted password
  if(this.password.length < 40){
  this.password = await bcrypt.hash(this.password + salt, 10);
  }
})

module.exports = mongoose.model("Event", eventSchema)