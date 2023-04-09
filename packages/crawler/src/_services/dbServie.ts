import { PrismaClient } from '@prisma/client'

export * from '@prisma/client'

const prisma = new PrismaClient({
  log: ['error', 'warn'],
})

export default prisma
