'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ModifyRoomUserSchema extends Schema {
  up () {
    this.table('room_users', (table) => {
      // alter table
      table.dropColumn('username')
      table.string('client_id', 200).notNullable().index()
      table.string('type', 10).notNullable();
      table.string('sdp', 6000).notNullable();
      table.timestamp('last_active_at').notNullable();
    })
  }

  down () {
    this.table('room_users', (table) => {
      // reverse alternations
      table.string('username', 200).notNullable().unique().index()
      table.dropColumn('client_id')
      table.dropColumn('type')
      table.dropColumn('sdp')
      table.dropColumn('last_active_at')
    })
  }
}

module.exports = ModifyRoomUserSchema
