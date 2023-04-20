import { knex } from '@/database'

import { FastifyReply, FastifyRequest } from 'fastify'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'

const createMealBodySchema = z.object({
  name: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  withinDiet: z.boolean(),
})

export async function createMealController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { date, description, name, withinDiet } = createMealBodySchema.parse(
    request.body,
  )

  await knex('meals').insert({
    id: randomUUID(),
    date: date.toISOString(),
    description,
    name,
    within_diet: withinDiet,
  })

  return reply.status(StatusCodes.CREATED).send(ReasonPhrases.CREATED)
}
