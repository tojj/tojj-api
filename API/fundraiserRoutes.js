const express = require('express')
const Fundraiser = require('../schemas/Fundraiser')

const router = express.Router()

/**
 * Get all fundraisers
 */
router.get('/api/fundraisers', (req, res) => {
  const fundraisers = Fundraiser.find({})
    .exec()
    .then(data => {
      res.status(200).send(data)
    })
})

/**
 * Fetch first fundraiser
 */
router.get('/api/fundraisers/first', (req, res) => {
  const fundraiser = Fundraiser.findOne({})
    .exec()
    .then(data => {
      res.status(200).send(data)
    })
})

/**
 * Create new fundraiser
 */
router.post('/api/fundraisers', (req, res) => {
  const fundraiser = new Fundraiser(req.body.content)
  fundraiser.save(function (err) {
    if (err) {
      next(err)
    } else {
      res.status(200).send();
      console.log(fundraiser, 'SAVED')
    }
  })
})

/**
 * Fetch one fundraiser by id
 */
router.get('/api/fundraisers/id/:id', (req, res) => {
  const fundraiser = Fundraiser.findById(req.params.id)
  .then(data => {
    res.status(200).send(data)
  })
})

/** 
 * Edit one Fundraiser
 */
router.put('/api/fundraisers/id/:id/edit', async (req, res) => {
  let fundraiser = await Fundraiser.findById(req.params.id)
  fundraiser.name = req.body.content.name
  fundraiser.desc = req.body.content.desc
  fundraiser.image = req.body.content.image
  fundraiser.link = req.body.content.link
  fundraiser.save(function (err) {
    if (err) {
      next(err)
    } else {
      res.status(200).send()
    }
  })
})

/**
 * Remove one fundraiser by id
 */
router.delete('/api/fundraisers/id/:id/delete', async (req, res) => {
  const fundraiser = await Fundraiser.findById(req.params.id)
  fundraiser.delete(function (err) {
    if (err) {
      next(err)
    } else {
      res.status(200).send();
    }
  })
})



module.exports = router;