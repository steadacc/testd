const request = require('request')
const config = require('config')

module.exports = {
  get_company: (company_id) => new Promise((resolve, reject) => {
    request({
      uri: `${config.endpoints.company}/${company_id}`,
      method: 'GET',
      json: true,
      headers: {
        authorization: ''
      }
    }, (err, response) => {
      if (err || response.statusCode >= 400) {

        return resolve(null)
      }
      return resolve(response.body)
    })

  }),

  get_company_by_event: (event_id) => new Promise((resolve, reject) => {
    request({
      uri: `${config.endpoints.company}`,
      method: 'GET',
      json: true,
      headers: {
        authorization: '',
      },
      qs: {event_id: event_id}
    }, (err, response) => {
      if (err || response.statusCode >= 400) {
        return resolve(null)
      }

      return resolve(response.body)
    })
  }),
}
