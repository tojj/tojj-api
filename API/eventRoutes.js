const express = require('express')
const bcrypt = require('bcrypt')

const { salt } = require('../config/settings.json')
const Event = require('../schemas/Event')
const Fundraiser = require('../schemas/Fundraiser')

const router = express.Router()

/**
 * Fetch all availale Events
 */

router.get('/api/events', async (req, res) => {
  Event.find({})
    .exec()
    .then(data => {
      res.status(200).send(data)
    })
})

/**
 * All events with population
 */
router.get('/api/events/populated', (req, res) => {
  Event.find().populate("product").populate("fundraiser").exec()
    .then(data => {
      res.status(200).send(data)
    })
})



/**
 * Find one populated event with eventlink
 */
router.get('/api/events/populated/:eventlink', (req, res) => {
  Event.findOne({ "link": req.params.eventlink }).populate("product").populate("fundraiser").exec()
    .then(data => {
      res.status(200).send(data)
    })
})

/**
 * Find one by link and compare input with event password - return true if match
 */

router.get('/api/events/populated/:eventlink/login', async (req, res) => {
  const event = await Event.findOne({ "link": req.params.eventlink }).exec()
  bcrypt.compare(req.query.input + salt, event.password)
    .then(data => {
      res.status(200).send(data)
    })
})

/**
 * Creates an event
 */
router.post('/api/events', async (req, res) => {
  const firstFundraiser = await Fundraiser.findOne({}).exec()  
  const event = new Event({
    title: req.body.title,
    child: req.body.child,
    age: req.body.age,
    image: req.body.image,
    desc: req.body.desc,
    date: req.body.date,
    rsvp: req.body.rsvp,
    location: {
      street: req.body.location.street,
      zipcode: req.body.location.zipcode,
      city: req.body.location.city
    },
    swish: {
      number: "0708358158",
      amount: req.body.swish.amount,
      color: "#4762b7"
    },
    donate: req.body.donate,
    fundraiser: req.body.fundraiser ? req.body.fundraiser : firstFundraiser._id,
    attending: [],
    product: req.body.product,
    link: req.body.link,

    guestUser: {
      firstName: req.body.guestUser.firstName,
      lastName: req.body.guestUser.lastName,
      email: req.body.guestUser.email,
      phoneNumber: req.body.guestUser.phoneNumber,
      address: req.body.guestUser.address,
      zipcode: req.body.guestUser.zipcode,
      city: req.body.guestUser.city
    },
    password: req.body.password
  })
  event.save(function (err) {
    if (err) {
      console.log(err)
      next(err)
    } else {
      res.status(200).send();
      console.log(event, 'SAVED')
    }
  })
})

/**
 * Get first event
 */
router.get('/api/events/first', (req, res) => {
  Event.findOne({})
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
  event.password = req.body.content.password
  event.attending = req.body.content.attending
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
 * Event invite update
 */
router.put('/api/events/id/:id/invites', async (req, res) => {
  let event = await Event.findById(req.params.id)
  event.invited = req.body.invited
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