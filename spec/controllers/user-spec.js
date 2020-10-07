/* eslint-disable no-sequences */
/* eslint-disable no-undef */
/* global beforeEach describe it db_init expect */
/* eslint no-undef: 'error' */

const R = require('ramda')
const request = require('supertest')

describe('User action', () => {
  beforeEach(db_init)

  let app

  beforeEach((done) => {
    app = require('../../src')
    done()
  })

  describe('IDENTITY (ME)', () => {
    it('should get user if token is valid', (done) => {
      request(app)
        .get('/v1/me')
        .set('Authorization', 'Bearer user')
        .expect(200)
        .end((err, res) => {
          if (err) {
            throw err
          }

          expect(R.prop('username', res.body)).toEqual('paolo.verdi@corley.it')
          done()
        })
    })

    it('should not get user if token is invalid', (done) => {
      request(app)
        .get(`/v1/me`)
        .set('Authorization', 'Bearer wrongtoken')
        .expect(401)
        .end((err, res) => {
          if (err) {
            throw err
          }

          expect(R.prop('status', res.body)).toEqual(404)
          done()
        })
    })
  })

  describe('LIST', () => {
    it('should list users if not user', (done) => {
      request(app)
        .get('/v1/user?order=ASC&orderBy=username')
        .set('Authorization', 'Bearer admin')
        .expect(200)
        .end((err, res) => {
          if (err) {
            throw err
          }

          expect(R.map(R.pick(['username']), res.body)).toEqual([
            {username: 'gabriele.mittica@corley.it'},
            {username: 'giacomo.bianchi@corley.it'},
            {username: 'luca.bianchi@corley.it'},
            {username: 'mario.rossi@corley.it'},
            {username: 'paolo.verdi@corley.it'},
            {username: 'sonia.montagna@corley.it'}
          ])
          done()
        })
    })

    it('should not list users if user', (done) => {
      request(app)
        .get('/v1/user')
        .set('Authorization', 'Bearer user')
        .expect(403)
        .end((err, res) => {
          if (err) {
            throw err
          }

          expect(R.prop('message', res.body)).toEqual('Forbidden')
          done()
        })
    })

    it('should list users filtered by query params by username', (done) => {
      request(app)
        .get(`/v1/user?username=luca.bianchi@corley.it`)
        .set('Authorization', 'Bearer admin')
        .expect(200)
        .end((err, res) => {
          if (err) {
            throw err
          }

          expect(R.map(R.pick(['username']), res.body)).toEqual([
            {username: 'luca.bianchi@corley.it'},
          ])
          done()
        })
    })
  })

  describe('GET', () => {
    it('should get only my user if i am an user', (done) => {
      request(app)
        .get('/v1/user/f5a29391-5a59-4488-b01b-1c2ad9800321')
        .set('Authorization', 'Bearer user')
        .expect(200)
        .end((err, res) => {
          //    console.log(res.body)
          if (err) {
            throw err
          }

          expect(R.pick(['username'], res.body)).toEqual({username: 'paolo.verdi@corley.it'})
          done()
        })
    })

    it('should not get user if not exists', (done) => {
      request(app)
        .get('/v1/user/f5a29391-5a59-4488-b01b-1c2ad9800322')
        .set('Authorization', 'Bearer admin')
        .expect(404)
        .end((err, res) => {
          if (err) {
            throw err
          }

          expect(R.prop('message', res.body)).toEqual('Not found')
          done()
        })
    })

    it('should not get any other user if user', (done) => {
      request(app)
        .get('/v1/user/ca401c79-0ade-4593-bb4b-acde07335c87')
        .set('Authorization', 'Bearer user')
        .expect(401)
        .end((err, res) => {
          if (err) {
            throw err
          }

          expect(R.prop('message', res.body)).toEqual('Unauthorized')
          done()
        })
    })

    it('should get any user if admin', (done) => {
      request(app)
        .get('/v1/user/f5a29391-5a59-4488-b01b-1c2ad9800321')
        .set('Authorization', 'Bearer admin')
        .expect(200)
        .end((err, res) => {
          if (err) {
            throw err
          }

          expect(R.pick(['username'], res.body)).toEqual({username: 'paolo.verdi@corley.it'})
          done()
        })
    })
  })

  describe('CREATE', () => {
    it('should create a new user', (done) => {
      const body = {
        username: 'maria.gialli@corley.it',
        password: 'pippo123',
        firstname: 'Maria',
        lastname: 'Gialli',
        role: 'ROLE_ADMIN',
        tos: true,
        privacy: false,
        commercial: true,
        third: false,
      }

      request(app)
        .post('/v1/user')
        .set('Authorization', 'Bearer admin')
        .send(body)
        .expect(201)
        .end((err, res) => {
          if (err) {
            throw err
          }

          const fields = [
            'username',
            'password',
            'tos',
            'privacy',
            'commercial',
            'third',
            'role',
          ]

          expect(R.pick(fields, res.body)).toEqual({
            username: 'maria.gialli@corley.it',
            tos: true,
            privacy: false,
            commercial: true,
            third: false,
            role: 'ROLE_ADMIN',
          })
          done()
        })
    })

    it('should not create a user if email already exists', (done) => {
      const body = {
        username: 'mario.rossi@corley.it',
        password: 'pippo123',
        firstname: 'Mario',
        lastname: 'Rossi',
        role: 'ROLE_ADMIN',
        tos: true,
        privacy: true,
        commercial: true,
        third: true,
      }

      request(app)
        .post('/v1/user')
        .set('Authorization', 'Bearer admin')
        .send(body)
        .expect(409)
        .end((err, res) => {
          //  console.log(res.body)
          if (err) {
            throw err
          }

          expect(R.prop('message', res.body)).toEqual('Conflict. Username already in use.')
          done()
        })
    })
  })

  describe('UPDATE', () => {
    describe('Normal', () => {
      it('should update user if token correct user', (done) => {
        request(app)
          .patch('/v1/user/f5a29391-5a59-4488-b01b-1c2ad9800321')
          .set('Authorization', 'Bearer user')
          .send({
            avatar_url: 'https://immagine.com/1.jpg',
          })
          .expect(200)
          .end((err, res) => {
            if (err) {
              throw err
            }

            expect(R.prop('avatar_url', res.body)).toEqual('https://immagine.com/1.jpg')
            done()
          })
      })

      it('should not update other user if token is user', (done) => {
        request(app)
          .patch('/v1/user/ca401c79-0ade-4593-bb4b-acde07335c87')
          .set('Authorization', 'Bearer user')
          .send({
            avatar_url: 'https://immagine.com/1.jpg',
          })
          .expect(403)
          .end((err, res) => {
            if (err) {
              throw err
            }

            expect(R.prop('message', res.body)).toEqual('Forbidden')
            done()
          })
      })

      it('should update user if token is admin', (done) => {
        request(app)
          .patch('/v1/user/f5a29391-5a59-4488-b01b-1c2ad9800321')
          .set('Authorization', 'Bearer admin')
          .send({
            avatar_url: 'https://immagine.com/1.jpg',
          })
          .expect(200)
          .end((err, res) => {
            if (err) {
              throw err
            }

            expect(R.prop('avatar_url', res.body)).toEqual('https://immagine.com/1.jpg')
            done()
          })
      })

      it('should update user if token is superadmin', (done) => {
        request(app)
          .patch('/v1/user/f5a29391-5a59-4488-b01b-1c2ad9800321')
          .set('Authorization', 'Bearer superadmin')
          .send({
            avatar_url: 'https://immagine.com/1.jpg',
          })
          .expect(200)
          .end((err, res) => {
            if (err) {
              throw err
            }

            expect(R.prop('avatar_url', res.body)).toEqual('https://immagine.com/1.jpg')
            done()
          })
      })
    })

    describe('Conditions', () => {
      it('should update conditions if token correct user', (done) => {
        request(app)
          .patch('/v1/user/f5a29391-5a59-4488-b01b-1c2ad9800321/conditions')
          .set('Authorization', 'Bearer user')
          .send({
            tos: true,
            privacy: true,
            third: true,
            commercial: true,
          })
          .expect(200)
          .end((err, res) => {
            if (err) {
              throw err
            }

            expect(R.pick(['tos', 'privacy', 'third', 'commercial'], res.body)).toEqual({
              tos: true,
              privacy: true,
              third: true,
              commercial: true,
            })
            done()
          })
      })

      it('should not update conditions if token another user', (done) => {
        request(app)
          .patch('/v1/user/ca401c79-0ade-4593-bb4b-acde07335c87/conditions')
          .set('Authorization', 'Bearer admin')
          .send({
            tos: true,
            privacy: true,
            third: true,
            commercial: true,
          })
          .expect(403)
          .end((err, res) => {
            if (err) {
              throw err
            }

            expect(R.prop('message', res.body)).toEqual('Forbidden')
            done()
          })
      })
    })

    describe('Status', () => {
      it('should not update status if user', (done) => {
        request(app)
          .patch('/v1/user/ca401c79-0ade-4593-bb4b-acde07335c87/status')
          .set('Authorization', 'Bearer user')
          .send({
            status: 'DELETED',
          })
          .expect(403)
          .end((err, res) => {
            if (err) {
              throw err
            }

            expect(R.prop('message', res.body)).toEqual('Forbidden')
            done()
          })
      })

      it('should update status if admin and user is role user', (done) => {
        request(app)
          .patch('/v1/user/f5a29391-5a59-4488-b01b-1c2ad9800321/status')
          .set('Authorization', 'Bearer admin')
          .send({
            status: 'SUSPENDED',
          })
          .expect(200)
          .end((err, res) => {
            if (err) {
              throw err
            }

            expect(R.prop('username', res.body)).toEqual('paolo.verdi@corley.it')
            done()
          })
      })

      it('should not update status if admin and user is role admin', (done) => {
        request(app)
          .patch('/v1/user/ca401c79-0ade-4593-bb4b-acde07335c87/status')
          .set('Authorization', 'Bearer admin')
          .send({
            status: 'DELETED',
          })
          .expect(403)
          .end((err, res) => {
            if (err) {
              throw err
            }

            expect(R.prop('message', res.body)).toEqual('Forbidden')
            done()
          })
      })

      it('should update status if superadmin', (done) => {
        request(app)
          .patch('/v1/user/ca401c79-0ade-4593-bb4b-acde07335c87/status')
          .set('Authorization', 'Bearer superadmin')
          .send({
            status: 'DELETED',
          })
          .expect(200)
          .end((err, res) => {
            //     console.log(res.body)
            if (err) {
              throw err
            }

            expect(R.prop('username', res.body)).toEqual('luca.bianchi@corley.it')
            done()
          })
      })
    })

    describe('Password', () => {
      it('should update password if password is valid', (done) => {
        request(app)
          .patch('/v1/user/f5a29391-5a59-4488-b01b-1c2ad9800321/password')
          .set('Authorization', 'Bearer user')
          .send({
            password: 'pippo123',
            new_password: 'pippo1234',
          })
          .expect(200)
          .end((err, res) => {
            if (err) {
              throw err
            }

            expect(R.prop('username', res.body)).toEqual('paolo.verdi@corley.it')
            done()
          })
      })

      it('should update password if superadmin', (done) => {
        request(app)
          .patch('/v1/user/f5a29391-5a59-4488-b01b-1c2ad9800321/password')
          .set('Authorization', 'Bearer superadmin')
          .send({
            new_password: 'pippo1234',
          })
          .expect(200)
          .end((err, res) => {
            if (err) {
              throw err
            }

            expect(R.prop('username', res.body)).toEqual('paolo.verdi@corley.it')
            done()
          })
      })
    })
  })

  describe('DELETE', () => {
    it('should delete if user and password is valid', (done) => {
      request(app)
        .delete('/v1/user/f5a29391-5a59-4488-b01b-1c2ad9800321')
        .set('Authorization', 'Bearer user')
        .send({
          password: 'pippo123',
        })
        .expect(200)
        .end((err, res) => {
          // console.log(res.body)
          if (err) {
            throw err
          }

          expect(R.prop('username', res.body)).toEqual('paolo.verdi@corley.it')
          done()
        })
    })

    it('should not delete if not me', (done) => {
      request(app)
        .delete('/v1/user/ca401c79-0ade-4593-bb4b-acde07335c87')
        .set('Authorization', 'Bearer user')
        .send({
          password: 'pippo123',
        })
        .expect(403)
        .end((err, res) => {
          if (err) {
            throw err
          }

          expect(R.prop('message', res.body)).toEqual('Forbidden')
          done()
        })
    })

    it('should delete without password if superadmin', (done) => {
      request(app)
        .delete('/v1/user/f5a29391-5a59-4488-b01b-1c2ad9800321')
        .set('Authorization', 'Bearer superadmin')
        .send({})
        .expect(200)
        .end((err, res) => {
          // console.log(res.body)
          if (err) {
            throw err
          }

          expect(R.prop('username', res.body)).toEqual('paolo.verdi@corley.it')
          done()
        })
    })
  })

  describe('LOGIN', () => {
    it('should login if username and password are valid', (done) => {
      request(app)
        .post('/v1/login')
        .send({
          username: 'paolo.verdi@corley.it',
          password: 'pippo123',
        })
        .expect(200)
        .end((err, res) => {
          // console.log(res.body)
          if (err) {
            throw err
          }

          expect(typeof R.prop('user', res.body)).toBe('object')
          expect(typeof R.prop('access_token', res.body)).toBe('string')
          done()
        })
    })

    it('should not login if username and/or password are wrong', (done) => {
      request(app)
        .post('/v1/login')
        .send({
          username: 'paolo.verdi@corley.it',
          password: 'pippo1234',
        })
        .expect(404)
        .end((err, res) => {
          if (err) {
            throw err
          }

          expect(R.prop('message', res.body)).toEqual('Not found')
          done()
        })
    })
  })

  describe('PASSWORD RETRIEVE', () => {
    it('should retrieve account if username exists', (done) => {
      request(app)
        .post('/v1/user/password/retrieve')
        .send({
          username: 'paolo.verdi@corley.it',
        })
        .expect(200)
        .end((err, res) => {
          if (err) {
            throw err
          }

          expect(R.prop('message', res.body)).toBe('ok')
          done()
        })
    })

    it('should not retrieve account if username not exists', (done) => {
      request(app)
        .post('/v1/user/password/retrieve')
        .send({
          username: 'paolo.verdi_wrong@corley.it',
        })
        .expect(404)
        .end((err, res) => {
          if (err) {
            throw err
          }

          expect(R.prop('message', res.body)).toEqual('Not found')
          done()
        })
    })

    it('should complete retrieve account if hash is correct', (done) => {
      request(app)
        .post('/v1/user/password/retrieve/complete')
        .send({
          hash: '7ed18a1212bf70f759a64c41cd26a0d83e7bc2889ae994748e7ead6cf00f10da',
          username: 'mario.rossi@corley.it',
          password: 'pippo1234',
        })
        .expect(200)
        .end((err, res) => {
          if (err) {
            throw err
          }

          expect(R.prop('message', res.body)).toBe('ok')
          done()
        })
    })

    it('should not complete retrieve account if hash is wrong', (done) => {
      request(app)
        .post('/v1/user/password/retrieve/complete')
        .send({
          hash: '7ed18a1212bf70f759a64c41cd26a0d83e7bc2889ae994748e7ead7cf00f10db',
          username: 'mario.rossi@corley.it',
          password: 'pippo1234',
        })
        .expect(404)
        .end((err, res) => {
          if (err) {
            throw err
          }

          expect(R.prop('message', res.body)).toEqual('Not found')
          done()
        })
    })
  })
})
