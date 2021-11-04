import { Schema, model } from 'mongoose'

const Admin = new Schema({
  fullName: {
    type: String,
    required: 'Please write your full name.',
    trim: true
  },
  userId: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: 'Please Write your email.',
    trim: true,
    lowercase: true
  },
  city: {
    type: String,
    required: 'please write your city.',
    trim: true
  },
  tel: {
    type: Number,
    trim: true
  },
  cyfRole: String,
  admin: {
    type: Boolean,
    default: null
  },
  date: {
    type: Date,
    default: new Date()
  }
})

const AdminModel = model('admin', Admin)

export default AdminModel
