
const clone = (date) => ({
	timestamp: date.timestamp,
	year: date.year,
	month: date.month,
	day: date.day,
	hour: date.hour,
	minute: date.minute,
	second: date.second,
	millisecond: date.millisecond,
	isLeapYear: date.isLeapYear,
	daysInMonth: date.daysInMonth,
	dayOfWeek: date.dayOfWeek,
})

module.exports = { clone }
