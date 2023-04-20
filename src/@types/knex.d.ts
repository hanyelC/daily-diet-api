import 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    meals: {
      id: string
      name: string
      description: string
      date: string
      within_diet: boolean
      user_id: string
    }

    users: {
      id: string
      username: string
    }
  }
}
