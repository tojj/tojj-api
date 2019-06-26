const express = require('express')
const router = express.Router()
const Event = require('../schemas/Event')

/**
 * Fetch all availale Events
 */
router.get('/api/events', async (req, res) => {
  const events = Event.find({})
    .exec()
    .then(data => {
      res.status(200).send(data)
    })
})

/**
 * Get first event
 */
router.get('/api/events/first', (req, res) => {
  const event = Event.findOne({})
  .exec()
  .then(data => {
    res.status(200).send(data)
  })
})

/** 
 * Edit one Event
 */
router.put('/api/events/id/:id/edit', async (req, res) => {
  let event = await Event.findById(req.params.id)
  event.title = req.body.content.title
  event.child = req.body.content.child
  event.age = req.body.content.age
  event.image = req.body.content.image
  event.desc = req.body.content.desc
  event.date = req.body.content.date
  event.rsvp = req.body.content.rsvp
  event.donate = req.body.content.donate
  event.fundraiser = req.body.content.fundraiser
  event.product = req.body.content.product
  event.link = req.body.content.link
  event.location.street = req.body.content.location.street
  event.location.zipcode = req.body.content.location.zipcode
  event.location.city = req.body.content.location.city
  event.swish.amount = req.body.content.swish.amount
  event.swish.number = req.body.content.swish.number
  event.swish.color = req.body.content.swish.color
  event.save(function (err) {
    if (err) {
      console.log(err)
      next(err)
    } else {
      res.status(200).send()
    }
  })
})

/**
 * Find one event
 */
router.get('/api/events/id/:id', (req, res) => {
  const event = Event.findById(req.params.id)
  .exec()
  .then(data => {
    res.status(200).send(data)
  })
})

/**
 * Delete an event
 */
router.delete('/api/events/id/:id/delete', async (req, res) => {
  const event = await Event.findById(req.params.id)
  event.delete(function (err) {
    if (err) {
      next(err)
    } else {
      res.status(200).send();
    }
  })
})

module.exports = router;