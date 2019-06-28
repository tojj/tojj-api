const express = require('express')
const User = require('../schemas/User')

const router = express.Router()

router.get('/api/users', async (req, res) => {
  const user = User.findOne({})
    .exec()
    .then(user => {
      if (user !== null) {
        res.json(user);
      } else {
        res.sendStatus(404);
      }
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(400);
    });
})


module.exports = router;
