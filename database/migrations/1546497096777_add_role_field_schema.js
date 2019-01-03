'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddRoleFieldSchema extends Schema {
  up () {
    this.table('users', (table) => {
      // alter table
      table.boolean('is_admin').defaultTo(false)
    })
  }

  down () {
    this.table('users', (table) => {
      // reverse alternations
      table.dropColumn('is_admin')
    })
  }
}

module.exports = AddRoleFieldSchema
