import {
  deleteDataFromCacheByQuery,
  getDataFromCacheByQuery
} from '../src/apps/helpers/redis'
import {
  deleteVolunteerFromCache,
  deleteAdminFromCache
} from '../src/useCases/CacheUtils'

describe('cacheUtils', () => {
  beforeAll(async () => {
    await global.setUp()
  })

  afterAll(async () => {
    await global.tearDown()
  })

  it('allow to delete a volunteer when cache is empty', async () => {
    const cacheKey = 'get:volunteers'
    await deleteDataFromCacheByQuery(cacheKey)

    await deleteVolunteerFromCache('userId')

    await expect(getDataFromCacheByQuery(cacheKey)).resolves.toBeNull()
  })

  it('allow to delete an admin when cache is empty', async () => {
    const cacheKey = 'get:admins'
    await deleteDataFromCacheByQuery(cacheKey)

    await deleteAdminFromCache('userId')

    await expect(getDataFromCacheByQuery(cacheKey)).resolves.toBeNull()
  })
})
