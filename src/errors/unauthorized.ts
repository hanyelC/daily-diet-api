import { AppError } from '@/errors'

import { StatusCodes } from 'http-status-codes'

export class UnauthorizedError extends AppError {
  constructor() {
    super('Unauthorized', StatusCodes.UNAUTHORIZED)
    this.name = 'UnauthorizedError'
  }
}
