const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const connectToDb = require('./config/db')
const config = require('./config/config')
const routes = require('./API/routes')

const TojjServer = () => {
  app.get('/', (req, res) => res.send('Welcome To Tojj Server'))
  app.listen(config.PORT, () => console.log(`Listening on port ${config.PORT}`)
  )
}

app.use(bodyParser.json());
app.use(routes)

connectToDb()
TojjServer()
