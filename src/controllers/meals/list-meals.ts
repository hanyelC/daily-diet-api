import { knex } from '@/database'

import { FastifyReply, FastifyRequest } from 'fastify'

export async function listMealsController(
  _: FastifyRequest,
  reply: FastifyReply,
) {
  const meals = await knex('meals').select(
    'id',
    'date',
    'description',
    'name',
    'within_diet as withinDiet',
  )

  return reply.send({
    meals: meals.map((meal) => ({
      ...meal,
      withinDiet: meal.withinDiet === 1,
    })),
  })
}
