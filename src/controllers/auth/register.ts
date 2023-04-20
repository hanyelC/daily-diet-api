import { knex } from '@/database'
import { UsernameAlreadyTakenError } from '@/errors'

import { FastifyReply, FastifyRequest } from 'fastify'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'

const registerBodySchema = z.object({
  username: z.string(),
})

export async function registerController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { username } = registerBodySchema.parse(request.body)

  const userWithUsername = await knex('users')
    .where({ username })
    .select()
    .first()

  if (userWithUsername) {
    throw new UsernameAlreadyTakenError()
  }

  await knex('users').insert({
    id: randomUUID(),
    username,
  })

  return reply.status(StatusCodes.CREATED).send(ReasonPhrases.CREATED)
}
