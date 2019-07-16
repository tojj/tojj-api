const express = require('express')
const Subscriber = require('../schemas/Subscriber')
const router = express.Router()

router.get('/api/subscribers', (req, res) => {
  const subscribers = Subscriber.find({})
    .exec()
    .then(data => {
      res.status(200).send(data)
    })
})

router.post('/api/subscribers', (req, res) => {
  if(!req.body.email){
    return
  }
  const newSubscriber = new Subscriber({
    email: req.body.email,
    joined: new Date()
  })
  newSubscriber.save(function (err) {
    if (err) {
      next(err)
    } else {
      res.status(200).send();
      console.log(newSubscriber, 'SAVED')
    }
  })
})

module.exports = router