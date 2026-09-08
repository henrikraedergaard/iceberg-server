import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { expo } from '@better-auth/expo'
import { prisma } from './prisma.js'

// "iceberg://,exp://" while testing in Expo Go; "iceberg://" for release builds
const trustedOrigins = (process.env.TRUSTED_ORIGINS ?? 'iceberg://').split(',')

export const auth = betterAuth({
  // secret and baseURL are read from BETTER_AUTH_SECRET / BETTER_AUTH_URL
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  emailAndPassword: { enabled: true },
  plugins: [expo()],
  trustedOrigins,
})
