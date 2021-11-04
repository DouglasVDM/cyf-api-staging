const peopleCommonFields = {
  fullName: 'name',
  email: 'email',
  tel: 'phone'
}
const peopleFieldsMapper = {
  production: {
    ...peopleCommonFields,
    country: '4486f55ec00abba1ec3def80376df83aeacbb6f7',
    city: '34621972a532f75f010b784dc6b7ac1d8c0ef72a',
    status: '2a77da4864c41c5f14820c52ee3dfcd887edda74',
    experience: 'eedf6a41c8ffd5830467a92adfb57323a0b5ad6a'
  },
  staging: {
    ...peopleCommonFields,
    country: '51ffbd9a95c4071c56dc967b428752cd617ab6f8',
    city: '53fb3d3f3ce765475ad4f7cff94a2b0f1152defb',
    status: '2d830da1d32ee5419d401c092ae558c2112c2dff',
    experience: '82a53859c7627eff4a0ce9fbfd9a388a2004b003'
  }
}

const studentFields = [
  'fullName',
  'email',
  'tel',
  'country',
  'city',
  'status',
  'experience'
]
module.exports = {
  peopleFieldsMapper,
  studentFields
}
