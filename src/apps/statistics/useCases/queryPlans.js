import { arrayOfStringToInCondition, arrayOfNumberToInCondition } from './utils'

export const countApplicantsQuery = (steps, cities, fromDate = '2019-9-1') => {
  const stepStatus = 'Approved'
  const pipeline = [
    {
      $lookup: {
        from: 'applicant_progresses',
        localField: 'userId',
        foreignField: 'userId',
        as: 'steps'
      }
    },
    { $unwind: '$steps' },
    {
      $match: {
        $and: [
          arrayOfStringToInCondition(cities, 'cityId'),
          {
            $and: [arrayOfStringToInCondition(steps, 'steps.stepId')]
          },
          { 'steps.status': stepStatus },
          { 'steps.updatedAt': { $gt: new Date(fromDate) } }
        ]
      }
    },
    {
      $group: { _id: '$userId' }
    },
    { $count: 'count' }
  ]

  return pipeline
}

export const countStudentsMatchingConditionPipeline = inputs => {
  const {
    stepNumbers,
    cyfCityIds,
    genders,
    stepStatus,
    stepUpdatedFromDate,
    archived = false
  } = inputs

  const inStepUpdatedFromDate = stepUpdatedFromDate
    ? {
        updatedAt: { $gte: new Date(stepUpdatedFromDate) }
      }
    : {}

  const inStepNumbers = stepNumbers
    ? arrayOfNumberToInCondition(stepNumbers, 'number')
    : {}

  const inCyfCityIds = cyfCityIds
    ? arrayOfStringToInCondition(cyfCityIds, 'cityId')
    : {}
  const inGenders = genders ? arrayOfStringToInCondition(genders, 'gender') : {}

  const inStepStatus = stepStatus
    ? arrayOfStringToInCondition(stepStatus, 'urls.status')
    : {}
  const stepStatements =
    stepNumbers || stepStatus || stepUpdatedFromDate
      ? {
          steps: {
            $elemMatch: {
              $and: [inStepNumbers, inStepStatus, inStepUpdatedFromDate]
            }
          }
        }
      : {}
  const pipeline = [
    {
      $lookup: {
        from: 'applicant_progresses',
        let: { userId: '$userId' },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ['$userId', '$$userId'] }
            }
          },
          {
            $lookup: {
              from: 'steps',
              let: { stepId: '$stepId' },
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $eq: [{ $toString: '$_id' }, '$$stepId']
                    }
                  }
                }
              ],
              as: 'step'
            }
          },
          { $unwind: '$step' },
          {
            $project: {
              _id: 0,
              stepId: 1,
              'urls.status': 1,
              updatedAt: 1,
              number: '$step.number'
            }
          }
        ],
        as: 'steps'
      }
    },
    {
      $match: {
        $and: [
          { archived: { $ne: !archived } },
          inCyfCityIds,
          inGenders,
          stepStatements
        ]
      }
    },
    { $count: 'count' }
  ]

  return pipeline
}
