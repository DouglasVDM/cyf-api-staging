import express from 'express'
import jwt from 'express-jwt'
import config from '../../config'
import {
  createOrUpdateStudentExpense,
  deleteExpense,
  getExpenses,
  getExpensesByUserId,
  updateExpense
} from './controllers/expenses'
import { adminOnly } from '../../helpers'

const router = express.Router()

router.use(jwt({ secret: config.jwtSecret }))

router.post('/expenses', createOrUpdateStudentExpense)
router.delete('/expenses/:expenseId', deleteExpense)
router.get('/expenses', adminOnly, getExpenses)
router.get('/expenses/:userId?', getExpensesByUserId)
router.put('/expenses/:userId?', updateExpense)

export default router
