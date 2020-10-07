module.exports = {
  bad_request: (err) => {
    return {message: err.message}
  },
  not_found: (entity) => {
    return {message: `${entity} not found`}
  },
  generic: (res) => (err) => {
    return res
      .status(err.status || 500)
      .json({message: err.message})
  },
  // custom: (res) => (err) => {
  //   return res
  //     .status(err.status || 500)
  //     .json({
  //       custom_error_code: err.custom_error_code,
  //       custom_obj_reference: err.custom_obj_reference,
  //     })
  // },
}
