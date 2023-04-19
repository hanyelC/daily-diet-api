export class AppError extends Error {
  name: string
  statusCode: number

  constructor(message: string, statusCode: number) {
    super(message)
    this.name = 'AppError'
    this.statusCode = statusCode
  }
}
