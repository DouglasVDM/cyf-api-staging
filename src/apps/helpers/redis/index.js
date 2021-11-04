import Redis from 'ioredis'
import config from '../../../config'

const redisConnection =
  config.env !== 'test' ? config.cache.connection : config.cache.test
const redis = new Redis(redisConnection)

export const setCacheDataByQuery = async (query, data, time) => {
  const cacheTime = config.env === 'DEVELOPMENT' ? 1000000 : time
  try {
    await redis.set(query, JSON.stringify(data), 'EX', cacheTime)
  } catch (err) {
    throw new Error(err)
  }
}

export const getDataFromCacheByQuery = async query => {
  try {
    const data = await redis.get(query)
    return JSON.parse(data)
  } catch (err) {
    throw new Error(err)
  }
}

export const deleteDataFromCacheByQuery = query => redis.del(query)
