import { AppError } from '@/errors'

import { StatusCodes } from 'http-status-codes'

export class NotFoundError extends AppError {
  constructor() {
    super('Resource not found', StatusCodes.NOT_FOUND)
    this.name = 'NotFoundError'
  }
}
