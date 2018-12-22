'use strict'

class ApiController {
  constructor ({ socket, request }) {
    this.socket = socket
    this.request = request
  }
}

module.exports = ApiController
