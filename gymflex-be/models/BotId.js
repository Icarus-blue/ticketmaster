const mongoose = require('mongoose')


const BotIdSchema = new mongoose.Schema({
    chatId: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }
})


module.exports = mongoose.model('botids', BotIdSchema)