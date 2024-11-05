const isDebug = process.env.NODE_ENV !== 'production'
const isDevelop = process.env.NODE_ENV === 'develop'

function TRACE() {
  console.log('T>', ...arguments)
}

function TRACE_STATUS() {
  let isSuccess = arguments[0]
  let args = [...arguments].slice(1)
  let message = ['T>', ...args].join(' ')
  console.log(isSuccess ? '\x1b[32m%s\x1b[0m' : '\x1b[36m%s\x1b[0m', message)
}

function DEBUG() {
  console.log('D>', ...arguments)
}

function ERROR() {
  let args = [...arguments]
  let message = ['E>', ...args].join(' ')
  console.error('\x1b[31m%s\x1b[0m', message)
}

function ERROR_TRACE(message, callback) {
  ERROR('ET>', new Date().toJSON(), message.stack || message)
  if (typeof callback === 'function') callback()
}

module.exports.isDebug = isDebug
module.exports.isDevelop = isDevelop
module.exports.TRACE = TRACE
module.exports.DEBUG = DEBUG
module.exports.ERROR = ERROR
module.exports.ERROR_TRACE = ERROR_TRACE
module.exports.TRACE_STATUS = TRACE_STATUS
