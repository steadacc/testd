const {curry, assoc, reduce, keys, ifElse, isNil, identity, bind, compose} = require('ramda')
const hash = require('crypto')
const Token = require('../models/token')
const {get_company} = require('../microservices/company')
const moment = require('moment')

const if_not_null_convert = curry(ifElse(isNil, identity))

const renameKeys = curry((keysMap, obj) => reduce((acc, key) => assoc(keysMap[key] || key, obj[key], acc), {}, keys(obj)))

const stringify = bind(JSON.stringify, JSON)

const generate_hash = (string) => hash.createHash('sha256').update(string).digest('hex')

const get_token = (user) => {
  const data = {
    user_id: user.id,
    token: generate_hash(String(Math.random() * 1e9)),
    expired_at: moment().add(1, 'y'),
  }
  return Token.create(data)
    .then(token => ({
      access_token: token.token,
      user: user,
    }))
    .then((result) => {
      if (result.user.company_id) {
        return get_company(result.user.company_id)
          .then(company => {
            if (company) {
              result.user = compose(
                assoc('company', company),
                assoc('event_id', company.event_id)
              )(result.user)
              return result
            } else {
              return result
            }
          })
      } else {
        return result
      }
    })
}

module.exports = {
  if_not_null_convert,
  renameKeys,
  stringify,
  generate_hash,
  get_token
}
