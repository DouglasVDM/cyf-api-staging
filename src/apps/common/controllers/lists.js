import ListContext from '../contexts/lists'
export const createList = async (req, res) => {
  try {
    const newList = await ListContext.findOrCreate(req.body)
    return res.status(200).json(newList)
  } catch (err) {
    return res.status(500).json(err)
  }
}

export const getLists = async (req, res) => {
  try {
    const lists = await ListContext.findAll()
    return res.status(200).json(lists)
  } catch (err) {
    return res.status(500).json(err)
  }
}

export const editList = async (req, res) => {
  try {
    const list = await ListContext.findOneAndUpdate(
      { _id: req.params.id },
      req.body
    )
    return res.status(200).json(list)
  } catch (err) {
    return res.status(500).json(err)
  }
}

export const deleteList = async (req, res) => {
  const { id } = req.params
  try {
    const newList = await ListContext.deleteById({ _id: id })
    return res.status(200).json(newList)
  } catch (err) {
    return res.status(500).json(err)
  }
}
