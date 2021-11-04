import dayjs from 'dayjs'

// Check steps status if approved, rejected or submitted
export function getStepStatus(steps, actions) {
  if (steps.length === 0) {
    return [actions.includes('Not submitted')]
  }
  return steps.map(step => {
    if (step && step.urls && step.urls.length > 0) {
      return actions.includes(step.urls[step.urls.length - 1].status)
    }
    return false
  })
}
//check for step number
export function getStepNumber(steps, stepsFilters) {
  return steps.map(step => {
    return stepsFilters.includes(step.number.toString())
  })
}
//check for step 4 if is has been approved by admins
export function checkIfApplicantIsCompleted(steps) {
  return steps.map(step => {
    if (step.number === 5 && step.status === 'Approved') {
      return true
    }
  })
}

const checkStepsActivity = steps => {
  return steps.map(step => {
    if (dayjs().diff(step.updatedAt, 'month') < 1) {
      return true
    }
    return false
  })
}

// Check the applicant status if he/she is new, active or inactive
export function applicantStatusFilter(applicant, status) {
  if (
    (applicant && !applicant.steps) ||
    (applicant &&
      applicant.steps &&
      applicant.steps.length === 0 &&
      dayjs().diff(applicant.createdAt, 'month') < 1 &&
      status.includes('New'))
  ) {
    return true
  }
  if (
    applicant &&
    applicant.steps &&
    applicant.steps.length > 0 &&
    checkStepsActivity(applicant.steps).includes(true) &&
    status.includes('Active')
  ) {
    return true
  }
  if (
    applicant &&
    applicant.steps &&
    applicant.steps.length > 0 &&
    checkStepsActivity(applicant.steps).includes(false) &&
    status.includes('Inactive')
  ) {
    return true
  }
  if (
    applicant &&
    applicant.steps &&
    applicant.steps.length > 0 &&
    checkIfApplicantIsCompleted(applicant.steps).includes(true) &&
    status.includes('Completed')
  ) {
    return true
  }
  if (applicant && applicant.archived && status.includes('Archived')) {
    return true
  }
  return false
}

export const applicantPhoneCallFilter = (applicant, phoneCall) => {
  if (applicant) {
    if (!applicant.phoneCalls || applicant.phoneCalls.length === 0) {
      return phoneCall.includes('PENDING')
    } else {
      return phoneCall.includes(
        applicant.phoneCalls[applicant.phoneCalls.length - 1].status
      )
    }
  }
}
export const applicantWorkshopsFilter = (applicant, workshop) => {
  if (applicant) {
    if (!applicant.workshops || applicant.workshops.length === 0) {
      return workshop.includes('0')
    } else if (applicant.workshops.length >= 3) {
      return workshop.includes('3+')
    } else {
      return workshop.includes(String(applicant.workshops.length))
    }
  }
}
export const applicantdateFilter = (applicant, dateFilter) => {
  if (applicant && applicant.createdAt) {
    let applicantBefore12months = false
    let includeDate = []
    const createdAt = dayjs(applicant.createdAt)
    const date12mAgo = dayjs().subtract(12, 'month')
    if (dateFilter.includes('12+')) {
      applicantBefore12months = createdAt.isBefore(date12mAgo)
    }
    const dateFilterWithout12Before = dateFilter.filter(
      filterValue => filterValue !== '12+'
    )
    includeDate = dateFilterWithout12Before.map(date => {
      const dateAgo = dayjs().subtract(date, 'month')
      if (createdAt.isAfter(dateAgo)) {
        return 'included'
      }
    })
    if (includeDate.includes('included') || applicantBefore12months) {
      return true
    }
  }
  return false
}
export const checkStepMessages = (step, userId) => {
  if (step && step.messages && step.messages.length > 0) {
    if (step.messages[step.messages.length - 1].senderId === userId) {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}
export const applicantNewMessagesFilter = applicant => {
  if (applicant) {
    if (!applicant.steps || applicant.steps.length === 0) {
      return [false]
    } else {
      return applicant.steps.map(step => {
        return checkStepMessages(step, applicant._id)
      })
    }
  }
}

export const checkApplicantsByDate = (applicant, applicantsByDate) => {
  const app_created_at = new Date(applicant.createdAt)
  const fromDate = new Date(applicantsByDate[1])
  const toDate = new Date(applicantsByDate[0])
  if (app_created_at <= fromDate && app_created_at >= toDate) {
    return true
  } else {
    return false
  }
}

export async function filterApplicantsByQuery(searchFilters, applicants) {
  applicants = searchFilters.genders
    ? applicants.filter(applicant => {
        return searchFilters.genders.includes(applicant.gender)
      })
    : applicants

  applicants =
    searchFilters.applicantsByDate && searchFilters.applicantsByDate[0]
      ? applicants.filter(applicant => {
          return checkApplicantsByDate(
            applicant,
            searchFilters.applicantsByDate
          )
        })
      : applicants

  applicants = searchFilters.actions
    ? applicants.filter(applicant => {
        return getStepStatus(applicant.steps, searchFilters.actions).includes(
          true
        )
      })
    : applicants
  applicants = searchFilters.steps
    ? applicants.filter(applicant => {
        return getStepNumber(applicant.steps, searchFilters.steps).includes(
          true
        )
      })
    : applicants
  applicants = searchFilters.status
    ? applicants.filter(applicant => {
        return applicantStatusFilter(applicant, searchFilters.status)
      })
    : applicants.filter(applicant => {
        return !applicant.archived
      })
  applicants = searchFilters.phoneCall
    ? applicants.filter(applicant => {
        return applicantPhoneCallFilter(applicant, searchFilters.phoneCall)
      })
    : applicants
  applicants = searchFilters.workshops
    ? applicants.filter(applicant => {
        return applicantWorkshopsFilter(applicant, searchFilters.workshops)
      })
    : applicants
  applicants = searchFilters.dateFilter
    ? applicants.filter(applicant => {
        return applicantdateFilter(applicant, searchFilters.dateFilter)
      })
    : applicants
  applicants = searchFilters.messages
    ? applicants.filter(applicant => {
        return applicantNewMessagesFilter(
          applicant,
          searchFilters.messages
        ).includes(true)
      })
    : applicants
  return applicants
}

export const getStatsFromStudentGroup = studentGroup => {
  return {
    total: studentGroup.length,
    gender: {
      male: studentGroup.filter(
        student => student.gender && student.gender.toLowerCase() === 'male'
      ).length,
      female: studentGroup.filter(
        student => student.gender && student.gender.toLowerCase() === 'female'
      ).length,
      other: studentGroup.filter(
        student => student.gender && student.gender.toLowerCase() === 'other'
      ).length,
      preferNotToSay: studentGroup.filter(
        student =>
          (student.gender &&
            student.gender.toLowerCase() === 'PreferNotToSay') ||
          (student.gender &&
            student.gender.toLowerCase() === "don't want to say")
      ).length,
      notRecorded: studentGroup.filter(
        student => !student.gender || student.gender === ''
      ).length
    },
    disadvantagedBackground: studentGroup.filter(
      student => student.disadvantagedBackground
    ).length,
    isAsylumSeekerOrRefugee: studentGroup.filter(
      student => student.isAsylumSeekerOrRefugee
    ).length,
    employment: {
      fullTime: studentGroup.filter(
        student => student.currentlyEmployed === 'Full-time'
      ).length,
      partTime: studentGroup.filter(
        student => student.currentlyEmployed === 'Part-time'
      ).length,
      unemployed: studentGroup.filter(
        student => student.currentlyEmployed === 'Unemployed'
      ).length
    },
    experience: {
      none: studentGroup.filter(student => student.experience === 'None')
        .length,
      basic: studentGroup.filter(student => student.experience === 'Basic')
        .length,
      advanced: studentGroup.filter(
        student => student.experience === 'Advanced'
      ).length
    },
    itAccess: studentGroup.filter(student => student.itAccess).length
  }
}
