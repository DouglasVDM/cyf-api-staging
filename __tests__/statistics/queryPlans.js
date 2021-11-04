import { countStudentsMatchingConditionPipeline } from '../../src/apps/statistics'

afterAll(async () => {
  await global.tearDown()
})

const expectedPipeline = [
  {
    $lookup: {
      as: 'steps',
      from: 'applicant_progresses',
      let: { userId: '$userId' },
      pipeline: [
        { $match: { $expr: { $eq: ['$userId', '$$userId'] } } },
        {
          $lookup: {
            as: 'step',
            from: 'steps',
            let: { stepId: '$stepId' },
            pipeline: [
              {
                $match: { $expr: { $eq: [{ $toString: '$_id' }, '$$stepId'] } }
              }
            ]
          }
        },
        { $unwind: '$step' },
        {
          $project: {
            _id: 0,
            number: '$step.number',
            stepId: 1,
            updatedAt: 1,
            'urls.status': 1
          }
        }
      ]
    }
  },
  {
    $match: {
      $and: [
        { archived: { $ne: true } },
        { cityId: { $in: ['cityId'] } },
        { gender: { $in: ['gender'] } },
        {
          steps: {
            $elemMatch: {
              $and: [
                { number: { $in: [4.2] } },
                { 'urls.status': { $in: ['status'] } },
                { updatedAt: { $gte: new Date('2020-8-11') } }
              ]
            }
          }
        }
      ]
    }
  },
  { $count: 'count' }
]

describe('Statistics useCases queryPlans tests', () => {
  test(`countStudentsMatchingConditionPipeline, 
         It should return a valid Pipeline if data passed in`, () => {
    const inputs = {
      stepNumbers: [4.2],
      cyfCityIds: ['cityId'],
      genders: ['gender'],
      stepStatus: ['status'],
      stepUpdatedFromDate: ['2020-8-11']
    }
    const pipeline = countStudentsMatchingConditionPipeline(inputs)
    expect(pipeline).toEqual(expectedPipeline)
  })
})
