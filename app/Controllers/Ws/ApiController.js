'use strict'
const Rooms = use('App/Models/Room')
const RoomUser = use('App/Models/RoomUser')

class ApiController {
  constructor ({ socket, request }) {
    this.socket = socket;
    this.request = request;
  }

  onTest() {
    this.socket.broadcastToAll('message', 'data-here');
  }

  async onHeartbeat(data) {
    try {
      const client_id = data.client_id;

      await RoomUser
        .query()
        .where('client_id', client_id)
        .update({ last_active_at: new Date() })
    } catch (e) {
      this.socket.broadcastToAll('error', { type:'heartbeat', e});
    }
  }

  async onOffer(data) {
    try {
      const room_id = data.room_id
      const client_id = data.client_id
      const sdp = data.sdp
      const tipe = 'offer'
      const room = await Rooms.findOrFail(room_id)
      const detail = new RoomUser()

      detail.client_id = client_id;
      detail.room_id = room_id;
      detail.type = tipe;
      detail.sdp = sdp;
      detail.last_active_at = new Date();
      await detail.save()

      const not_timeout = new Date(Date.now() -  25000);  //Not timeout is last 25 seconds ago
      const details = await RoomUser
        .query()
        .where('room_id', '=', room.id)
        .where('last_active_at', '>=', not_timeout)
        .where('type', '=', tipe)
        .fetch()

      this.socket.broadcastToAll('getoffer', details);
    } catch (e) {
      this.socket.broadcastToAll('error', { type: 'offer', e});
    }
  }

  async onIcecandidate(data) {
    try {
      const room_id = data.room_id;
      const client_id = data.client_id;
      const tipe = 'ice_';
      const room = await Rooms.findOrFail(room_id)
      const detail = new RoomUser()
      const candidate = data.candidate;

      detail.client_id = client_id;
      detail.room_id = room_id;
      detail.type = tipe;
      detail.sdp = JSON.stringify(candidate);
      await detail.save();

      const not_timeout = new Date(Date.now() -  25000);  //Not timeout is last 25 seconds ago
      const details = await RoomUser
        .query()
        .where('room_id', '=', room.id)
        .where('last_active_at', '>=', not_timeout)
        .where('type', '=', tipe)
        .fetch()

      this.socket.broadcastToAll('getice', details);
    } catch (e) {
      this.socket.broadcastToAll('error', { type: 'ice_candidate', e});
    }
  }
}

module.exports = ApiController
