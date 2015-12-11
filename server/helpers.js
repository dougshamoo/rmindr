var moment = require('moment-timezone');

//
//================================HELPERS===================================//

function convertLocalToUTC(datetimeLocal, timezone) {
  return moment.tz(datetimeLocal, timezone)
    .clone()
    .tz('UTC')
    .format('x');
}

function getJobDelayFromLocalTime(datetimeLocal, timezone) {
  // Convert local datetime + timezone from server into UTC time
  var datetimeUTC = convertLocalToUTC(datetimeLocal, timezone);

  // Calculate the desired delay in milliseconds
  var jobDelay = datetimeUTC - Date.now();

  return jobDelay;
}

module.exports = {
  convertLocalToUTC: convertLocalToUTC,
  getJobDelayFromLocalTime: getJobDelayFromLocalTime,
};