const Joi = require('@hapi/joi')
const validator = require('express-joi-validation').createValidator({
  passError: true,
})

exports.validate_newsletter_input = validator.query({
  limit: Joi.number().integer().min(1).max(1000),
  page: Joi.number().integer().min(0).max(25),
  order: Joi.string().valid('ASC', 'DESC'),
  orderBy: Joi.string(),
  name: Joi.string(),
  event_id: Joi.string(),
  roles: Joi.array().items(Joi.string()),
  plan_ids: Joi.array().items(Joi.string()),
  type: Joi.string(),
  subject: Joi.string(),
  statuses: Joi.string(),
  include_ticket: Joi.string(),
  include_sponsors: Joi.string(),
  cta_title: Joi.string(),
  cta_url: Joi.string(),
  main_color: Joi.string(),
  not_sent: Joi.bool()
})

exports.validate_create_newsletter_input = validator.body({
  name: Joi.string().required(),
  event_id: Joi.string().required(),
  roles: Joi.array().items(Joi.string()),
  plan_ids: Joi.array().items(Joi.string()),
  type: Joi.string().valid(['GENERIC', 'SPONSOR', 'REMINDER']),
  subject: Joi.string(),
  statuses: Joi.array().items(Joi.string()),
  include_ticket: Joi.bool(),
  include_sponsors: Joi.number().integer(),
  cta_title: Joi.string(),
  cta_url: Joi.string(),
  main_color: Joi.string(),
})

exports.validate_patch_newsletter_input = validator.body({
  name: Joi.string(),
  event_id: Joi.string(),
  roles: Joi.array().items(Joi.string().valid(['GENERIC', 'SPONSOR', 'REMINDER'])),
  plan_ids: Joi.array().items(Joi.string()),
  type: Joi.string(),
  subject: Joi.string(),
  statuses: Joi.array().items(Joi.string()),
  include_ticket: Joi.bool(),
  include_sponsors: Joi.number().integer(),
  cta_title: Joi.string(),
  cta_url: Joi.string(),
  main_color: Joi.string(),
})
