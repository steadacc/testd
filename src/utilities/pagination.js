const {compose, curry, assoc, clamp} = require('ramda')

const append_headers = curry((res, params) => {

  let to = ((params.page - 1) * params.limit) + params.docs.length
  let from = clamp(0, to, ((params.page - 1) * params.limit + 1))

  return res
    .set('x-total', params.total)
    .set('x-page', params.page)
    .set('x-count', params.docs.length)
    .set('x-limit', params.limit)
    .set('x-from', from)
    .set('x-to', to)
})

const create_filters = curry((params, results) => {
  return compose(
    assoc('offset', (parseInt(params.page) - 1) * parseInt(params.limit)),
    assoc('limit', parseInt(params.limit)),
    assoc('page', parseInt(params.page))
  )(results)
})

module.exports = {
  append_headers,
  create_filters,
}
