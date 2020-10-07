const request = require('request')
const config = require('config')

module.exports = (event_id) => new Promise((resolve, reject) => {
  request({
    uri: `${config.endpoints.event}/${event_id}`,
    method: 'GET',
    json: true,
    headers: {
      authorization: '',
    },

  }, (err, response) => {

    if (err || response.statusCode >= 400) {
      return reject(err || response.body)
    }

    return resolve(response.body)
  })
})
