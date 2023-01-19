const unAuthenticatedError = require('./unAuthenticated')
const badRequestsError = require('./badRequests')
const CustomAPIError = require('./custom-error')

module.exports = {
    unAuthenticatedError, badRequestsError, CustomAPIError
}