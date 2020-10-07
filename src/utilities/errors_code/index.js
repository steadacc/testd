const {always, compose, bind, not, isNil, ifElse, identity, assoc} = require('ramda')

const reject = bind(Promise.reject, Promise)
const exists = compose(not, isNil)

// 403
const reject_with_403 = compose(reject, always({status: 403, message: 'Forbidden'}))

// 406
const reject_with_406 = compose(reject, always({status: 406, message: 'Not acceptable'}))

// 409
const reject_because_already_exists = compose(reject, always({status: 409, message: 'Already exist'}))
const reject_because_in_use = compose(reject, always({status: 409, message: 'Conflict. Username already in use.'}))

// 404
const reject_because_not_exists = compose(reject, always({status: 404, message: 'Not found'}))

// 403
const reject_because_forbidden = compose(reject, always({status: 403, message: 'Forbidden'}))

// 503
const reject_because_server_unavailable = compose(reject, always({status: 503, message: 'Server unavailable'}))

const if_exists = ifElse(exists, identity, reject_because_not_exists) // 404

const if_already_exists = ifElse(exists, reject_because_already_exists, identity) // 409
const if_already_exists_gdpr = ifElse(exists, reject_because_in_use, identity) // 409

const if_authorized = ifElse(exists, identity, reject_because_forbidden) // 403


module.exports = {
  reject_with_403,
  reject_with_406,
  reject_because_already_exists,
  reject_because_forbidden,
  reject_because_not_exists,
  if_exists,
  if_authorized,
  if_already_exists,
  if_already_exists_gdpr,
  reject_because_server_unavailable,
  exists
}
