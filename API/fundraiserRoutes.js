const express = require('express')
const router = express.Router()
const Fundraiser = require('../schemas/Fundraiser')

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
 * Fetch one fundraiser by id
 */
router.get('/api/fundraisers/id/:id', (req, res) => {
  const fundraiser = Fundraiser.findById(req.params.id)
  .then(data => {
    res.status(200).send(data)
  })
})

/**
 * Remove one qna by id
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