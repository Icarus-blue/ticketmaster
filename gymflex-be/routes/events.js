const express = require('express')
const { watchEvent } = require('../server')
const { protect } = require('../middleware/auth')
const EventModel = require('../models/Events')

const router = express.Router()




module.exports = router