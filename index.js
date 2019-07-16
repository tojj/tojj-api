const express = require('express')
const bodyParser = require('body-parser')
const schedule = require('node-schedule')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const settings = require('./config/settings.json')
const connectToDb = require('./config/db')
const config = require('./config/config')
const userRoutes = require('./API/userRoutes')
const qnaRoutes = require('./API/qnaRoutes')
const fundraiserRoutes = require('./API/fundraiserRoutes')
const productRoutes = require('./API/productRoutes')
const eventRoutes = require('./API/eventRoutes')
const mailRoutes = require('./API/mailRoutes')
const loginRoutes = require('./API/loginRoutes')
const siteRoutes = require('./API/siteRoutes')
const subscriberRoutes = require('./API/subscriberRoutes')
const dailyCheck = require('./mail/schedule')

connectToDb()

const app = express()

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
  loginRoutes,
  siteRoutes,
  subscriberRoutes
)

/**
 * Run email check every day at 11:00
 */
let scheduledCheck =  schedule.scheduleJob('0 0 11 * * *', function(){
  dailyCheck()
});

/**
 * Run email check every day at 13:00
 */
let scheduledCheck2 =  schedule.scheduleJob('0 0 13 * * *', function(){
  dailyCheck()
});

app.listen(config.PORT, () => console.log(`Tojj Server is on port ${config.PORT}`))

