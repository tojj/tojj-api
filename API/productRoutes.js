const express = require('express')
const Product = require('../schemas/Product')

const router = express.Router()

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
 * Create new product
 */
router.post('/api/products', (req, res) => {
  const product = new Product(req.body.content)
  if(product.image === ''){
    product.image = '/images/present.png'
  }
  product.save(function (err) {
    if (err) {
      next(err)
    } else {
      res.status(200).send();
      console.log(product, 'SAVED')
    }
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
 * Edit one Product
 */
router.put('/api/products/id/:id/edit', async (req, res) => {
  let product = await Product.findById(req.params.id)
  product.name = req.body.content.name
  product.price = req.body.content.price
  product.desc = req.body.content.desc
  if(product.image === ''){
    product.image = '/images/present.png'
  } else {
    product.image = req.body.content.image
  }
  product.link = req.body.content.link
  product.save(function (err) {
    if (err) {
      next(err)
    } else {
      res.status(200).send()
    }
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