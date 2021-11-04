import AppContext from '../contexts/apps'
import { logError } from '../contexts/log'
import {
  setCacheDataByQuery,
  getDataFromCacheByQuery
} from '../../helpers/redis'

export const getApps = async (req, res) => {
  try {
    const cachedVersion = await getDataFromCacheByQuery('get:apps')
    if (cachedVersion) {
      const parsedCacheVersion = cachedVersion
      res.cached = true
      res.status(200).send({
        apps: parsedCacheVersion
      })
    } else {
      const apps = await AppContext.findAll()
      await setCacheDataByQuery('get:apps', apps, 10)
      res.status(200).send({ apps, cached: false })
    }
  } catch (err) {
    await logError(err, req)
    res.status(400).send('Could not get apps')
  }
}

export const saveApp = async (req, res) => {
  const appData = req.body
  if (!appData.creatorId || !appData.name || !appData.token || !appData.url) {
    return res.sendStatus(400)
  }
  try {
    const app = await AppContext.create(appData)
    return res.status(201).send({
      app
    })
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not create App.')
  }
}

export const deleteApp = async (req, res) => {
  try {
    const app = await AppContext.hardDelete({ _id: req.params.appId })
    return res.status(204).send({
      app
    })
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not delete App.')
  }
}
