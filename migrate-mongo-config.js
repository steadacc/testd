const config = require('config')

module.exports = {
  mongodb: {
    url: config.db.host,
    databaseName: config.db.host.split('/').slice(-1).pop(),
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  migrationsDir: 'priv/migrations',
  changelogCollectionName: 'migrations',
}
