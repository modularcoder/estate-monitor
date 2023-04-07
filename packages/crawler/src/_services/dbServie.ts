import { PrismaClient } from '../../../_core/src/index'

export * from '../../../_core/src/index'

const prisma = new PrismaClient({
  log: ['query', 'error', 'info', 'warn'],
})

export default prisma
