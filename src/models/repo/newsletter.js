const {assoc, omit, compose, toLower, over, lens, prop, isEmpty, map} = require('ramda')
const moment = require('moment')

const {if_exists, if_already_exists_gdpr} = require('../../utilities/errors_code')
const Newsletter = require('../newsletter')

module.exports = {
  list: (params) => {
    params.$and = []
    
    if(params.not_sent) {
      params.$and.push(
        {send_at: {$gt: new Date()}},
        {sent_at: null },
        {$expr: {$gt: [ "$tested_at" , "$edited_at" ] }}
      )
    }

    if(params.plan_ids) {
      params.$and.push({plan_ids: params.plan_ids})
      params = omit(['plan_ids'], params)
    }

    if(params.roles) {
      params.$and.push({roles: params.roles})  
      params = omit(['roles'], params)
    }

    if (isEmpty(params.$and)) {
      params = omit(['$and'], params)
    }

    let where = omit(['limit', 'offset', 'orderBy', 'page', 'order', 'not_sent'], params)

    return Promise.all([
      Newsletter
        .find(where)
        .skip((params.page - 1) * params.limit)
        .limit(params.limit)
        .sort({[params.orderBy]: toLower(params.order)}),
      Newsletter.countDocuments(where)
    ])
      .then(([docs, total]) => {
        return {
          docs,
          total,
        }
      })
  },
  // list_speaker: async (params) => {
  //   params.$and = []
  //   params.$and.push({role: 'ROLE_SPEAKER', status: 'ACTIVE'})

  //   if (params.event_id) {
  //     await get_company_by_event(params.event_id)
  //       .then(result => map(prop('id'))(result))
  //       .then((r) => params.$and.push({company_id: {$in: r}}))
  //   }

  //   if (params.company_id) {
  //     params.$and.push({company_id: params.company_id})
  //   }

  //   if (isEmpty(params.$and)) {
  //     params = omit(['$and'], params)
  //   }

  //   let where = omit(
  //     ['limit', 'offset', 'orderBy', 'page', 'order', 'event_id'], params)

  //   return Promise.all([
  //     Newsletter
  //       .find(where)
  //       .skip((params.page - 1) * params.limit)
  //       .limit(params.limit)
  //       .sort({[params.orderBy]: toLower(params.order)}),
  //     Newsletter.countDocuments(where)
  //   ])
  //     .then(([docs, total]) => {
  //       return {
  //         docs,
  //         total,
  //       }
  //     })
  // },
  // get: (id) => {
  //   return Newsletter.findById(id).then(if_exists)
  // },
  // create: async (body, Newsletter) => {
  //   let firstname = body.firstname
  //   let lastname = body.lastname
  //   let name = firstname + ' ' + lastname

  //   if (Newsletter.role === 'ROLE_COMPANY_ADMIN' && body.company_id !== Newsletter.company_id) {
  //     return Promise.reject({status: 403, message: 'It should be the same company as yours'})
  //   }
  //   let company = null;
  //   if (body.company_id && (body.role !== 'ROLE_ADMIN' && body.role !== 'ROLE_SUPERADMIN')) {
  //     company = await get_company(body.company_id)
  //   }
  //   const autocomplete_data = data => compose(
  //     over(lens(prop('password'), assoc('password')), generate_hash),
  //     assoc('created_at', new Date()),
  //     assoc('tos_edited_at', new Date()),
  //     assoc('privacy_edited_at', new Date()),
  //     assoc('third_edited_at', new Date()),
  //     assoc('commercial_edited_at', new Date()),
  //     assoc('event_id', (!!company && !!company.event_id) ? company.event_id : body.event_id),
  //     assoc('available', true), // di default
  //     assoc('avatar_url', body.avatar_url ? body.avatar_url : create(name, {inverted: "#eee", baseurl: true}))
  //   )(data)

  //   return Newsletter.findOne({Newslettername: body.Newslettername})
  //     .then(if_already_exists_gdpr)
  //     .then(() => Newsletter.create(autocomplete_data(body)))
  // },
  // update: (id, body) => {
  //   const data = compose(assoc('edited_at', new Date()))(body)
  //   return Newsletter.findOne({_id: id})
  //     .then(if_exists)
  //     .then(Newsletter => {
  //       if (body.hasOwnProperty('lastname') || body.hasOwnProperty('firstname') && !body.hasOwnProperty('avatar_url')) {
  //         let firstname = body.firstname ? body.firstname : Newsletter.firstname
  //         let lastname = body.lastname ? body.lastname : Newsletter.lastname
  //         let name = firstname + ' ' + lastname
  //         // console.log(assoc('avatar_url' , create(name, {inverted: "#eee", baseurl: true}), req.body))
  //         if (Newsletter.avatar_url.startsWith('data')) {
  //           data.avatar_url = create(name, {inverted: "#eee", baseurl: true})
  //         }
  //       }
  //       return data
  //     })
  //     .then(data => Newsletter.findByIdAndUpdate(id, data, {new: true}))
  // },
  // delete: (id, password) => {
  //   return Newsletter.findOne(password === null ? {_id: id} : {_id: id, password: generate_hash(password)}).then(if_exists)
  //     .then(Newsletter => {
  //       const data = {
  //         edited_at: new Date(),
  //         status: 'DELETED',
  //         Newslettername: '-'
  //       }

  //       return Newsletter.findByIdAndUpdate(Newsletter.id, data, {new: false})
  //     })
  // },
}
