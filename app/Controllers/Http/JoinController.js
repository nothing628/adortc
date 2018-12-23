'use strict'
const Rooms = use('App/Models/Room')

class JoinController {
  async index({ view, params, response }) {
    try {
      const room_id = params.id
      const room = await Rooms.findOrFail(room_id)

      view.share({
        room
      })

      return view.render('room.join')
    } catch (e) {
      return response.route('room.list')
    }
  }
}

module.exports = JoinController
