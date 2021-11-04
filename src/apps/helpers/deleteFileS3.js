import config, { s3 } from '../../config'

export const deleteFile = async Key => {
  try {
    let params = {
      Bucket: config.aws.bucket,
      Key
    }
    s3.deleteObject(params, (err, data) => {
      if (err) {
        throw new Error(err)
      }
      return data
    })
  } catch (err) {
    throw new Error(err)
  }
}
