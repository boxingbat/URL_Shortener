const express = require('express')
const router = express.Router()
const URL = require('../../models/url')

//home
router.get('/', (req, res)=>{
    return res.render('index')
})  
  router.get('/:shortened_url', (req, res) => {
    const shortened_url = req.params.shortened_url
  
    URL.findOne({ shortened_url })
        .lean()
        .then(url => {
          res.redirect(url.origin_url)
        })
        .catch(error => console.log(error))
  })

module.exports = router