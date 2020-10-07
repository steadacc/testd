const Newsletter = require('../../../src/models/newsletter')
// const moment = require('moment')
exports.seed = function () {
  // Deletes ALL existing entries
  return Newsletter.deleteMany()
    .then(() => {
      // Inserts seed entries
      return Newsletter.create([
        {
          _id: 'f5a29391-5a59-4488-b01b-1c2ad9800321',
          name: 'name 1',
          event_id: 'abc',
          roles: ['role 1', 'role 2'],
          plan_ids: ['1', '2'],
          send_at: new Date('2021-09-10'),
          sent_at: new Date('2021-09-10'),
          tested_at: new Date('2021-09-10'),
          edited_at: new Date()
        },
        {
          _id: 'f5a29391-5a59-4488-b01b-1c2ad98003212',
          name: 'name 2',
          roles: ['role 1', 'role 2'],
          plan_ids: ['1', '2'],
          event_id: 'abc',
          send_at: new Date('2021-09-10'),
          sent_at: null,
          tested_at: new Date('2021-09-10'),
          edited_at: new Date('2022-09-10')
        },
        {
          _id: 'f5a29391-5a59-4488-b01b-1c2ad98003213',
          name: 'name 3',
          roles: ['role 1', 'role 2'],
          plan_ids: ['1', '3'],
          event_id: 'abc',
          send_at: new Date('2021-09-10'),
          sent_at: null,
          tested_at: new Date('2021-09-10'),
          edited_at: new Date()
        }
      ])
    })
}
