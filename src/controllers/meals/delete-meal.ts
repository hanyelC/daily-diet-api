import { knex } from '@/database'

import { FastifyReply, FastifyRequest } from 'fastify'
import { StatusCodes } from 'http-status-codes'
import { z } from 'zod'

const deleteMealParamsSchema = z.object({
  id: z.string(),
})

export async function deleteMealController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = deleteMealParamsSchema.parse(request.params)

  await knex('meals').where({ id }).delete()

  return reply.status(StatusCodes.NO_CONTENT).send()
}
