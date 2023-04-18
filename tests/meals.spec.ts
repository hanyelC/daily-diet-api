import { app } from '@/app'

import { execSync } from 'node:child_process'
import supertest from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, test } from 'vitest'

describe('(e2e) /meals', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  describe('POST /', () => {
    test('should be able to create a meal', async () => {
      await supertest(app.server)
        .post('/meals')
        .send({
          name: 'hamburger',
          description: 'foo',
          date: new Date('2023-02-02').toISOString(),
          withinDiet: true,
          foo: 'foo',
        })
        .expect(201)
    })
  })
})
