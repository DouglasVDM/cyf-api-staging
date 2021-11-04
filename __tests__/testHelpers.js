import { ADMIN_STATUS } from '../src/apps/common/contexts/user/schema'
import { STUDENT_CATEGORIES } from '../src/apps/application_process/contexts/students/schema'
import CityService from '../src/apps/common/contexts/cities/service'

const cityService = new CityService()

const findOrCreateCity = async () => {
  let [city] = await cityService.findAll()
  if (!city) {
    city = await global.factory.create('cities')
  }
  return city
}

export const createAdmin = async overrides => {
  const city = await findOrCreateCity()
  const admin = await global.factory.create(
    'user',
    {},
    {
      admin: true,
      adminStatus: ADMIN_STATUS.verified,
      cityId: city._id.toJSON(),
      superAdmin: false,
      ...overrides
    }
  )
  await global.factory.create('admin', {}, { userId: admin._id.toJSON() })
  return admin
}

export const createStudent = async overrides => {
  const student = await global.factory.create('user', {}, {})
  await global.factory.create(
    'student',
    {},
    {
      category: STUDENT_CATEGORIES.student,
      userId: student._id.toJSON(),
      ...overrides
    }
  )
  return student
}

export const createApplication = async () => {
  const apps = await global.factory.create('apps', {})

  return apps
}

export const createVolunteer = async overrides => {
  const city = await findOrCreateCity()
  const volunteer = await global.factory.create(
    'user',
    {},
    {
      cityId: city._id.toJSON()
    }
  )
  await global.factory.create(
    'volunteer',
    {},
    {
      userId: volunteer._id.toJSON(),
      ...overrides
    }
  )
  return volunteer
}
