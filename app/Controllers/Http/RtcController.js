'use strict'

class RtcController {
  index ({ request, response, view }) {
    return view.render('room.list')
  }
}

module.exports = RtcController
