const {map, pick, over, prop, lens, assoc} = require('ramda')

const fields = [
  'id',
  'username',
  'firstname',
  'lastname',
  'position',
  'contact_phone',
  'contact_email',
  'company_id',
  'avatar_url',
  'status',
  'created_at',
  'edited_at',
  'tos',
  'tos_edited_at',
  'privacy',
  'privacy_edited_at',
  'commercial',
  'commercial_edited_at',
  'third',
  'third_edited_at',
  'fiscal_data',
  'retrieve_hash',
  'retrieve_due',
  'role',
  'company',
  'available',
  'event_id'
]

module.exports = {
  one: pick(fields),
  many: map(pick(fields)),
  login: over(lens(prop('user'), assoc('user')), pick(fields)),
}
