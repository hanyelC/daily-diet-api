import { env } from '@/env'
import { mealsRoutes } from '@/routes'

import fastify from 'fastify'
import { StatusCodes } from 'http-status-codes'
import { ZodError } from 'zod'

export const app = fastify()

app.register(mealsRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Here we should log to a external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
