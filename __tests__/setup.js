import citiesModel from '../src/apps/common/contexts/cities/schema'
import factory, { MongooseAdapter } from 'factory-girl'
import userModel from '../src/apps/common/contexts/user/schema'
import { closeDbConnection } from '../src/db'
import { server } from '../src/index'
import EventsModel from '../src/apps/events/contexts/events/schema'
import StudentModel from '../src/apps/application_process/contexts/students/schema'
import ApplicantProgressModel from '../src/apps/application_process/contexts/applicant_progress/schema'
import StepModel from '../src/apps/application_process/contexts/steps/schema'
import VolunteerModel from '../src/apps/volunteer/contexts/volunteer/schema'
import AdminModel from '../src/apps/common/contexts/admin/schema'
import AppsModel from '../src/apps/common/contexts/apps/schema'

const testEnvPath = `${process.cwd()}/__tests__/.env`

require('dotenv').load(testEnvPath)

factory.setAdapter(new MongooseAdapter())

const setUp = async () => {
  await factory.define('user', userModel, buildOptions => ({
    email: factory.seq('user.email', n => `user${n}@codeyourfuture.io`),
    ...buildOptions
  }))

  await factory.define('apps', AppsModel, {
    name: factory.seq('apps.name', n => `app ${n}`)
  })

  await factory.define('cities', citiesModel, {
    name: factory.seq('cities.name', n => `city ${n}`),
    email: factory.seq('cities.email', n => `city${n}@codeyourfuture.io`),
    slackChannel: factory.seq('cities.slackChannel', n => `${n}`),
    slackChannelId: factory.seq('cities.slackChannelId', n => `${n}`)
  })
  await factory.define('admin', AdminModel, buildOptions => ({
    city: 'London',
    email: factory.seq('admin.email', n => `admin${n}@codeyourfuture.io`),
    fullName: factory.seq('admin.fullName', n => `admin ${n}`),
    tel: '01189998819991197253',
    ...buildOptions
  }))
  await factory.define('event', EventsModel, {
    name: factory.seq('event.name', n => `name ${n}`),
    occurAtDate: new Date('02-02-2019 18:00'),
    occurAtTime: new Date('02-02-2019 18:00'),
    finishAtTime: new Date('02-02-2019 19:00'),
    description: factory.seq(
      'event.description',
      n => `event ${n} is the big one`
    ),
    address: 'Perfect location',
    cityId: '11111',
    country: 'England',
    city: 'London',
    url: 'https://codeyourfuture.io',
    volunteers: []
  })
  await factory.define('student', StudentModel, buildOptions => {
    return {
      fullName: 'Jon Smith',
      userId: buildOptions.userId ? buildOptions.userId : 1,
      email: factory.seq('student.email', n => `jon${n}@fakemail.com`),
      city: 'London',
      tel: '1212121212',
      country: 'United Kingdom',
      experience: 'Basic',
      dateOfBirth: '1/1/2010',
      category: 'applicant'
    }
  })
  // TODO: add volunteer once model is confirmed
  await factory.define('volunteer', VolunteerModel, buildOptions => {
    return {
      status: 'NEW',
      userId: buildOptions.userId ? buildOptions.userId : 1,
      cityId: 'cityId',
      teamId: '98765434567',
      interestedInVolunteer: 'String',
      interestedInCYF: 'String',
      industry: 'String',
      hearAboutCYF: 'String',
      guidePeople: [
        {
          name: 'String',
          level: 'String'
        }
      ],
      techSkill: [
        {
          name: 'String',
          level: 'String'
        }
      ],
      otherSkill: [
        {
          name: 'String',
          level: 'String'
        }
      ]
    }
  })
  await factory.define('step', StepModel, buildOptions => ({
    name: factory.seq('step.name', n => `step${n}`),
    number: factory.seq('step.number', n => n),
    ...buildOptions
  }))
  await factory.define(
    'applicant_progress',
    ApplicantProgressModel,
    buildOptions => buildOptions
  )
}

const tearDown = async () => {
  await factory.cleanUp()
  await AdminModel.deleteMany({})
  await userModel.deleteMany({})
  await StudentModel.deleteMany({})
  await citiesModel.deleteMany({})
  await AppsModel.deleteMany({})
  await EventsModel.deleteMany({})
  await VolunteerModel.deleteMany({})
  await StepModel.deleteMany({})
  await ApplicantProgressModel.deleteMany({})
  await closeDbConnection()
  await server.close()
}

global.setUp = setUp
global.tearDown = tearDown
global.factory = factory
