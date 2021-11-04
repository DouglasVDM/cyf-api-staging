import request from 'supertest'
import { createAdmin, createStudent } from '../../testHelpers'
import createJwtToken from '../../../src/apps/helpers/jwtTokenCreator'
import { server } from '../../../src/index'
import StepModel from '../../../src/apps/application_process/contexts/steps/schema'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)
const stepBody = {
  showImageUpload: false,
  showSubmitUrl: true,
  showMotivationalLetter: false,
  number: 1,
  name: 'Sololearn',
  header: 'HTML, CSS and JS',
  description: 'description',
  instructions: 'instructions',
  image: 'image',
  optional: false,
  device: 'MEDIA',
  category: 'APPLICATION_PROCESS',
  youTubEmbedVideo: 'youTubEmbedVideo',
  version: 1,
  eligibilityFromDate: '2020-08-10',
  eligibilityToDate: '2022-08-10',
  acceptanceCriteria: []
}
const skippedFields = {
  _id: expect.stringMatching(/[0-9a-z]{24}/),
  __v: expect.any(Number),
  createdAt: expect.stringMatching(
    /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/
  ),
  updatedAt: expect.stringMatching(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/)
}
const stepAsStored = {
  ...stepBody,
  eligibilityFromDate: '2020-08-10T00:00:00.000Z',
  eligibilityToDate: '2022-08-10T23:59:59.999Z'
}
const visibleStepName = 'see this step'
const eligibilityTestSteps = [
  {
    ...stepBody,
    name: 'dont see this step',
    number: 1,
    eligibilityFromDate: dayjs
      .utc()
      .add(-5, 'day')
      .format('YYYY-MM-DD'),
    eligibilityToDate: dayjs
      .utc()
      .add(-1, 'day')
      .format('YYYY-MM-DD')
  },
  {
    ...stepBody,
    name: visibleStepName,
    number: 2,
    eligibilityFromDate: dayjs
      .utc()
      .add(-10, 'day')
      .format('YYYY-MM-DD'),
    eligibilityToDate: dayjs
      .utc()
      .add(10, 'day')
      .format('YYYY-MM-DD')
  },
  {
    ...stepBody,
    name: visibleStepName,
    number: 3,
    eligibilityFromDate: dayjs.utc().format('YYYY-MM-DD'),
    eligibilityToDate: dayjs
      .utc()
      .add(1, 'day')
      .format('YYYY-MM-DD')
  },
  {
    ...stepBody,
    name: visibleStepName,
    number: 4,
    eligibilityFromDate: dayjs
      .utc()
      .add(-1, 'day')
      .format('YYYY-MM-DD'),
    eligibilityToDate: dayjs.utc().format('YYYY-MM-DD')
  },
  {
    ...stepBody,
    name: 'dont see this step',
    number: 5,
    eligibilityFromDate: dayjs
      .utc()
      .add(1, 'day')
      .format('YYYY-MM-DD'),
    eligibilityToDate: dayjs
      .utc()
      .add(10, 'day')
      .format('YYYY-MM-DD')
  }
]
const users = {}
const tokens = {}
beforeAll(async () => {
  await global.setUp()
  users.student = await createStudent()
  users.superAdmin = await createAdmin({ superAdmin: true })
  tokens.student = await createJwtToken(users.student)
  tokens.superAdmin = await createJwtToken(users.superAdmin)
})
afterAll(async () => {
  await global.tearDown()
})

describe('steps functionality', () => {
  it('should allow superAdmin to create a step via the API', async () => {
    await request(server)
      .post('/application-process/step')
      .set('Authorization', `Bearer ${tokens.superAdmin}`)
      .send(stepBody)
      .expect(200)
      .then(({ body: { step } }) => {
        expect(step).toEqual(
          expect.objectContaining({
            ...stepAsStored,
            ...skippedFields
          })
        )
      })
    const response = await request(server)
      .get('/application-process/steps')
      .set('Authorization', `Bearer ${tokens.superAdmin}`)
    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      steps: [
        {
          ...stepAsStored,
          ...skippedFields
        }
      ]
    })
  })
  it('should allow superAdmin to edit a step', async () => {
    const editedStep = {
      ...stepBody,
      eligibilityFromDate: dayjs
        .utc(stepBody.eligibilityFromDate)
        .startOf('day')
        .format('YYYY[-]MM[-]DD[T]HH[:]mm[:]ss[.]SSS[Z]'),
      eligibilityToDate: dayjs
        .utc()
        .add(2, 'day')
        .endOf('day')
        .format('YYYY[-]MM[-]DD[T]HH[:]mm[:]ss[.]SSS[Z]'),
      ...skippedFields
    }
    const response = await request(server)
      .get('/application-process/steps')
      .set('Authorization', `Bearer ${tokens.superAdmin}`)
    expect(response.status).toBe(200)
    await request(server)
      .put('/application-process/step')
      .set('Authorization', `Bearer ${tokens.superAdmin}`)
      .send({
        _id: response.body.steps[0]._id,
        stepData: {
          ...stepBody,
          eligibilityToDate: dayjs
            .utc()
            .add(2, 'day')
            .format('YYYY-MM-DD')
        }
      })
      .expect(200)
      .then(({ body: { step } }) => {
        expect(step).toEqual(editedStep)
      })
    await request(server)
      .get('/application-process/steps')
      .set('Authorization', `Bearer ${tokens.superAdmin}`)
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({
          steps: [
            {
              ...editedStep,
              ...skippedFields
            }
          ]
        })
      })
  })
})
describe('Eligibility Functionality', () => {
  describe('Response to GET /application-process/applicant should only include eligible Steps', () => {
    it('should return all steps where the Student created their account within the eligibility range and none outside that', async () => {
      await StepModel.deleteMany({})
      await Promise.all(
        eligibilityTestSteps.map(testStep => {
          return request(server)
            .post('/application-process/step')
            .set('Authorization', `Bearer ${tokens.superAdmin}`)
            .send(testStep)
        })
      )
      const response = await request(server)
        .get('/application-process/applicant')
        .set('Authorization', `Bearer ${tokens.student}`)
      expect(response.status).toBe(200)
      expect(response.body.steps.length).toBe(
        eligibilityTestSteps.filter(step => step.name === visibleStepName)
          .length
      )
      response.body.steps.forEach(step => {
        expect(step).toHaveProperty('name', visibleStepName)
      })
    })
  })
})
