import {
  createMealController,
  deleteMealController,
  getMealByIdController,
  listMealsController,
  updateMealController,
} from '@/controllers'

import { FastifyInstance } from 'fastify'

export async function mealsRoutes(app: FastifyInstance) {
  app.get('/', listMealsController)
  app.get('/:id', getMealByIdController)

  app.post('/', createMealController)

  app.put('/:id', updateMealController)

  app.delete('/:id', deleteMealController)
}
