'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RoomSchema extends Schema {
  up () {
    this.create('rooms', (table) => {
      table.increments()
      table.string('room_name', 200).notNullable().unique().index()
      table.timestamps()
    })

    this.create('room_user', table => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('room_id').unsigned().references('id').inTable('rooms')
      table.timestamp('last_active_at')
      table.timestamps()

      table.unique(['user_id', 'room_id'])
    })
  }

  down () {
    this.drop('room_user')
    this.drop('rooms')
  }
}

module.exports = RoomSchema
