const mongoose = require('mongoose')
require('mongoose-type-email')
require('mongoose-type-url')
const uuid = require('node-uuid')
const Schema = mongoose.Schema

const schema = new Schema({
  _id: {type: String, default: uuid.v4},
  name: { type: String, required: true },
  event_id: { type: String  },
  send_at: { type: Date },
  sent_at: { type: Date },
  roles: { type: Array },
  plan_ids: {type: Array },
  type: {type: String, enum: ['GENERIC', 'SPONSOR', 'REMINDER' ], default: 'GENERIC', },
  tested_at: {type: Date},
  created_at: {type: Date},
  edited_at: { type: Date },
  subject: { type: String  },
  body: { type: String  },
  statuses: { type: Array  },
  include_ticket: { type: Boolean  },
  include_sponsors: { type: Number  },
  cta_title: { type: String },
  cta_url: { type: String },
  main_color: { type: String },
}, {collection: 'newsletters'})


module.exports = mongoose.model('Newsletter', schema)
