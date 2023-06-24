const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const shortened_url = require('./modules/shortened_url')

router.use('/', home)
router.use('/shortened_url', shortened_url)

module.exports = router