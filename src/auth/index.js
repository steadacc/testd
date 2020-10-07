const {compose, equals, path, ifElse, anyPass, map, curry} = require('ramda')

const is_role_superadmin = compose(equals('ROLE_SUPERADMIN'), path(['user', 'role']))
const is_role_admin = compose(equals('ROLE_ADMIN'), path(['user', 'role']))
const is_role_user = compose(equals('ROLE_USER'), path(['user', 'role']))

const forbidden = {message: 'Forbidden'}

const is_role = role => compose(equals(role), path(['user', 'role']))
const is_one_of_roles = compose(anyPass, map(is_role))

const is_admin_or_super = (req) => {
  if (req.user.role === 'ROLE_ADMIN' || req.user.role === 'ROLE_SUPERADMIN') {
    return true
  }
  return false
}

// Middleware
const if_one_of_allowed_roles = curry((roles, req, res, next) => ifElse(is_one_of_roles(roles), () => next(), () => res.status(403).json(forbidden))(req))

module.exports = {
  is_role_superadmin,
  is_role_admin,
  is_role_user,
  if_one_of_allowed_roles,
  is_admin_or_super
}
