import { Hono } from 'hono'
import { auth } from './lib/auth.js'
import { prisma } from './lib/prisma.js'

const app = new Hono()

const welcomeStrings = [
  'Hello Hono!',
  'To learn more about Hono on Vercel, visit https://vercel.com/docs/frameworks/backend/hono'
]

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
