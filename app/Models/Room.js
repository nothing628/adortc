'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Route = use('Route')

class Room extends Model {
  static get computed () {
    return ['joinurl']
  }

  getJoinurl({id}) {
    return Route.url('room.join', { id })
  }
}

module.exports = Room
