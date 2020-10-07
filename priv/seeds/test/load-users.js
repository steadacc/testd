const User = require('../../../src/models/newsletter')
const Token = require('../../../src/models/token')
const moment = require('moment')

exports.seed = function () {
  // Deletes ALL existing entries
  return User.deleteMany()
    .then(() => {
      return Token.deleteMany().then(() => {
        // Inserts seed entries
        return User.create([
        ])
      })
    })
}
