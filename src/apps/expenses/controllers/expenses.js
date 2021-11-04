import { logError } from '../../common/contexts/log'
import UserContext from '../../common/contexts/user'
import { getUser } from '../../common/useCases/utils'
import ExpensesContext from '../contexts/expenses'
import { expenseStatusNotification } from '../useCases/util'

const getProfile = async expense => {
  try {
    const user = await getUser({ _id: expense.userId })
    return {
      ...user,
      ...expense
    }
  } catch (err) {
    throw new Error(err)
  }
}

export const getExpenses = async (req, res) => {
  try {
    const expenses = await ExpensesContext.findAll()
    const users = await Promise.all(
      expenses.map(expense => getProfile(expense))
    )
    return res.status(200).send({ expenses: users })
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not get Expenses.')
  }
}

export const createOrUpdateStudentExpense = async (req, res) => {
  try {
    const expenses = req.body
    let newExpenses = await ExpensesContext.findOneAndUpdate(
      {
        userId: req.user._id
      },
      {
        $addToSet: {
          expenses
        }
      }
    )
    if (!newExpenses) {
      newExpenses = await ExpensesContext.create({
        expenses,
        userId: req.user._id
      })
    }
    return res.status(200).send({ expense: newExpenses })
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not create Expenses.')
  }
}

export const deleteExpense = async (req, res) => {
  try {
    const expense = await ExpensesContext.hardDelete({
      _id: req.params.expenseId
    })
    return res.status(204).send({
      expense
    })
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('This expense was not deleted')
  }
}

export const getExpensesByUserId = async (req, res) => {
  try {
    const userId = req.user._id
    const expenses = await ExpensesContext.findAll({ userId })
    return res.status(200).send([expenses])
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not get Student Expenses.')
  }
}

export const updateExpense = async (req, res) => {
  const { userId, expenseId, status, comment } = req.body

  if (!userId) {
    return res.status(400).send('Bad Request')
  }

  try {
    const expense = await ExpensesContext.findOneAndUpdate(
      {
        userId,
        expenses: { $elemMatch: { _id: expenseId } }
      },
      {
        $set: {
          'expenses.$.status': status,
          'expenses.$.comment': comment
        }
      }
    )
    if (expense && status !== 'PENDING') {
      const user = await UserContext.findById({ _id: userId })
      if (user) {
        const { firstName, lastName, email } = user
        await expenseStatusNotification(
          `${firstName} ${lastName}`,
          email,
          status.toLowerCase(),
          comment
        )
      }
    }
    return res.status(200).send({
      expense
    })
  } catch (err) {
    await logError(err, req)
    return res.status(400).send('Could not edit Expense.')
  }
}
