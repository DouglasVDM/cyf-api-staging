import ApplicantProgressService from './service'

const applicantProgressService = new ApplicantProgressService()

export default {
  findAll: () => applicantProgressService.findAll(),
  show: id => applicantProgressService.show(id),
  findBy: id => applicantProgressService.findBy(id),
  findOneBy: query => applicantProgressService.findOneBy(query),
  create: set => applicantProgressService.create(set),
  findOneAndUpdate: (query, set) =>
    applicantProgressService.findOneAndUpdate(query, set),
  hardDelete: query => applicantProgressService.hardDelete(query)
}
