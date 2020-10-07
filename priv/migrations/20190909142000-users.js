module.exports = {
  up(db) {
    return db.collection('newsletters').createIndex({event_id: 1 })
  },

  down(db) {
  },
}
