import Dao from '../../../../libraries/dao'
import StudentModel from './schema'

export default class StudentDao extends Dao {
  constructor() {
    super(StudentModel)
  }

  async create(studentData) {
    const student = new StudentModel(studentData)
    return student.save()
  }
}
