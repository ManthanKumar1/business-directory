'use strict'
let app = require('./src/index')
let serverless = require('serverless-http')

module.exports.hello = serverless(app)