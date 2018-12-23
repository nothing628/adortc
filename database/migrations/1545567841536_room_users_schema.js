'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RoomUsersSchema extends Schema {
  up () {
    this.create('room_users', (table) => {
      table.increments()
      table.integer('room_id')
      table.string('username', 200).notNullable().unique().index()
      table.timestamps()
    })
  }

  down () {
    this.drop('room_users')
  }
}

module.exports = RoomUsersSchema
