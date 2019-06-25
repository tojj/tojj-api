const express = require('express')
const router = express.Router()
const Product = require('../schemas/Product')

/**
 * Get all products
 */
router.get('/api/products', (req, res) => {
  const products = Product.find({})
    .exec()
    .then(data => {
      res.status(200).send(data)
    })
})

/**
 * Fetch first product
 */
router.get('/api/products/first', (req, res) => {
  const product = Product.findOne({})
    .exec()
    .then(data => {
      res.status(200).send(data)
    })
})

/**
 * Fetch one product by id
 */
router.get('/api/products/id/:id', (req, res) => {
  const product = Product.findById(req.params.id)
  .then(data => {
    res.status(200).send(data)
  })
})

/**
 * Remove one qna by id
 */
router.delete('/api/products/id/:id/delete', async (req, res) => {
  const product = await Product.findById(req.params.id)
  product.delete(function (err) {
    if (err) {
      next(err)
    } else {
      res.status(200).send();
    }
  })
})

module.exports = router;