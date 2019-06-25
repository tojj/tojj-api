const express = require('express')
const router = express.Router()

router.get('/api/users/', async (req, res) => {
  const user = User.findOne({ email: payload.email })
    .exec()
    .then(user => {
      if (user !== null) {
        console.log(user);
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
