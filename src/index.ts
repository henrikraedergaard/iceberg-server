import { Hono } from 'hono'
import { auth } from './lib/auth.js'

const app = new Hono()

const welcomeStrings = [
  'Hello Hono!',
  'To learn more about Hono on Vercel, visit https://vercel.com/docs/frameworks/backend/hono'
]

app.on(['GET', 'POST'], '/api/auth/*', (c) => auth.handler(c.req.raw))

app.get('/', (c) => {
  return c.text(welcomeStrings.join('\n\n'))
})

export default app
