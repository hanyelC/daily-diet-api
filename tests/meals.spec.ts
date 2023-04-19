import { app } from '@/app'

import { execSync } from 'node:child_process'
import supertest from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, test, expect } from 'vitest'

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
        })
        .expect(201)
    })
  })

  describe('GET /', () => {
    test('should be able to list meals', async () => {
      const fakeMealData = {
        name: 'hamburger',
        description: 'foo',
        date: new Date('2023-02-02').toISOString(),
        withinDiet: true,
      }

      const fakeMealData2 = {
        ...fakeMealData,
        name: 'rice',
        withinDiet: false,
      }

      async function createMeal(data: typeof fakeMealData) {
        await supertest(app.server).post('/meals').send(data)
      }

      await createMeal(fakeMealData)
      await createMeal(fakeMealData2)

      const { body } = await supertest(app.server).get('/meals')

      expect(body.meals).toEqual([
        expect.objectContaining({
          id: expect.any(String),
          ...fakeMealData,
        }),
        expect.objectContaining({
          id: expect.any(String),
          ...fakeMealData2,
        }),
      ])
    })
  })

  describe('GET /:id', () => {
    test.skip('should be able to get meal', async () => {
      await supertest(app.server).get('/meals/some-id').expect(200)
    })
  })

  describe('DELETE /:id', () => {
    test.skip('should be able to delete meal', async () => {
      await supertest(app.server).delete('/meals/some-id').expect(200)
    })
  })

  describe('PUT /:id', () => {
    test.skip('should be able to update meal', async () => {
      await supertest(app.server).put('/meals/some-id').expect(200)
    })
  })
})
