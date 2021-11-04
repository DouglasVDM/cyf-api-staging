import { Schema, model } from 'mongoose'

export const ADMIN_STATUS = {
  pending: 'PENDING',
  verified: 'VERIFIED',
  suspended: 'SUSPENDED'
}
export const CYF_ROLES = ['VOLUNTEER', 'STUDENT', 'STAFF']

const userSchema = new Schema(
  {
    githubId: String,
    googleId: String,
    firstName: String,
    lastName: String,
    github_url: String,
    slackId: String,
    classId: String,
    email: {
      type: String,
      required: true,
      lowercase: true
    },
    avatar_url: String,
    accessToken: String,
    refreshToken: String,
    admin: {
      type: Boolean,
      default: false
    },
    adminStatus: {
      type: String,
      default: null
    },
    superAdmin: {
      type: Boolean,
      default: false
    },
    city: {
      type: String
    },
    tel: {
      type: String,
      trim: true
    },
    roles: {
      type: [String],
      enum: CYF_ROLES
    },
    cityId: String,
    token: String,
    agreeToTOU: {
      type: Boolean,
      default: false
    },
    agreeToReceiveCommunication: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
)

const UserModel = model('user', userSchema)

export default UserModel
