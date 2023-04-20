import { app } from '@/app'
import { knex } from '@/database'

import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import supertest from 'supertest'
import { afterAll, beforeAll, beforeEach, describe, expect, test } from 'vitest'

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

  describe('POST /meals', () => {
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

  describe('GET /meals', () => {
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

  describe('GET /meals/:id', () => {
    test('should be able to get meal', async () => {
      const [createdMeal] = await knex('meals')
        .insert({
          id: randomUUID(),
          date: new Date('2023-03-03').toISOString(),
          description: 'foo',
          name: 'foo',
          within_diet: true,
        })
        .returning('*')

      const { body } = await supertest(app.server).get(
        `/meals/${createdMeal.id}`,
      )

      expect(body.meal.id).toEqual(createdMeal.id)
    })
  })

  describe('DELETE /meals/:id', () => {
    test('should be able to delete meal', async () => {
      const [createdMeal] = await knex('meals')
        .insert({
          id: randomUUID(),
          date: new Date('2023-03-03').toISOString(),
          description: 'foo',
          name: 'foo',
          within_diet: true,
        })
        .returning('*')

      await supertest(app.server).delete(`/meals/${createdMeal.id}`).expect(204)

      const meal = await knex('meals')
        .where({ id: createdMeal.id })
        .select()
        .first()

      expect(meal).toEqual(undefined)
    })
  })

  describe('PUT /meals/:id', () => {
    test('should not be able to update non existing meal', async () => {
      await supertest(app.server)
        .put('/meals/non-existing-id')
        .send({
          name: 'string',
        })
        .expect(404)
    })

    test('should be able to update meal', async () => {
      const [meal] = await knex('meals')
        .insert({
          id: 'some-id',
          date: new Date('2023-03-03').toISOString(),
          description: 'foo',
          name: 'foo',
          within_diet: true,
        })
        .returning('*')

      const newData = {
        name: 'banana',
        description: 'baz',
        date: new Date('2023-02-02').toISOString(),
        withinDiet: false,
      }

      await supertest(app.server)
        .put(`/meals/${meal.id}`)
        .send(newData)
        .expect(204)

      const updatedMealOnDB = await knex('meals')
        .where({ id: meal.id })
        .select(
          'id',
          'date',
          'description',
          'name',
          'within_diet as withinDiet',
        )
        .first()

      expect(updatedMealOnDB).toEqual(
        expect.objectContaining({
          ...newData,
          withinDiet: 0,
        }),
      )
    })
  })
})
