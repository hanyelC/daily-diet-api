import { AppError } from '@/errors'

import { StatusCodes } from 'http-status-codes'

export class UsernameAlreadyTakenError extends AppError {
  constructor() {
    super('Username already taken', StatusCodes.CONFLICT)
    this.name = 'UsernameAlreadyTakenError'
  }
}
