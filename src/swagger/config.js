import Router from 'express'
import * as path from 'path'
import swaggerJSDoc from 'swagger-jsdoc'
import { serve, setup } from 'swagger-ui-express'
import config from '../config'
const router = Router()

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'CYF API',
    version: '1.0.0',
    description:
      'This is a REST API application made with Express. It retrieves data from CODE YOUR FUTURE API.',
    license: {
      name: 'Licensed Under ISC',
      url: 'https://codeyourfuture.io/'
    },
    contact: {
      name: 'CYF',
      url: 'https://codeyourfuture.io/'
    }
  }
}

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: [path.join(__dirname, './routes/*.yaml')]
}
const supportedSubmitMethods =
  config.env === 'DEVELOPMENT' ? ['get', 'post', 'put', 'delete'] : ['get']
router.use('/', serve)
router.get(
  '/',
  setup(swaggerJSDoc(options), {
    swaggerOptions: {
      supportedSubmitMethods
    }
  })
)

export default router
