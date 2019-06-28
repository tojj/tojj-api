const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../schemas/User')
const {salt} = require('../config/settings.json')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session);

const router = express.Router()

router.post('/api/login', async (req, res) => {
  let data = req.body.data
  let user = await User.findOne({ "email": req.body.data.email })
  if (!user) {
    res.json({ error: 'No such user!' })
    return
  }
  // compare the password sent in the request (data.password)
  // with the encrypted password stored in the db (user.password)
  let match = await bcrypt.compare(data.password + salt, user.password)
  if (!match) {
    res.json({ error: 'The password does not match!' })
    return
  } 
  req.session.user = user
  // save changes to session
  req.session.save()
  // successfully logged in!
  res.json({ loggedIn: true })
})

router.get('/api/login', (req, res) => {
  if (!req.session.user) {
    res.json({ error: 'Not logged in!' })
    return
  }
  res.json({ email: req.session.user.email })
})


router.delete('/api/login/*', (req, res) => {
  delete req.session.user
  req.session.save()
  res.json({ loggedOut: true })
})


module.exports = router;