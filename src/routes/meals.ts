import { createMealController } from '@/controllers'
import { FastifyInstance } from 'fastify'

export async function mealsRoutes(app: FastifyInstance) {
  app.post('/', createMealController)
}
