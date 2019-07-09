const nodemailer = require('nodemailer')
const { mail } = require('../config/config');
// const bcrypt = require('bcrypt')

// const { salt } = require('../config/settings.json')
const Event = require('../schemas/Event')
// const Fundraiser = require('../schemas/Fundraiser')
const emailTemplate = `<body style="margin: 0; padding: 30px 0; width: 100%; background-color: #fbf7ee;">
  <div style="padding: 30px 50px 50px; text-align: center; background: #fff; max-width: 600px; margin: 0 auto 15px; box-shadow: 0 0 5px 0px rgba(0,0,0,0.4)">
    <img src="http://i.imgur.com/0aOsg8B.png" alt="Välkommen på kalas" style="width: 80%; height: auto" />
    <h1 style="font-weight: bold; color: #6C80C5; text-transform: uppercase"></h1>
    <h2 style="font-weight: bold; text-transform: uppercase"></h2>
    <h3 style="font-weight: bold; margin-bottom: 20px; text-transform: uppercase">Kl skit i det</h3>
    <h4 style="font-weight: bold; margin-bottom: 50px"> JESPER ska ha kalas och du är bjuden! Klicka på länken nedan för att svara på om du kommer.</h4>
    <a href="https://google.com/" style="word-wrap: none; text-decoration: none; font-size: 16px; font-weight: bold; background: #6C80C5; color: #fff; padding: 15px 30px; border-radius: 100px; opacity: 0.8; margin: 20px 0">TILL KALASET</a>
  </div>
  <div style="padding: 20px 50px; background: #fff; max-width: 600px; margin: 0 auto; box-shadow: 0 0 5px 0px rgba(0,0,0,0.4)">
    <h4 style="font-weight: bold">Vad är Tojj?</h4>
    <p>Ingen mer stress kopplad till kalasfirande! Hos Tojj kan man skapa en digital kalasinbjudan och låta de inbjudna gästerna bidra till en bestämd present till födelsedagsbarnet genom Swish. Enkelt för alla och som grädde på moset kan man välja att bidra till en välgörenhet.</p>
    <a href="https://google.com/" style="text-decoration: none; color: #6C80C5">Läs mer ></a>
  </div>
</body>`

async function mailListCheck() {
  let today = new Date()
  today.setHours(12, 0, 0, 0)  //Add 12 hour margin 
  let EventsToSendRsvpReminder = await Event.find({ "rsvp": { $lte: today } })
    .populate('product')
    .populate('fundraiser')
    .exec()

  /**
   * Send a reminder email to each party-creator where the rsvp has passed
   */
  console.log('Today ' + EventsToSendRsvpReminder.length + ' Rsvp emails has been sent.');
  
  EventsToSendRsvpReminder.map(event => {
    if(event.rsvpSent){
      return
    }

    const productPrice = event.product.price
    const contribution = event.swish.amount
    const totalAmount  = event.attending.length * contribution
    let message = ''
    console.log(event.link)
    console.log(totalAmount +' SEK');

    if(totalAmount < productPrice){
      message = 'insufficient funds'
    } else if (totalAmount >= productPrice){
      if(event.donate){
        message = 'donating excess amount (' + (totalAmount-productPrice) + ' SEK) to: ' + event.fundraiser.name
        
      } else {
        message = 'You greedy fuck, have a good day. All in order. We will send you back ' + (totalAmount-productPrice) + ' SEK'
        
      }
      
    }

    

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
      to: event.guestUser.email,
      subject: 'Kalaset för ' + event.child + ' närmar sig! 🎁',
      html: message
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


module.exports = mailListCheck;