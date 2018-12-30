'use strict'
const Rooms = use('App/Models/Room')
const RoomUser = use('App/Models/RoomUser')

class ApiController {
  constructor ({ socket, request }) {
    this.socket = socket;
    this.request = request;
  }

  async storeEvent(data, tipe) {
    try {
      const room_id = data.room_id
      const client_id = data.client_id
      const sdp = data.sdp
      const detail = new RoomUser()

      detail.client_id = client_id;
      detail.room_id = room_id;
      detail.type = tipe;
      detail.sdp = sdp;
      detail.last_active_at = new Date();

      await Rooms.findOrFail(room_id)
      await detail.save()
    } catch (e) {
      this.socket.broadcastToAll('error', { type: tipe, e});
    }
  }

  filterEventByType(arr_data, tipe) {
    return arr_data.filter((value) => value.type === tipe);
  }

  async onHeartbeat(data) {
    try {
      const client_id = data.client_id;
      const room_id = data.room_id;
      const room = await Rooms.findOrFail(room_id)

      await RoomUser
        .query()
        .where('client_id', client_id)
        .update({ last_active_at: new Date() })

      const not_timeout = new Date(Date.now() -  5000);  //Not timeout is last 25 seconds ago
      const details = await RoomUser
          .query()
          .where('client_id', '!=', client_id)
          .where('room_id', '=', room.id)
          .where('last_active_at', '>=', not_timeout)
          .fetch()
      const details_array = details.toJSON();

      const detail_answer = this.filterEventByType(details_array, 'answer');
      const detail_offer = this.filterEventByType(details_array, 'offer');
      const detail_ice_loc = this.filterEventByType(details_array, 'ice_loc');
      const detail_ice_rem = this.filterEventByType(details_array, 'ice_rem');
      const detail_ice = detail_ice_loc.concat(detail_ice_rem);
  
      this.socket.broadcastToAll('getoffer', detail_offer);
      this.socket.broadcastToAll('getanswer', detail_answer);
      this.socket.broadcastToAll('getice', detail_ice)
    } catch (e) {
      this.socket.broadcastToAll('error', { type:'heartbeat', e: e.toString()});
    }
  }

  async onOffer(data) {
    await this.storeEvent(data, 'offer');
  }

  async onAnswer(data) {
    await this.storeEvent(data, 'answer');
  }

  async onIcecandidate(data) {
    try {
      const room_id = data.room_id;
      const client_id = data.client_id;
      const tipe = data.tipe;
      const detail = new RoomUser()
      const candidate = data.candidate;

      detail.client_id = client_id;
      detail.room_id = room_id;
      detail.type = tipe;
      detail.sdp = JSON.stringify(candidate);

      await Rooms.findOrFail(room_id)
      await detail.save();
    } catch (e) {
      this.socket.broadcastToAll('error', { type: 'ice_candidate', e});
    }
  }
}

module.exports = ApiController
