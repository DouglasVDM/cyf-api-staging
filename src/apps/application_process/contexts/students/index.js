import StudentService from './service'

const studentService = new StudentService()

export default {
  findOneStudent: query => studentService.findOneStudent(query),
  findAll: query => studentService.findAll(query),
  findStudents: (query, projection, populate, options) =>
    studentService.findStudents(query, projection, populate, options),
  create: studentData => studentService.create(studentData),
  findOneAndUpdate: (query, set) => studentService.findOneAndUpdate(query, set),
  hardDelete: query => studentService.hardDelete(query),
  findStep: (userId, stepId) => studentService.findStep(userId, stepId),
  showEmail: email => studentService.showEmail(email),
  aggregate: (pipeline, options) => studentService.aggregate(pipeline, options)
}
