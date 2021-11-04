import StepContext from '../../application_process/contexts/steps'

export const getStepIdByStepNumber = async stepNumber => {
  let step
  try {
    step = await StepContext.findOneBy({ number: stepNumber })
  } catch (err) {
    throw new Error('Can not get Step')
  }

  return step._id
}
