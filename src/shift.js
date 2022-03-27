const { DURATION } = require('./duration')
const {
	calcIsLeapYear,
	calcDaysInMonth,
	calcDayOfWeek,
	calcDaysSinceEpoch,
	_fromTimestamp,
	toTimestamp,
} = require('./date')
const { clone } = require('./clone')

const {
	day: dDay,
	hour: dHour,
	minute: dMinute,
	second: dSecond,
} = DURATION

const tmp = {}


const shiftTimestampYear = (t, x) => {
	_fromTimestamp(tmp, t)
	shiftYear$$$(tmp, x)
	return tmp.timestamp
}
const shiftTimestampMonth = (t, x) => {
	_fromTimestamp(tmp, t)
	shiftMonth$$$(tmp, x)
	return tmp.timestamp
}

const shiftTimestampDay = (t, x) => t + x * dDay
const shiftTimestampHour = (t, x) => t + x * dHour
const shiftTimestampMinute = (t, x) => t + x * dMinute
const shiftTimestampSecond = (t, x) => t + x * dSecond

const shiftTimestamp = (t, part, x) => {
	switch (part) {
		case 'years': case 'year': return shiftTimestampYear(t, x)
		case 'months': case 'month': return shiftTimestampMonth(t, x)
		case 'days': case 'day': return shiftTimestampDay(t, x)
		case 'hours': case 'hour': return shiftTimestampHour(t, x)
		case 'minutes': case 'minute': return shiftTimestampMinute(t, x)
		case 'seconds': case 'second': return shiftTimestampSecond(t, x)
		case 'milliseconds': case 'millisecond': return t + x
		default: return null
	}
}


const shiftYear$$$ = (date, x) => {
	date.year += x
	date.isLeapYear = calcIsLeapYear(date.year)
	date.timestamp = null
	date.timestamp = toTimestamp(date)
	date.daysInMonth = calcDaysInMonth(date.month, date.isLeapYear)
	const daysSinceEpoch = calcDaysSinceEpoch(date.timestamp)
	date.dayOfWeek = calcDayOfWeek(daysSinceEpoch)
	return date
}

const shiftYear = (date, x) => {
	const res = clone(date)
	return shiftYear$$$(res, x)
}

shiftYear.$$$ = shiftYear$$$

const shiftMonth$$$ = (date, x) => {
	if (date.day >= 28) { return shiftDay$$$(date, x * 30) }

	let _month = date.month - 1
	_month += x
	if (_month > 11) {
		date.year += Math.floor(_month / 12)
		_month %= 12
	} else if (_month < 0) {
		date.year += Math.floor(_month / 12)
		_month = 12 + (_month % 12)
	}
	date.month = _month + 1
	date.isLeapYear = calcIsLeapYear(date.year)
	date.timestamp = null
	date.timestamp = toTimestamp(date)
	date.daysInMonth = calcDaysInMonth(date.month, date.isLeapYear)
	const daysSinceEpoch = calcDaysSinceEpoch(date.timestamp)
	date.dayOfWeek = calcDayOfWeek(daysSinceEpoch)

	return date
}

const shiftMonth = (date, x) => {
	const res = clone(date)
	return shiftMonth$$$(res, x)
}

shiftMonth.$$$ = shiftMonth$$$

const shiftDay$$$ = (date, x) => {
	const timestamp = shiftTimestampDay(date.timestamp, x)
	_fromTimestamp(date, timestamp)
	return date
}

const shiftDay = (date, x) => {
	const res = clone(date)
	return shiftDay$$$(res, x)
}

shiftDay.$$$ = shiftDay$$$

const shiftHour$$$ = (date, x) => {
	const timestamp = shiftTimestampHour(date.timestamp, x)
	_fromTimestamp(date, timestamp)
	return date
}

const shiftHour = (date, x) => {
	const res = clone(date)
	return shiftHour$$$(res, x)
}

shiftHour.$$$ = shiftHour$$$

const shiftMinute$$$ = (date, x) => {
	const timestamp = shiftTimestampMinute(date.timestamp, x)
	_fromTimestamp(date, timestamp)
	return date
}

const shiftMinute = (date, x) => {
	const res = clone(date)
	return shiftMinute$$$(res, x)
}

shiftMinute.$$$ = shiftMinute$$$

const shiftSecond$$$ = (date, x) => {
	const timestamp = shiftTimestampSecond(date.timestamp, x)
	_fromTimestamp(date, timestamp)
	return date
}

const shiftSecond = (date, x) => {
	const res = clone(date)
	return shiftSecond$$$(res, x)
}

shiftSecond.$$$ = shiftSecond$$$

const shift$$$ = (date, part, x) => {
	switch (part) {
		case 'years': case 'year': return shiftYear$$$(date, x)
		case 'months': case 'month': return shiftMonth$$$(date, x)
		case 'days': case 'day': return shiftDay$$$(date, x)
		case 'hours': case 'hour': return shiftHour$$$(date, x)
		case 'minutes': case 'minute': return shiftMinute$$$(date, x)
		case 'seconds': case 'second': return shiftSecond$$$(date, x)
		case 'milliseconds': case 'millisecond': {
			_fromTimestamp(date, date.timestamp + x)
			return date
		}
		default: return null
	}
}

const shift = (date, part, x) => {
	const res = clone(date)
	return shift$$$(res, part, x)
}

shift.$$$ = shift$$$


module.exports = {
	shiftTimestampYear,
	shiftTimestampMonth,
	shiftTimestampDay,
	shiftTimestampHour,
	shiftTimestampMinute,
	shiftTimestampSecond,
	shiftTimestamp,
	shiftYear,
	shiftMonth,
	shiftDay,
	shiftHour,
	shiftMinute,
	shiftSecond,
	shift,
}
