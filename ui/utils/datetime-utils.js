import * as moment from 'moment'
class DatetimeUtils {
  toHoursFormat (date) {
    return moment(date).format('HH:mm')
  }
}

export const datetimeUtils = new DatetimeUtils()
