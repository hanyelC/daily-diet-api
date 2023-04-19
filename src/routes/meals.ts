import {
  createMealController,
  getMealByIdController,
  listMealsController,
} from '@/controllers'

import { FastifyInstance } from 'fastify'

export async function mealsRoutes(app: FastifyInstance) {
  app.get('/', listMealsController)
  app.get('/:id', getMealByIdController)

  app.post('/', createMealController)
}
