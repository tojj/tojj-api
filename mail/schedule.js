const nodemailer = require('nodemailer')
const { mail } = require('../config/config');
const Event = require('../schemas/Event')


async function dailyCheck() {
  await rsvpReminder()
}

/**
  * Find all the events where the rsvp has passed or is today
  */
async function rsvpReminder() {
  let today = new Date()
  today.setHours(12, 0, 0, 0)  //Add 12 hour margin 
  let EventsToSendRsvpReminder = await Event.find({ "rsvp": { $lte: today } })
    .populate('product')
    .populate('fundraiser')
    .exec()

  decideContentAndSend(EventsToSendRsvpReminder)
}

/**
  * Send a reminder email to each party-creator if they already havent had one sent to them.
  */
function decideContentAndSend(events) {

  events.map(event => {
    if (event.rsvpSent) {
      return
    }

    const productPrice = event.product.price
    const contribution = event.swish.amount
    const totalAmount = event.attending.length * contribution
    let message = {
      title: `Kalaset för ${event.child} närmar sig! 🎁`,
      subject: '',
      detailed: ''
    }

    if (totalAmount < productPrice) {
      message = {
        subject: 'Presenten är inte betald!',
        detailed: `Dessvärre har vi inte fått in tillräckligt med betalningar för att täcka produkten du valt, ${event.product.name}. En av följande åtgärder behövs: <br /> <br /> 
        - Betala in resterande belopp genom att swisha ${productPrice - totalAmount} SEK till ${event.swish.number} med meddelandet <span style="font-weight: bold;">${event.link}*</span>. <br /> 
        - Eller avvakta så kommer vi att betala tillbaka det belopp vi mottagit. <br /> <br />
        *Glöm inte att lämna meddelandet "<span style="font-weight: bold;">${event.link}*</span>" då vi annars inte kan koppla betalningen till kalaset.`
      }
    } else if (totalAmount >= productPrice) {
      if (event.donate) {
        message = {
          subject: 'Presenten är betald!',
          detailed: `Hurra! Vi har tagit emot tillräckligt med betalningar för att täcka produkten du valt (${event.product.name}). Då du valt att donera eventuellt överskott till välgörenhet kommer vi att skicka <span style="font-weight: bold;">${(totalAmount - productPrice)} SEK</span> till ${event.fundraiser.name}. Tack så mycket!`
        }
      } else {
        message = {
          subject: 'Presenten är betald!',
          detailed: `Hurra! Vi har tagit emot tillräckligt med betalningar för att täcka produkten du valt (${event.product.name}). Då du inte valt att donera eventuellt överskott till välgörenhet kommer vi att skicka tillbaka <span style="font-weight: bold;">${(totalAmount - productPrice)} SEK</span> till dig. Tack så mycket!`
        }
      }
    }

    const emailTemplate = `<body style="margin: 0; padding: 30px 0; width: 100%; background-color: #fbf7ee;">
      <div style="padding: 30px 50px 50px; text-align: center; background: #fff; max-width: 600px; margin: 0 auto 15px; box-shadow: 0 0 5px 0px rgba(0,0,0,0.4)">
        <h1 style="font-weight: bold; color: #6C80C5; text-transform: uppercase">Kalaset för ${event.child} närmar sig! 🎁</h1>
        <p style="text-align: left; margin-bottom: 20px;">${message.detailed}</p>
        <p style="margin-bottom: 20px">För att se vilka som har meddelat att de kommer, samt se eventuella kommentarer dessa har lämnat, t.ex. allergier, klicka på knappen nedan.</p>
        <p style="margin-bottom: 50px">Vi hoppas att ${event.child} får ett fantastisk firande!</p>
        <a href=${"http//tojj.oddnode.se/bekraftelse/" + event.link} style="word-wrap: none; text-decoration: none; font-size: 16px; font-weight: bold; background: #6C80C5; color: #fff; padding: 15px 30px; border-radius: 100px; opacity: 0.8; margin: 20px 0">TILL KALASET</a>
      </div>
      <div style="padding: 20px 50px; background: #fff; max-width: 600px; margin: 0 auto; box-shadow: 0 0 5px 0px rgba(0,0,0,0.4)">
        <h4 style="font-weight: bold">Vad är Tojj?</h4>
        <p>Ingen mer stress kopplad till kalasfirande! Hos Tojj kan man skapa en digital kalasinbjudan och låta de inbjudna gästerna bidra till en bestämd present till födelsedagsbarnet genom Swish. Enkelt för alla och som grädde på moset kan man välja att bidra till en välgörenhet.</p>
        <a href="http://tojj.oddnode.se/" style="text-decoration: none; color: #6C80C5">Läs mer ></a>
      </div>
    </body>`

    const transporter = nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 465,
      secure: true,
      auth: {
        user: 'apikey',
        pass: mail
      },
      tls: {
        rejectUnauthorized: false
      }
    })

    const mailOptions = {
      from: `"Tojj" <info@tojj.se>`,
      replyTo: 'tojjinfo@gmail.com',
      to: event.guestUser.email,
      subject: message.subject,
      html: emailTemplate
    }

    transporter.sendMail(mailOptions, function (err, res) {
      if (err) {
        console.error('there was an error: ', err);
      } else {
        console.log('here is the res: ', res)
        event.rsvpSent = true
        event.save()

      }
    })
  })
}


module.exports = dailyCheck;