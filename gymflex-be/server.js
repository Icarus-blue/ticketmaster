const express = require("express");
const { protect } = require('./middleware/auth')
const EventModel = require('./models/Events')
require("dotenv").config({ path: "./.env" });
const errorHandler = require("./middleware/error");
const session = require("express-session");
const connectDB = require("./config/db");
const { adminBro, adminRoute } = require("./config/adminBro");
const path = require("path");
const axios = require('axios')
const fs = require("fs");
const { Telegraf } = require('telegraf')
const dotenv = require('dotenv')
const EventRouter = require('./routes/events')

const {
  app, serve, io
} = require('./config/app.config')
const cors = require("cors");
const User = require("./models/User");

dotenv.config()

const bot = new Telegraf(process.env.TEL_BOT_TOKEN);

app.use(adminBro.options.rootPath, adminRoute);

var corsOptions = {
  origin: process.env.FRONTEND_URL || "*",
  credentials: true,
};
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "your-secret-key",
    resave: false, // add this line to define the resave option
    saveUninitialized: false,
    cookie: { secure: true },
  })
);



app.get("/", (req, res, next) => {
  const data = req.body
  res.send("Fitnest api running!");
  next()
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/user"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/question", require("./routes/question"));
app.use("/api/meal-plan", require("./routes/mealPlan"));
app.use("/api/workout", require("./routes/workout"));
app.use("/api/chat", require("./routes/chat"));
app.use("/api/message", require("./routes/message"));
app.use("/api/admin/coach", require("./routes/admin/coach"));
app.use("/api/gym", require("./routes/gym"));
app.use("/api/payment", require("./routes/payment"));
app.use("/api/activity", require("./routes/activity"));
app.use('/api/admin/payment', require('./routes/admin/paymentadmin'));
// app.use("/api/gym", require("./routes/gym"));

const apiKey = '721b67cd9cca90da0ca1cc2cbf286d4e9d4d1558'

app.get("/api/images/uploads/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "/uploads", filename);
  // Check if the file exists
  if (fs.existsSync(filePath)) {
    // Stream the file back as the response
    res.sendFile(filePath);
  } else {
    // Return a 404 error if the file doesn't exist
    res.sendStatus(404);
  }
});



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

app.get('/events', protect, async (req, res, next) => {
  try {
    const events = await EventModel.find({ user: req.user._id })
    res.status(200).json(events)
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ message: "failed. Try again" })
  }
})
async function getDocumentsAddedThreeDaysAgo() {
  try {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const result = await EventModel.find({
      createdAt: {
        $gte: threeDaysAgo.toISOString(),
      }
    });

    return result
  } catch (error) {
    console.error('Error:', error.message);
  } 
}

app.get("/live-drops", async (req, res, next) => {
  try {
    const liveDrops = await getDocumentsAddedThreeDaysAgo()
    if (!liveDrops) throw new Error()
    res.status(200).json({ status: true, liveDrops })
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ message: "failed. Try again" })
  }
})

app.delete('/events', protect, async (req, res, next) => {
  try {
    const data = JSON.parse(req.headers.data)
    if (!req.headers.data) return res.status(400).json({ message: "provide data to delete" })
    await EventModel.deleteMany({ _id: data })
    return res.status(200).json({ status: true, message: "deleted successfully" })
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ message: "failed. Try again" })
  }
})

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

app.post("/add-watch", protect, async (req, res, next) => {
  try {
    let event = await EventModel.findOne({ _id: req.body._id })
    if (!event) return res.status(404).json({ status: false, message: "Event not found" })

    await EventModel.findOneAndUpdate({ _id: req.body._id }, {
      $push: {
        watches: {
          ticketType: req.body.ticketType,
          blockedType: req.body.blockedType,
          quantity: req.body.quantity,
          section: req.body.section,
          priceLevel: req.body.priceLevel,
        }
      }
    })

    event = await EventModel.findOne({ _id: req.body._id })

    res.status(201).json({
      status: true,
      message: 'watch created successfully',
      event
    })
  } catch (error) {
    console.log('error', error.message)
    res.status(500).json({ message: "An error occurred" })
  }
})

app.post('/delete-watch', protect, async (req, res, next) => {
  try {
    console.log(req.body)
    const event = await EventModel.findByIdAndUpdate({ _id: req.body.eventId }, {
      $pull: {
        watches: { _id: req.body.watchId }
      }
    })
    event.watches = event.watches.filter(watch => watch?._id !== req.body._id)
    await event.save()
    console.log(event)
    res.status(200).json({ status: true, message: 'deleted successfully' })
  } catch (error) {
    console.log('error', error.message)
    res.status(500).json({ message: "An error occurred" })
  }
})

app.get('/events/:id', async (req, res, next) => {
  try {
    const event = await EventModel.findById(req.params.id)
    if (!event) return res.status(404).json({ status: false, message: 'event not found' })
    res.status(200).json({
      status: true,
      event
    })
  } catch (error) {
    console.log('error', error.message)
    res.status(500).json({ message: "An error occurred" })
  }
})

app.put('/events/:id', async (req, res, next) => {
  try {
    let event = await EventModel.findById(req.params.id)
    if (!event) return res.status(404).json({ status: false, message: 'event not found' })

    event = await EventModel.findOneAndUpdate(event._id, { ...req.body })
    res.status(200).json({
      status: true,
      message: 'updated',
      event
    })
  } catch (error) {
    console.log('error', error.message)
    res.status(500).json({ message: "An error occurred" })
  }
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
    console.log('done scraping!')

  }

}

let onlineUsers;
onlineUsers = [];

io.on("connection", (socket) => {
  console.log("socket server is running");
  socket.on('joining', (data) => {
    onlineUsers = [...onlineUsers, Object.assign(Object.assign({}, data.user), { socketId: socket.id })];
    console.log("onlineUsers", onlineUsers);
    socket.broadcast.emit("onlineusers", { onlineUsers: onlineUsers });
  });
  socket.on("message", (message) => {
    const receiver = onlineUsers.find((user) => user.id === message.receiver);
    if (receiver) {
      socket.to(receiver.socketId).emit("message", message);
    }
  });
  socket.on('sendFriendRequest', (data) => {
    const receiver = onlineUsers.find((user) => user.id === data.receiptantID);
    if (receiver) {
      console.log(receiver.socketId);
      socket.to(receiver.socketId).emit("sendFriendRequest", { id: data.senderID, name: data.sendername });
    }
  });
  socket.on("acceptedFriendrequest", (data) => {
    const receiver = onlineUsers.find((user) => user.id === data.senderid);
    if (receiver) {
      console.log(receiver.socketId);
      socket.to(receiver.socketId).emit("acceptedFriendrequest", { id: data.userid, name: data.username });
    }
  });
  socket.on("declineFriendrequest", (data) => {
    const receiver = onlineUsers.find((user) => user.id === data.senderid);
    if (receiver) {
      console.log(receiver.socketId);
      socket.to(receiver.socketId).emit("declinedFriendrequest", { id: data.userid, name: data.username });
    }
  });
  socket.on("typing", () => {
    const user = onlineUsers.find((user) => user.socketId === socket.id);
    if (user) {
      socket.broadcast.emit("typing", user.name);
    }
  });
  socket.on("stop typing", () => {
    const user = onlineUsers.find((user) => user.socketId === socket.id);
    if (user) {
      socket.broadcast.emit("stop typing", user.name);
    }
  });
  socket.on("disconnect", () => {
    console.log("socket left: ", socket.id);
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    socket.broadcast.emit("onlineusers", { onlineUsers: onlineUsers });
  });
  socket.on("offer", (data) => {
    console.log(data);
    socket.broadcast.emit("offer", data);
  });
  socket.on("answer", (data) => {
    socket.broadcast.emit("answer", data);
  });
  socket.on("ice-candidate", (data) => {
    socket.broadcast.emit("ice-candidate", data);
  });
});