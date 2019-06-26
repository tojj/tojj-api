const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const connectToDb = require('./config/db')
const config = require('./config/config')
const userRoutes = require('./API/userRoutes')
const qnaRoutes = require('./API/qnaRoutes')
const fundraiserRoutes = require('./API/fundraiserRoutes')
const productRoutes = require('./API/productRoutes')
const eventRoutes = require('./API/eventRoutes')

const TojjServer = () => {
  app.get('/', (req, res) => res.send('Welcome To Tojj Server'))
  app.listen(config.PORT, () => console.log(`Listening on port ${config.PORT}`)
  )
}

app.use(bodyParser.json());
app.use(userRoutes, 
  qnaRoutes, 
  fundraiserRoutes, 
  productRoutes,
  eventRoutes
  )

connectToDb()
TojjServer()
