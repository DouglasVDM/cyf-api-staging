import AdminService from './service'

const adminService = new AdminService()

export default {
  show: userId => adminService.show(userId),
  findAll: () => adminService.findAll(),
  create: adminData => adminService.create(adminData),
  findOneAndUpdate: (query, set) => adminService.findOneAndUpdate(query, set)
}
