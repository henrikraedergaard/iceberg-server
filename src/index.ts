import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { auth } from './lib/auth.js'
import { prisma } from './lib/prisma.js'

const app = new Hono()

const welcomeStrings = [
  'Hello Hono!',
  'To learn more about Hono on Vercel, visit https://vercel.com/docs/frameworks/backend/hono'
]

// Native (iceberg://, exp://) requests don't send an Origin header, so only http(s)
// entries from TRUSTED_ORIGINS matter here; the same list also drives better-auth's
// CSRF origin check in lib/auth.ts.
const corsOrigins = (process.env.TRUSTED_ORIGINS ?? '')
  .split(',')
  .filter((origin) => origin.startsWith('http://') || origin.startsWith('https://'))

app.use(
  '/api/*',
  cors({
    origin: corsOrigins,
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
)

app.on(['GET', 'POST'], '/api/auth/*', (c) => auth.handler(c.req.raw))

app.get('/', (c) => {
  return c.text(welcomeStrings.join('\n\n'))
})

app.post('/api/ping', async (c) => {
  const row = await prisma.ping.create({
    data: { message: `pong at ${new Date().toISOString()}` },
  })
  return c.json(row)
})

app.get('/api/ping', async (c) => {
  const row = await prisma.ping.findFirst({
    orderBy: { createdAt: 'desc' },
  })
  return c.json(row)
})

export default app
