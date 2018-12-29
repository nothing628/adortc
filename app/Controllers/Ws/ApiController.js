'use strict'

class ApiController {
  constructor ({ socket, request }) {
    this.socket = socket
    this.request = request
  }

  onTest() {
    this.socket.broadcastToAll('message', 'data-here')
  }

  onSetOffer(data) {
    this.socket.broadcastToAll('get-offer', data)
  }
}

module.exports = ApiController
