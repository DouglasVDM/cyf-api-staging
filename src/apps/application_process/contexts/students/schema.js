import { Schema, model } from 'mongoose'

export const STUDENT_CATEGORIES = {
  applicant: 'applicant',
  student: 'student',
  alumni: 'alumni'
}
const phoneCalls = new Schema(
  {
    status: {
      type: String,
      enum: ['FAIL', 'SUCCESS', 'PENDING'],
      default: 'PENDING'
    },
    comment: String,
    callMakerId: String,
    callMakerName: String
  },
  { timestamps: { createdAt: true, updatedAt: true } }
)

const workshops = new Schema(
  {
    status: {
      type: String,
      enum: ['ATTENDED', 'NOT_ATTENDED', 'PENDING'],
      default: 'PENDING'
    },
    comment: String,
    IdsubmittedBy: String,
    NameSubmittedBy: String
  },
  { timestamps: { createdAt: true, updatedAt: true } }
)
const Student = new Schema(
  {
    fullName: {
      type: String,
      required: 'Please write your full name.',
      trim: true,
      index: true
    },
    email: {
      type: String,
      required: 'Please write your email.',
      trim: true,
      lowercase: true
    },
    city: {
      type: String,
      required: 'please write your city.',
      trim: true,
      index: true
    },
    tel: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      required: 'Please Write your original country.',
      trim: true
    },
    experience: {
      type: String,
      required: 'Please select an option.',
      trim: true,
      enum: ['None', 'Basic', 'Intermediate', 'Advanced']
    },
    hearAbout: String,
    isEighteen: Boolean,
    userId: {
      type: String,
      required: true,
      index: true
    },
    itAccess: Boolean,
    isAsylumSeekerOrRefugee: Boolean,
    disadvantagedBackground: Boolean,
    disadvantagedBackgroundDescribe: String,
    currentlyEmployed: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Unemployed']
    },
    studying: String,
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', 'PreferNotToSay']
    },
    dateOfBirth: {
      type: Date,
      required: 'Please enter your date of birth',
      trim: true
    },
    cityId: {
      type: String,
      default: null,
      index: true
    },
    classId: {
      type: String,
      index: true
    },
    availableOnWhatsApp: Boolean,
    category: {
      required: 'Please select applicant, student or alumni.',
      type: String,
      enum: Object.values(STUDENT_CATEGORIES),
      index: true
    },
    applicationAccepted: {
      type: Boolean,
      default: false
    },
    archived: {
      type: Boolean,
      default: false
    },
    phoneCalls: [phoneCalls],
    workshops: [workshops]
  },
  { timestamps: { createdAt: true, updatedAt: true } }
)

const StudentModel = model('student', Student)

export default StudentModel
