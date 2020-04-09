const express = require('express')
const router = express.Router()
const search = require('./search')

router.get('/', (req, res) => {
  const protocol = req.protocol
  const host = req.get('host')
  res.status(200).json({
    twitterSearch: `${protocol}://${host}/v1/search`,
  })
})

router.use('/v1', search)

router.use((err, req, res, next) => {
  let status = 500
  let error = err

  if (Array.isArray(error)) {
    status = 400
    error = err[0]
  }

  res.status(status).json({ error })
})

module.exports = router
