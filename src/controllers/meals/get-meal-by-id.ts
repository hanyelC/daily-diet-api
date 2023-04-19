import { knex } from '@/database'

import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

const getMealByIdParamsSchema = z.object({
  id: z.string(),
})

export async function getMealByIdController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = getMealByIdParamsSchema.parse(request.params)

  const meal = await knex('meals')
    .where({ id })
    .select('id', 'date', 'description', 'name', 'within_diet as withinDiet')
    .first()

  return reply.send({
    meal: meal
      ? {
          ...meal,
          withinDiet: meal.withinDiet === 1,
        }
      : null,
  })
}
