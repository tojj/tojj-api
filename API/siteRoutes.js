const express = require('express')
const SiteSettings = require('../schemas/SiteSettings')
const router = express.Router()

router.get('/api/settings', async (req, res) => {
  const settings = SiteSettings.findOne({})
    .exec()
    .then(data => {
      res.status(200).send(data)
    })
})

router.put('/api/settings/', async (req, res) => {
  let settings = await SiteSettings.findOne()
  settings.active = req.body.active  
  settings.save(function (err) {
    if (err) {
      console.log(err)
      next(err)
    } else {
      res.status(200).send()
    }
  })
})

module.exports = router