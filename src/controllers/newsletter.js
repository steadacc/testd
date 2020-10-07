const { compose, bind, tap, prop, assoc, mergeDeepLeft, ifElse, map, identity } = require('ramda')
const config = require('config')
const repo = require('../models/repo/newsletter')
const input = require('../input-filters/newsletter')
const error = require('../views/error')
const view = require('../views/user')

// AUTH
const auth = require('@wdalmut/mini-auth')
const forward = require('@wdalmut/forward-auth')
const { is_role_superadmin, if_one_of_allowed_roles, is_admin_or_super } = require('../auth')

// UTILITIES
const { create_filters, append_headers } = require('../utilities/pagination')
const limit = require('p-limit')(5)

const list = (req, res) => {
  let params = compose(
    mergeDeepLeft(req.query),
    assoc('page', 1),
    assoc('limit', 25),
    assoc('orderBy', 'created_at'),
    assoc('order', 'ASC')
  )({})

  Promise.resolve(req.user)
    .then((user) => {
      if (user.role === 'ROLE_EVENT_ADMIN') {
        req.query.event_id = user.event_id
      }
      return req.quuery
    })
    .then((params) => repo.list(params))
    .then(create_filters(params))// ASSOC OFFSET E LIMIT AL RISULTATO DA PASSARE AD APPEND HEADERS(PER SETTARE I VARI CUSTOM HEADERS)
    .then(tap(append_headers(res)))
    .then(prop('docs'))
    .then(compose(bind(res.json, res), identity))
    // .then(compose(bind(res.json, res), view.many))
    .catch(error.generic(res))
}

// const create = (req, res) => {
//   repo
//     .create(req.body, req.user)
//     .then(user => send_to_topic('user_create', {user}).then(() => user))
//     .then(compose(bind(res.status(201).json, res), view.one))
//     .catch(error.generic(res))
// }

// const delete_user = (req, res) => {
//   repo
//     .get(req.params.id)
//     .then(user => {
//       return res.status(200).json(view.one(user))
//     })
//     .catch(error.generic(res))
// }

let users = require('express').Router()

users.get('/',
  // auth(forward(`${config.endpoints.user}/me`)),
  // if_one_of_allowed_roles(['ROLE_SUPERADMIN', 'ROLE_ADMIN', 'ROLE_EVENT_ADMIN']),
  input.validate_newsletter_input,
  list
)

// users.post('/',
//   auth(forward(`${config.endpoints.user}/me`)),
//   if_one_of_allowed_roles(['ROLE_SUPERADMIN', 'ROLE_ADMIN']),
//   input.validate_create_newsletter_input,
//   create
// )

// users.patch('/:id',
//   auth(forward(`${config.endpoints.user}/me`)),
//   input.validate_patch_newsletter_input,
//   patch
// )

// users.delete('/:id',
//   auth(forward(`${config.endpoints.user}/me`)),
//   ifElse(is_role_superadmin, input.validate_delete_user_input_superadmin, input.validate_delete_user_input),
//   delete_user
// )

// users.post('/password/retrieve',
//   input.validate_user_password_retrieve_input,
//   password_retrieve
// )

// users.post('/password/retrieve/complete',
//   input.validate_user_password_retrieve_complete_input,
//   password_retrieve_complete
// )

// users.post('/password/retrieve/complete',
//   input.validate_user_password_retrieve_complete_input,
//   password_retrieve_complete
// )

module.exports = users
