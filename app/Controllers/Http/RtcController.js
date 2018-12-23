'use strict'
const Rooms = use('App/Models/Room')

class RtcController {
  index ({ request, response, view }) {
    return view.render('room.list')
  }

  listRoom({ request, response }) {
    return Rooms.all()
  }

  async addRoom({ request, response }) {
    const room = new Rooms()
    const body = request.post()

    room.room_name = body.room_name
    await room.save()

    return response.send({ success: true, data: room })
  }

  async deleteRoom({ request, params, response }) {

    try {
      const room_id = params.id
      const room = await Rooms.findOrFail(room_id)

      await room.delete()

      return response.send({success: true})
    } catch (e) {
      return response.status(400).json(e)
    }
  }
}

module.exports = RtcController
