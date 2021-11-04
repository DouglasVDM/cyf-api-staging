import { logError } from '../../common/contexts/log'

export default async function imageUpload(req, res) {
  try {
    return res.status(200).json({ image: req.file.location })
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not upload image.')
  }
}
