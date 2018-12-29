'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class RoomUser extends Model {
  static get computed () {
    return ['pingtime']
  }

  getPingtime({last_active_at}) {
    const now = new Date();

    return now - last_active_at;
  }
}

module.exports = RoomUser
