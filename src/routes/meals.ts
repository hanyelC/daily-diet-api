import { createMealController, listMealsController } from '@/controllers'

import { FastifyInstance } from 'fastify'

export async function mealsRoutes(app: FastifyInstance) {
  app.get('/', listMealsController)

  app.post('/', createMealController)
}
