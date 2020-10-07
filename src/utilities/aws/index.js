const AWS = require('aws-sdk')
const config = require('config')

const logger = require('pino')()
const aws_logger = logger.child({module: 'aws'})

const sns = new AWS.SNS({
  apiVersion: '2010-03-31',
  region: config.sns.region,
})

module.exports = {
  send_to_topic: (subject, payload) => {
    return sns
      .publish({
        Subject: subject,
        Message: JSON.stringify(payload),
        TopicArn: config.sns.topic_arn,
        MessageAttributes: {
          subject: {
            DataType: 'String',
            StringValue: subject,
          },
        },
      })
      .promise()
      .then(response => Promise.resolve({payload, response}))
      .catch(err => {
        aws_logger.info({err: err, status: 'ERROR'}, 'Error in send_to_topic')
        return Promise.resolve({payload, err})
      })
  },
}
