import { rest } from 'msw'
import { setupServer } from 'msw/node'
import request from 'supertest'

import { server } from '../../src'
import { setCacheDataByQuery } from '../../src/apps/helpers/redis'
import config from '../../src/config'

const code = 'github_code'
const token = 'github_token'

const mockServer = setupServer(
  rest.post('https://github.com/login/oauth/access_token', (req, res, ctx) => {
    if (!req.body.includes(`code=${code}`)) {
      return res(ctx.json({ error: 'bad_verification_code' }))
    }
    return res(ctx.json({ access_token: token }))
  }),
  rest.get('https://api.github.com/user', (req, res, ctx) => {
    if (req.headers.get('Authorization') !== `Bearer ${token}`) {
      return res(ctx.status(401))
    }
    return res(ctx.json({ login: 'octocat' }))
  }),
  rest.get('https://api.github.com/user/emails', (req, res, ctx) => {
    if (req.headers.get('Authorization') !== `Bearer ${token}`) {
      return res(ctx.status(401))
    }
    return res(
      ctx.json([
        {
          email: 'octocat@github.com',
          verified: true,
          primary: true,
          visibility: 'public'
        }
      ])
    )
  })
)

beforeAll(async () => {
  await global.setUp()
  mockServer.listen({
    onUnhandledRequest: ({ method, url }) => {
      if (!url.pathname.startsWith('/auth/callback')) {
        throw new Error(`Unhandled ${method} request to ${url}`)
      }
    }
  })
})

afterAll(async () => {
  await global.tearDown()
  mockServer.close()
})

test('allow user to log in', async () => {
  await setCacheDataByQuery('get:admins', [], 1)
  await request(server)
    .get('/auth/callback/application/github/admin')
    .query({ code })
    .expect(302)
    .expect(
      'Location',
      new RegExp(
        `${config.applicationProcessClientUrl}/code/[0-9a-f]{24}\\?${config.dashboardClientUrl}`
      )
    )
})
