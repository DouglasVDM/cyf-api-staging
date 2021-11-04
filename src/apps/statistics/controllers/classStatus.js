import { logError } from '../../common/contexts/log'
import { getClassStatus } from '../services'
import { validateInputs } from '../useCases'

export const classStatus = async (req, res) => {
  try {
    const error = validateInputs(req.query)
    if (error) {
      return res.status(422).send(error)
    }
    const status = await getClassStatus(req.query)
    return res.status(200).send(status)
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not get status')
  }
}
