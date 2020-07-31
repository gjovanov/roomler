import moment from 'moment/moment'
import 'moment/locale/en-gb'
class DatetimeUtils {
  toHoursFormat (date) {
    return moment(date).format('HH:mm')
  }
}

export const datetimeUtils = new DatetimeUtils()
