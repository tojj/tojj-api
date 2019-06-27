const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const session = require('express-session')
const MongoStore = require('connect-mongo')(session);
const settings = require('./config/settings.json');
const http = require('http')
const connectToDb = require('./config/db')
const config = require('./config/config')
const userRoutes = require('./API/userRoutes')
const qnaRoutes = require('./API/qnaRoutes')
const fundraiserRoutes = require('./API/fundraiserRoutes')
const productRoutes = require('./API/productRoutes')
const eventRoutes = require('./API/eventRoutes')
const mailRoutes = require('./API/mailRoutes')
const loginRoutes = require('./API/loginRoutes')
const path = require('path')

const TojjServer = () => {
  connectToDb()
  app.use(bodyParser.json());
  app.get('/', (req, res) => res.send('Welcome To Tojj Server'))
  global.salt = settings.salt

  app.use(session({
    secret: settings.cookieSecret,
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
      mongooseConnection: global.db
    })
  }))

  app.use(userRoutes,
    qnaRoutes,
    fundraiserRoutes,
    productRoutes,
    eventRoutes,
    mailRoutes,
    loginRoutes
  )
  
  app.use(express.static(path.join(__dirname, 'build')));

 /* app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  }); */

  const server = http.Server(app)
  server.listen(config.PORT, () => console.log(`Tojj Server is on port ${config.PORT}`))
}


TojjServer()

