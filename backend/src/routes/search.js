const express = require('express')
const router = express.Router()
const controller = require('../controllers/search')

router.get('/search', controller.search)

module.exports = router
