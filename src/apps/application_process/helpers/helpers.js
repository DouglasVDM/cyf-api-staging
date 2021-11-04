const sortSteps = key => {
  let sortOrder = 1
  if (key[0] === '-') {
    sortOrder = -1
  }
  return (a, b) => {
    if (a[key].toLowerCase() < b[key].toLowerCase()) {
      return -1 * sortOrder
    }
    if (a[key].toLowerCase() > b[key].toLowerCase()) {
      return 0 * sortOrder
    }
    return 0 * sortOrder
  }
}

const formateDate = today => {
  const dd = String(today.getDate()).padStart(2, '0')
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const yyyy = today.getFullYear()
  return `${mm}/${dd}/${yyyy}`
}

const calculatingNumberOfMessages = allStepsMessages => {
  const step1Messages =
    allStepsMessages[0] && allStepsMessages[0].messages
      ? allStepsMessages[0].messages.length
      : 0
  const step2Messages =
    allStepsMessages[1] && allStepsMessages[1].messages
      ? allStepsMessages[1].messages.length
      : 0
  const step3Messages =
    allStepsMessages[2] && allStepsMessages[2].messages
      ? allStepsMessages[2].messages.length
      : 0
  const step4Messages =
    allStepsMessages[3] && allStepsMessages[3].messages
      ? allStepsMessages[3].messages.length
      : 0

  return step1Messages + step2Messages + step3Messages + step4Messages
}
export { sortSteps, formateDate, calculatingNumberOfMessages }
