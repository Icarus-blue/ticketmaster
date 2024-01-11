const express = require("express");
const { protect } = require('./middleware/auth')
const EventModel = require('./models/Events')
require("dotenv").config({ path: "./.env" });
const errorHandler = require("./middleware/error");
const session = require("express-session");
const connectDB = require("./config/db");
const axios = require('axios')
const { Telegraf } = require('telegraf')
const dotenv = require('dotenv')

const {
  app, serve, io
} = require('./config/app.config')
const cors = require("cors");
const User = require("./models/User");

dotenv.config()

const bot = new Telegraf(process.env.TEL_BOT_TOKEN);


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true },
  })
);



app.get("/", (req, res, next) => {
  res.send("Fitnest api running!");
  next()
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/user"));
app.use("/", require("./routes/events"));


app.use(errorHandler);

const PORT = process.env.PORT || 5000;

serve.listen(PORT || 5000, async () => {
  console.log(`server is fire on ${PORT}`)
  await connectDB();
})

bot.command('start', async context => {
  try {
    context.reply("Enter your email you signed up with event management system")
    bot.on('text', async ctx => {
      try {
        const email = ctx.message.text
        let user = await User.findOne({ email })
        if (!user) ctx.reply("User not found. Create account first")
        await User.findOneAndUpdate({ email }, { chatId: context.chat.id, userId: context.from.id })
        ctx.reply("Your account has been updated. You will now start receiving notifications")
      } catch (error) {
        console.log("error creatint ids", error.message)
      }
    })
  } catch (err) {
    console.log('error starting bot', err.message)
  }
})

bot.launch()

app.get('/watch', protect, async (req, res, next) => {
  const url = req.query?.url
  if (!url) {

    return res.status(400).json({
      message: "event url is required"
    })
  }
  const result = await watchEvent(url, req.user)
  if (result) {
    let newEvent = await new EventModel(result).save()
    return res.status(200).json({
      status: true,
      message: "Event watched! A message was sent to you through the bot."
    })
  }

  return res.status(500).json({
    status: false,
    message: "An error occured. Check the url or try again"
  })
})


const watchEvent = async (eventUrl, user) => {

  let id = eventUrl.split('/')
  try {

    const res = await axios.get(`https://app.ticketmaster.com/discovery/v2/events/${id.at(-1)}.json?apikey=EZ6bALdFYeGViAbL5HvHYx7hEEnAZpdf`)
    const data = await res.data
    const toSend = `Data available for ${eventUrl}: \n\n\t\t Date to Open: ${data.dates.start.localDate} at ${data.dates.start.localTime}\n\n\t\t sits: ${data?.seatmap?.staticUrl || 'not prepared yet.'}`


    bot.telegram.sendMessage(user.chatId, toSend)
    return {
      name: data.name,
      date: data.dates.start.localDate,
      url: data.url,
      place: `${data._embedded.venues[0]?.name}`,
      user: user._id,
      time: data.dates.start.localTime
    }
  } catch (err) {
    console.log('error scraping: ', err.message)
    return false
  } finally {

  }

}


module.exports = { watchEvent }