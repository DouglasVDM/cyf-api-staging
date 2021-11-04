import Pipedrive from 'pipedrive'
import CONSTS from './consts'

const { studentFields, peopleFieldsMapper } = CONSTS

export default class PipedriveDriver {
  constructor() {
    this.pipedrive = new Pipedrive.Client(
      process.env.PIPEDRIVE_API_AUTH_TOKEN,
      { strictMode: true }
    )
  }

  peopleFrontendToPipedrive(data, fields) {
    const mapper = peopleFieldsMapper[process.env.PIPEDRIVE_ACCOUNT]
    const transformedData = {}

    fields.forEach(key => {
      transformedData[mapper[key]] = data[key]
    })
    return transformedData
  }

  addStudent(data) {
    const people = this.peopleFrontendToPipedrive(data, studentFields)
    return new Promise((resolve, reject) => {
      const addPersonRequestBody = {
        ...people,
        owner_id: process.env.PIPEDRIVE_GENERAL_USER_ID,
        visible_to: 3
      }
      return this.pipedrive.Persons.add(
        addPersonRequestBody,
        (error, successData) => {
          if (error) {
            return reject(new Error('[400] Error while adding student.'))
          }

          const addDealRequestBody = {
            user_id: process.env.PIPEDRIVE_GENERAL_USER_ID,
            person_id: successData.id,
            visible_to: 3,
            stage_id: process.env.PIPEDRIVE_ADD_STUDENT_STAGE_ID,
            title: `${data.name} deal`
          }

          return this.pipedrive.Deals.add(addDealRequestBody, error2 => {
            if (error2) {
              return reject(new Error('[400] Error while adding student.'))
            }

            return resolve({
              status: 200,
              message: 'Student added successfully.',
              personId: successData.id
            })
          })
        }
      )
    })
  }

  static _peoplePipedriveToFrontend(data, fields) {
    const mapper = peopleFieldsMapper[process.env.PIPEDRIVE_ACCOUNT]
    const transformedData = {}

    fields.forEach(key => {
      transformedData[key] = data[mapper[key]]
    })
    return transformedData
  }
}
