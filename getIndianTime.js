const moment = require("moment-timezone")

function getIndianTime() {
  const indianTime = moment().tz("Asia/Kolkata")

  // Log the current time in India
  // console.log(`Current time in India: ${indianTime.format("YYYY/MM/DD HH:mm:ss")}`);

  const isAfter630AM = indianTime.isSameOrAfter(
    indianTime.clone().set({ hour: 6, minute: 30 })
  )

  if (isAfter630AM) {
    // If it's 5:30 AM IST or later, return the formatted date
    return indianTime.format("YYYY/MM/DD")
  } else {
    // If it's before 5:30 AM IST, return the date from the previous day
    const previousDay = indianTime
      .clone()
      .subtract(1, "day")
      .format("YYYY/MM/DD")
    return previousDay
  }
}

module.exports = { getIndianTime }
