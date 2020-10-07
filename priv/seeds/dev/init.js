/* eslint-disable prefer-promise-reject-errors */
const mongoose = require('mongoose')
const config = require('config')
const data_event_has_user = require('./load-users')
mongoose.connect(config.db.host, config.db.options)
data_event_has_user.seed()
  .then(() => console.log("OKI"))
  .catch((err) => {
    if (err) {
      throw err
    }
    console.log(err)
  })
  .finally(() => {
    mongoose.disconnect()
  })
