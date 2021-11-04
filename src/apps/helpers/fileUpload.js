import multer from 'multer'
import multerS3 from 'multer-s3'
import config, { s3 } from '../../config'

const fileUpload = multer({
  storage: multerS3({
    s3,
    bucket: config.aws.bucket,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata(req, file, cb) {
      cb(null, { filename: `${file.filename}` })
    },
    key(req, file, cb) {
      cb(null, `${Date.now().toString()}${file.originalname}`)
    }
  })
})

export default fileUpload
