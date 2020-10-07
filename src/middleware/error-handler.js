const {trim, join, slice, split, fromPairs, flatten, map, props, prop, chain, path, compose} = require('ramda')

module.exports = (err, req, res, next) => {
  if (path(['error', 'isJoi'], err)) { // we had a joi error, let's return a custom 400 json response
    res.status(400).json({
      type: err.type, // will be 'query' here, but could be 'headers', 'body', or 'params'
      message: err.error.toString(),
      invalid_properties: chain(prop('path'), err.error.details),
      details: (chain(prop('path'), err.error.details).length > 2) ? err.error.details : map(compose(trim, join(' '), slice(1, Infinity), split(' ')), fromPairs(map(compose(flatten, props(['path', 'message'])), err.error.details))),
    })
  } else {
    // pass on to another error handler
    next(err)
  }
}
