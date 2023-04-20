import { registerController } from '@/controllers'

import { FastifyInstance } from 'fastify'

export async function authRoutes(app: FastifyInstance) {
  app.post('/register', registerController)
}
