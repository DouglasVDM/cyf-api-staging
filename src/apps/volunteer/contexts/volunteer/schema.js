import { Schema, model } from 'mongoose'

export const volunteerStatus = {
  NEW: 'NEW',
  INDUCTED: 'INDUCTED',
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  LEADER: 'LEADER'
}

export const volunteerTeams = {
  EDUCATION: 'EDUCATION',
  OUTREACH: 'OUTREACH',
  MARKETING: 'MARKETING'
}
const comments = new Schema({
  userId: String,
  senderName: String,
  comment: String,
  createdAt: Date,
  updatedAt: Date
})
const Volunteer = new Schema(
  {
    userId: String,
    cityId: String,
    listId: String,
    pos: Number,
    teamId: String,
    volunteerStatus: {
      type: String,
      default: 'NEW'
    },
    interestedInVolunteer: String,
    interestedInCYF: String,
    industry: String,
    hearAboutCYF: String,
    guidePeople: [
      {
        name: String,
        level: String
      }
    ],
    techSkill: [
      {
        name: String,
        level: String
      }
    ],
    otherSkill: [
      {
        name: String,
        level: String
      }
    ],
    archived: {
      type: Boolean,
      default: false
    },
    comments: [comments]
  },
  { timestamps: { createdAt: true, updatedAt: true } }
)

const VolunteerModel = model('volunteer', Volunteer)

export default VolunteerModel
