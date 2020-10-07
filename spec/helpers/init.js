const mongoose = require('mongoose')
const config = require('config')
const data = require('../../priv/seeds/test/load-users')

mongoose.connect(config.db.host, config.db.options)

const mock = require('mock-require')

mock('../../src/utilities/aws', {
  send_to_topic: (subject, payload) => Promise.resolve({payload, response: {}}),
})

const user_role_admin = {
  id: '1',
  username: 'admin@gmail.com',
  role: 'ROLE_ADMIN',
}
const user_role_user = {
  id: 'f5a29391-5a59-4488-b01b-1c2ad9800321',
  username: 'paolo.verdi@corley.it',
  role: 'ROLE_USER',
}

const user_role_superadmin = {
  id: '3',
  username: 'luca.bianchi@corley.it',
  role: 'ROLE_SUPERADMIN',
}

mock('@wdalmut/forward-auth', (auth) => (req) => {
  const token = (req.headers.authorization).split(' ')[1]
  if (token === 'admin') {
    return Promise.resolve(user_role_admin)
  }
  if (token === 'user') {
    return Promise.resolve(user_role_user)
  }
  if (token === 'superadmin') {
    return Promise.resolve(user_role_superadmin)
  }
  if (!token) {
    return Promise.reject({error: 401, status: "Unauthorized"})
  }
})

mock('../../src/microservices/company', {
  get_company: (token, id) => {
    return Promise.resolve({
      '_id': '94181c77-9f10-4a7d-9443-97195a7715a6',
      'name': 'Corley SRL',
      'status': 'ACTIVE',
      'note': null,
      'logo_url': 'https://immagine.com/2.jpg',
      'event_id': 'fce7d2f0-d85c-4ac2-a755-5491a8aa799e',
      'website_url': 'www.example2.com',
      'external_id': null,
      'created_at': new Date(),
      'edited_at': null,
    })
  },
})

mock('../../src/microservices/event', (event_id) => {
  return Promise.resolve({
    '_id': 'fce7d2f0-d85c-4ac2-a755-5491a8aa799e',
    'name': 'Cloud Conf',
    'start_at': '2020-08-01T10:12:24.993Z',
    'end_at': '2020-09-10T18:12:24.993Z',
    'moderation': true,
    'tags': [],
    'note': null,
    'logo_url': 'https://2020.cloudconf.it/assets/images/logo.png',
    'website_url': 'https://2020.cloudconf.it/',
    'external_id': null,
    'status': 'ACTIVE',
    'streaming': false,
    'chat_general': false,
    'theme_schema': 'Green',
    'redirect_logout': null,
    'created_at': new Date(),
    'edited_at': null,
  })
})

global.db_init = (done) => {
  return data.seed().then(() => done()).catch((err) => {
    if (err) {
      throw err
    }

    done()
  })
}
