import CityContext from '../../common/contexts/cities'

export const getCityIdByCityName = async name => {
  let city
  try {
    city = await CityContext.findOneBy({ name })
  } catch (err) {
    throw new Error('Can not get City')
  }
  return city._id
}
