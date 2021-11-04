import { logError } from '../../common/contexts/log'
import { deleteFile } from '../../helpers/deleteFileS3'

export async function imageUpload(req, res) {
  try {
    return res.status(200).json({ image: req.file.location })
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not upload image.')
  }
}

export const deleteImage = async (req, res) => {
  try {
    const { file } = req.body
    let filename = file.substring(file.lastIndexOf('/') + 1)
    const deletedFile = await deleteFile(filename)
    return res.status(200).json({ deletedFile })
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not upload image.')
  }
}
