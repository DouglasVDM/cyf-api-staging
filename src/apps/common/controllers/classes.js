import ClassContext from '../contexts/classes'

export const createClass = async (req, res) => {
  try {
    const newClass = await ClassContext.create(req.body)
    return res.status(200).json(newClass)
  } catch (err) {
    return res.status(500).json(err)
  }
}

export const getClass = async (req, res) => {
  try {
    const newClass = await ClassContext.findAll()
    return res.status(200).json(newClass)
  } catch (err) {
    return res.status(500).json(err)
  }
}

export const editClass = async (req, res) => {
  const { classData, _id } = req.body
  try {
    const newClass = await ClassContext.findOneAndUpdate({ _id }, classData)
    return res.status(200).json(newClass)
  } catch (err) {
    return res.status(500).json(err)
  }
}

export const deleteClass = async (req, res) => {
  const { _id } = req.body
  try {
    const newClass = await ClassContext.hardDelete({ _id })
    return res.status(200).json(newClass)
  } catch (err) {
    return res.status(500).json(err)
  }
}
