const express = require('express')
const router = express.Router()
const Qna = require('../schemas/Qna')

/**
 * Fetch all availale Qnas
 */
router.get('/api/qna', async (req, res) => {
  const qnas = Qna.find({})
    .exec()
    .then(data => {
      res.status(200).send(data)
    })
})

/**
 * Fetch specific limited amount of Qnas
 */
router.get('/api/qna/sorted', (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit,10) : 5
  const Faq = Qna.find().limit(limit).sort({counter: -1}).exec()
  .then(data => {
    res.status(200).send(data)
  })
})

/**
 * Fetch first qna
 */
router.get('/api/qna/first', (req, res) => {
  const qnas = Qna.findOne({})
    .exec()
    .then(data => {
      res.status(200).send(data)
    })
})

/**
 * Create new qna
 */
router.post('/api/qna', (req,res) => {
  
})

/**
 * Fetch one qna by id
 */
router.get('/api/qna/id/:id', (req, res) => {
  const qna = Qna.findById(req.params.id)
  .then(data => {
    res.status(200).send(data)
  })
})

/**
 * Add one to counter on opened Qna
 */
router.put('/api/qna/id/:id/read', async (req, res) => {
  const qna = await Qna.findById(req.params.id)
  qna.counter++
  qna.save(function (err) {
    if (err) {
      next(err)
    } else {
      res.status(200).send();
    }
  })
})

/**
 * Remove one qna by id
 */
router.delete('/api/qna/id/:id/delete', async (req, res) => {
  const qna = await Qna.findById(req.params.id)
  qna.delete(function (err) {
    if (err) {
      next(err)
    } else {
      res.status(200).send();
    }
  })
})

module.exports = router;
