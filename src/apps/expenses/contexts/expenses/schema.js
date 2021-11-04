import { model, Schema } from 'mongoose'

const Expense = new Schema({
  expenseType: {
    type: String,
    required: 'Please select expense type.',
    trim: true,
    enum: ['Childcare', 'Transport', 'Food', 'Internet', 'Work Experience']
  },
  amount: {
    type: Number,
    required: 'Please write the amount.',
    trim: true
  },
  currency: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    required: 'Please upload a receipt.'
  },
  occurAtDate: {
    type: Date,
    required: 'Please select expense date.'
  },
  comment: String,
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING'
  },
  createdAt: Date
})

const ExpensesClaim = new Schema(
  {
    userId: {
      type: String,
      required: 'User ID is required.',
      trim: true
    },
    expenses: [Expense]
  },
  { timestamps: { createdAt: true, updatedAt: true } }
)

const ExpenseModel = model('expense', ExpensesClaim)

export default ExpenseModel
