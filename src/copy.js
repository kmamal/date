
const copy = (dst, src) => {
	dst.timestamp = src.timestamp
	dst.year = src.year
	dst.month = src.month
	dst.day = src.day
	dst.hour = src.hour
	dst.minute = src.minute
	dst.second = src.second
	dst.millisecond = src.millisecond
	dst.isLeapYear = src.isLeapYear
	dst.daysInMonth = src.daysInMonth
	dst.dayOfWeek = src.dayOfWeek
}

module.exports = { copy }
