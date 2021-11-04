import {
  deleteDataFromCacheByQuery,
  getDataFromCacheByQuery,
  setCacheDataByQuery
} from '../../../src/apps/helpers/redis'
import {
  updateUserCache,
  removeApplicantFromCache,
  updateApplicantCache
} from '../../../src/apps/application_process/helpers/updateRedis'

import { STUDENT_CATEGORIES } from '../../../src/apps/application_process/contexts/students/schema'
import { createStudent } from '../../testHelpers'

beforeAll(async () => {
  await global.setUp()
})

afterAll(async () => {
  await global.tearDown()
})

describe('updateUserCache', () => {
  const cacheKey = 'get:admins'
  const expiry = 1

  it('updates unexpired cache data', async () => {
    const user = {
      _id: 'userId',
      fullName: 'Jane Doe',
      email: 'jane.doe@morgue.org'
    }
    const unchanged = { _id: 'otherUser' }
    const newEmail = 'foo@bar.baz'
    await setCacheDataByQuery(cacheKey, [user, unchanged], expiry)

    await updateUserCache({ _id: user._id, email: newEmail })

    await expect(getDataFromCacheByQuery(cacheKey)).resolves.toEqual([
      { ...user, email: newEmail },
      unchanged
    ])
  })

  it("doesn't update expired cache data", async () => {
    await deleteDataFromCacheByQuery(cacheKey)

    await updateUserCache({ _id: 'userId', email: 'foo@bar.baz' })

    await expect(getDataFromCacheByQuery(cacheKey)).resolves.toBeNull()
  })
})

describe('deleteApplicantfromCache', () => {
  const cacheKey = 'cityId'
  it('allow to delete an applicant when cache is empty', async () => {
    await deleteDataFromCacheByQuery(cacheKey)

    await removeApplicantFromCache('userId', cacheKey)

    await expect(getDataFromCacheByQuery(cacheKey)).resolves.toBeNull()
  })
})

describe('updateApplicantCache', () => {
  it('allow to update an applicant when cache is empty', async () => {
    const applicant = await createStudent({
      category: STUDENT_CATEGORIES.applicant
    })
    await deleteDataFromCacheByQuery(applicant.cityId)

    await updateApplicantCache(applicant)

    await expect(getDataFromCacheByQuery(applicant.cityId)).resolves.toBeNull()
  })
})
