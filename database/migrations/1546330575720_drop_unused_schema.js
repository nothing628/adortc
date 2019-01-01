'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class DropUnusedSchema extends Schema {
  up () {
    this.drop('room_users')
    this.drop('room_user')
    this.drop('rooms')
  }

  down () {
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

    this.create('room_users', (table) => {
      table.increments()
      table.integer('room_id')
      table.string('client_id', 200).notNullable().index()
      table.string('type', 10).notNullable();
      table.string('sdp', 6000).notNullable();
      table.timestamp('last_active_at').notNullable();
      table.timestamps()
    })
  }
}

module.exports = DropUnusedSchema
