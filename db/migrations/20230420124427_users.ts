import { randomUUID } from 'crypto'
import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().notNullable()
    table.text('username').unique().notNullable()
  })

  await knex.schema.alterTable('meals', (table) => {
    table
      .text('user_id')
      .index()
      .references('id')
      .inTable('users')
      .notNullable()
      .defaultTo(randomUUID())
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('meals', (table) => {
    table.dropColumn('user_id')
  })

  await knex.schema.dropTable('users')
}
