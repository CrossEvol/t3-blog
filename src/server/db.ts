import { Prisma, PrismaClient } from '@prisma/client'

import { env } from '@/env'
import { DefaultArgs } from '@prisma/client/runtime/library'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export type PrismaTX = Omit<
  PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (env.NODE_ENV !== 'production') globalForPrisma.prisma = db
