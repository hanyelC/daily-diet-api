import { knex } from '@/database'
import { NotFoundError } from '@/errors'

import { FastifyReply, FastifyRequest } from 'fastify'
import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'

const updateMealParamsSchema = z.object({
  id: z.string(),
})

const updateMealBodySchema = z
  .object({
    name: z.string().optional(),
    description: z.string().optional(),
    date: z.coerce.date().optional(),
    withinDiet: z.boolean().optional(),
  })
  .refine(
    ({ date, description, name, withinDiet }) =>
      date !== undefined ||
      description !== undefined ||
      name !== undefined ||
      withinDiet !== undefined,
    {
      message: 'At least one field is required',
    },
  )

export async function updateMealController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = updateMealParamsSchema.parse(request.params)

  const { date, description, name, withinDiet } = updateMealBodySchema.parse(
    request.body,
  )

  const res = await knex('meals')
    .where({ id })
    .update({
      date: date ? date.toISOString() : undefined,
      description,
      name,
      within_diet: withinDiet,
    })

  if (res === 0) {
    throw new NotFoundError()
  }

  return reply.status(StatusCodes.NO_CONTENT).send()
}
