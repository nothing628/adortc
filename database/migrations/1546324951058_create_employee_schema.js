'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CreateEmployeeSchema extends Schema {
  up () {
    this.create('candidates', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.string('fullname', 60).notNullable()
      table.string('birth_place', 50)
      table.timestamp('birth_date').notNullable()
      table.string('gender', 1).notNullable()
      table.string('address', 400)
      table.timestamps()
    })

    this.create('files', (table) => {
      table.increments()
      table.integer('candidate_id').unsigned().references('id').inTable('candidates')
      table.string('filename', 200).notNullable()
      table.string('filetitle', 200).notNullable()
      table.timestamps()
    })

    this.create('schedules', (table) => {
      table.increments()
      table.integer('candidate_id').unsigned().references('id').inTable('candidates')
      table.integer('status').unsigned().notNullable().defaultTo(1) //0 cancel, 1 schedule, 2 reschedule, 3 finish
      table.timestamp('schedule_at').notNullable()
      table.string('notes', 400)
      table.string('reschedule_notes', 400)
      table.timestamps()
    })

    this.create('channels', (table) => {
      table.increments()
      table.integer('user_id_from').unsigned().references('id').inTable('users')
      table.integer('user_id_to').unsigned().references('id').inTable('users')
      table.string('message')
      table.string('type', 20)
      table.boolean('is_readed').defaultTo(false)
      table.timestamps()
    })

    this.create('interview_result', (table) => {
      table.increments()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.integer('candidate_id').unsigned().references('id').inTable('candidates')
      table.string('notes', 2048)
      table.integer('status').unsigned().defaultTo(1) //0 reject, 1 pending, 2 ok
      table.timestamps()
    })

    this.table('users', (table) => {
      table.timestamp('last_seen_at')
    })
  }

  down () {
    this.table('users', (table) => {
      table.dropColumn('last_seen_at')
    })

    this.drop('interview_result')
    this.drop('channels')
    this.drop('schedules')
    this.drop('files')
    this.drop('candidates')
  }
}

module.exports = CreateEmployeeSchema
