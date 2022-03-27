const { DURATION } = require('./duration')
const {
	_fromTimestamp,
	toTimestamp,
	calcYear,
	calcDaysSinceEpoch,
	calcYearFromDaysSinceEpoch,
	calcMonthFromDaysSinceYear,
} = require('./date')
const { clone } = require('./clone')
const {
	floorTo,
	ceilTo,
	roundTo,
} = require('../number/rounding')

const {
	day: dDay,
	hour: dHour,
	minute: dMinute,
	second: dSecond,
} = DURATION


const floorTimestampYear = (t) => {
	const year = calcYear(t)
	return toTimestamp({ year })
}
const floorTimestampMonth = (t) => {
	const daysSinceEpoch = calcDaysSinceEpoch(t)
	const {
		year,
		isLeapYear,
		daysSinceYear,
	} = calcYearFromDaysSinceEpoch(daysSinceEpoch)
	const { month } = calcMonthFromDaysSinceYear(daysSinceYear, isLeapYear)
	return toTimestamp({ year, month })
}
const floorTimestampDay = (t) => floorTo(t, dDay)
const floorTimestampHour = (t) => floorTo(t, dHour)
const floorTimestampMinute = (t) => floorTo(t, dMinute)
const floorTimestampSecond = (t) => floorTo(t, dSecond)

const floorTimestamp = (t, unit) => {
	switch (unit) {
		case 'years': case 'year': return floorTimestampYear(t)
		case 'months': case 'month': return floorTimestampMonth(t)
		case 'days': case 'day': return floorTimestampDay(t)
		case 'hours': case 'hour': return floorTimestampHour(t)
		case 'minutes': case 'minute': return floorTimestampMinute(t)
		case 'seconds': case 'second': return floorTimestampSecond(t)
		case 'milliseconds': case 'millisecond': return t
		default: return null
	}
}


const ceilTimestampYear = (t) => {
	const year = calcYear(t)
	const floored = toTimestamp({ year })
	return floored === t ? t : toTimestamp({ year: year + 1 })
}
const ceilTimestampMonth = (t) => {
	const daysSinceEpoch = calcDaysSinceEpoch(t)
	const {
		year,
		isLeapYear,
		daysSinceYear,
	} = calcYearFromDaysSinceEpoch(daysSinceEpoch)
	const { month } = calcMonthFromDaysSinceYear(daysSinceYear, isLeapYear)
	const floored = toTimestamp({ year, month })
	return floored === t ? t
		: month === 12
			? toTimestamp({ year: year + 1, month: 1 })
			: toTimestamp({ year, month: month + 1 })
}
const ceilTimestampDay = (t) => ceilTo(t, dDay)
const ceilTimestampHour = (t) => ceilTo(t, dHour)
const ceilTimestampMinute = (t) => ceilTo(t, dMinute)
const ceilTimestampSecond = (t) => ceilTo(t, dSecond)

const ceilTimestamp = (t, unit) => {
	switch (unit) {
		case 'years': case 'year': return ceilTimestampYear(t)
		case 'months': case 'month': return ceilTimestampMonth(t)
		case 'days': case 'day': return ceilTimestampDay(t)
		case 'hours': case 'hour': return ceilTimestampHour(t)
		case 'minutes': case 'minute': return ceilTimestampMinute(t)
		case 'seconds': case 'second': return ceilTimestampSecond(t)
		case 'milliseconds': case 'millisecond': return t
		default: return null
	}
}


const roundTimestampYear = (t) => {
	const year = calcYear(t)
	const floored = toTimestamp({ year })
	if (t === floored) { return floored }
	const ceiled = toTimestamp({ year: year + 1 })
	return (t - floored) < (ceiled - t) ? floored : ceiled
}
const roundTimestampMonth = (t) => {
	const daysSinceEpoch = calcDaysSinceEpoch(t)
	const {
		year,
		isLeapYear,
		daysSinceYear,
	} = calcYearFromDaysSinceEpoch(daysSinceEpoch)
	const { month } = calcMonthFromDaysSinceYear(daysSinceYear, isLeapYear)
	const floored = toTimestamp({ year, month })
	if (t === floored) { return floored }
	const ceiled = month === 12
		? toTimestamp({ year: year + 1, month: 1 })
		: toTimestamp({ year, month: month + 1 })
	return (t - floored) < (ceiled - t) ? floored : ceiled
}
const roundTimestampDay = (t) => roundTo(t, dDay)
const roundTimestampHour = (t) => roundTo(t, dHour)
const roundTimestampMinute = (t) => roundTo(t, dMinute)
const roundTimestampSecond = (t) => roundTo(t, dSecond)

const roundTimestamp = (t, unit) => {
	switch (unit) {
		case 'years': case 'year': return roundTimestampYear(t)
		case 'months': case 'month': return roundTimestampMonth(t)
		case 'days': case 'day': return roundTimestampDay(t)
		case 'hours': case 'hour': return roundTimestampHour(t)
		case 'minutes': case 'minute': return roundTimestampMinute(t)
		case 'seconds': case 'second': return roundTimestampSecond(t)
		case 'milliseconds': case 'millisecond': return t
		default: return null
	}
}


const floorYear$$$ = (date) => {
	const t = toTimestamp({ year: date.year })
	if (t !== date.timestamp) { _fromTimestamp(date, t) }
	return date
}
const floorYear = (date) => {
	const res = clone(date)
	return floorYear$$$(res)
}
floorYear.$$$ = floorYear$$$

const floorMonth$$$ = (date) => {
	const t = toTimestamp({ year: date.year, month: date.month })
	if (t !== date.timestamp) { _fromTimestamp(date, t) }
	return date
}
const floorMonth = (date) => {
	const res = clone(date)
	return floorMonth$$$(res)
}
floorMonth.$$$ = floorMonth$$$

const floorDay$$$ = (date) => {
	const t = floorTimestampDay(date.timestamp)
	if (t !== date.timestamp) { _fromTimestamp(date, t) }
	return date
}
const floorDay = (date) => {
	const res = clone(date)
	return floorDay$$$(res)
}
floorDay.$$$ = floorDay$$$

const floorHour$$$ = (date) => {
	const t = floorTimestampHour(date.timestamp)
	if (t !== date.timestamp) { _fromTimestamp(date, t) }
	return date
}
const floorHour = (date) => {
	const res = clone(date)
	return floorHour$$$(res)
}
floorHour.$$$ = floorHour$$$

const floorMinute$$$ = (date) => {
	const t = floorTimestampMinute(date.timestamp)
	if (t !== date.timestamp) { _fromTimestamp(date, t) }
	return date
}
const floorMinute = (date) => {
	const res = clone(date)
	return floorMinute$$$(res)
}
floorMinute.$$$ = floorMinute$$$

const floorSecond$$$ = (date) => {
	const t = floorTimestampSecond(date.timestamp)
	_fromTimestamp(date, t)
	return date
}
const floorSecond = (date) => {
	const res = clone(date)
	return floorSecond$$$(res)
}
floorSecond.$$$ = floorSecond$$$

const floor$$$ = (date, unit) => {
	if (false
		|| unit === 'milliseconds'
		|| unit === 'millisecond'
	) { return date }

	switch (unit) {
		case 'years': case 'year': return floorYear$$$(date)
		case 'months': case 'month': return floorMonth$$$(date)
		case 'days': case 'day': return floorDay$$$(date)
		case 'hours': case 'hour': return floorHour$$$(date)
		case 'minutes': case 'minute': return floorMinute$$$(date)
		case 'seconds': case 'second': return floorSecond$$$(date)
		case 'milliseconds': case 'millisecond': return date
		default: return null
	}
}
const floor = (date, unit) => {
	const res = clone(date)
	return floor$$$(res, unit)
}
floor.$$$ = floor$$$


const ceilYear$$$ = (date) => {
	const { year } = date
	const floored = toTimestamp({ year })
	if (floored !== date.timestamp) {
		const t = toTimestamp({ year: year + 1 })
		_fromTimestamp(date, t)
	}
	return date
}
const ceilYear = (date) => {
	const res = clone(date)
	return ceilYear$$$(res)
}
ceilYear.$$$ = ceilYear$$$

const ceilMonth$$$ = (date) => {
	const { year, month } = date
	const floored = toTimestamp({ year, month })
	if (floored !== date.timestamp) {
		const t = month === 12
			? toTimestamp({ year: year + 1, month: 0 })
			: toTimestamp({ year, month: month + 1 })
		_fromTimestamp(date, t)
	}
	return date
}
const ceilMonth = (date) => {
	const res = clone(date)
	return ceilMonth$$$(res)
}
ceilMonth.$$$ = ceilMonth$$$

const ceilDay$$$ = (date) => {
	const t = ceilTimestampDay(date.timestamp)
	if (t !== date.timestamp) { _fromTimestamp(date, t) }
	return date
}
const ceilDay = (date) => {
	const res = clone(date)
	return ceilDay$$$(res)
}
ceilDay.$$$ = ceilDay$$$

const ceilHour$$$ = (date) => {
	const t = ceilTimestampHour(date.timestamp)
	if (t !== date.timestamp) { _fromTimestamp(date, t) }
	return date
}
const ceilHour = (date) => {
	const res = clone(date)
	return ceilHour$$$(res)
}
ceilHour.$$$ = ceilHour$$$

const ceilMinute$$$ = (date) => {
	const t = ceilTimestampMinute(date.timestamp)
	if (t !== date.timestamp) { _fromTimestamp(date, t) }
	return date
}
const ceilMinute = (date) => {
	const res = clone(date)
	return ceilMinute$$$(res)
}
ceilMinute.$$$ = ceilMinute$$$

const ceilSecond$$$ = (date) => {
	const t = ceilTimestampSecond(date.timestamp)
	_fromTimestamp(date, t)
	return date
}
const ceilSecond = (date) => {
	const res = clone(date)
	return ceilSecond$$$(res)
}
ceilSecond.$$$ = ceilSecond$$$

const ceil$$$ = (date, unit) => {
	if (false
		|| unit === 'milliseconds'
		|| unit === 'millisecond'
	) { return date }

	switch (unit) {
		case 'years': case 'year': return ceilYear$$$(date)
		case 'months': case 'month': return ceilMonth$$$(date)
		case 'days': case 'day': return ceilDay$$$(date)
		case 'hours': case 'hour': return ceilHour$$$(date)
		case 'minutes': case 'minute': return ceilMinute$$$(date)
		case 'seconds': case 'second': return ceilSecond$$$(date)
		case 'milliseconds': case 'millisecond': return date
		default: return null
	}
}
const ceil = (date, unit) => {
	const res = clone(date)
	return ceil$$$(res, unit)
}
ceil.$$$ = ceil$$$


const roundYear$$$ = (date) => {
	const { year, timestamp } = date
	const floored = toTimestamp({ year })
	if (floored === date.timestamp) { return date }
	const ceiled = toTimestamp({ year: year + 1 })
	const t = (timestamp - floored) < (ceiled - timestamp) ? floored : ceiled
	_fromTimestamp(date, t)
	return date
}
const roundYear = (date) => {
	const res = clone(date)
	return roundYear$$$(res)
}
roundYear.$$$ = roundYear$$$

const roundMonth$$$ = (date) => {
	const { year, month, timestamp } = date
	const floored = toTimestamp({ year, month })
	if (floored === date.timestamp) { return date }
	const ceiled = month === 12
		? toTimestamp({ year: year + 1, month: 0 })
		: toTimestamp({ year, month: month + 1 })
	const t = (timestamp - floored) < (ceiled - timestamp) ? floored : ceiled
	_fromTimestamp(date, t)
	return date
}
const roundMonth = (date) => {
	const res = clone(date)
	return roundMonth$$$(res)
}
roundMonth.$$$ = roundMonth$$$

const roundDay$$$ = (date) => {
	const t = roundTimestampDay(date.timestamp)
	if (t !== date.timestamp) { _fromTimestamp(date, t) }
	return date
}
const roundDay = (date) => {
	const res = clone(date)
	return roundDay$$$(res)
}
roundDay.$$$ = roundDay$$$

const roundHour$$$ = (date) => {
	const t = roundTimestampHour(date.timestamp)
	if (t !== date.timestamp) { _fromTimestamp(date, t) }
	return date
}
const roundHour = (date) => {
	const res = clone(date)
	return roundHour$$$(res)
}
roundHour.$$$ = roundHour$$$

const roundMinute$$$ = (date) => {
	const t = roundTimestampMinute(date.timestamp)
	if (t !== date.timestamp) { _fromTimestamp(date, t) }
	return date
}
const roundMinute = (date) => {
	const res = clone(date)
	return roundMinute$$$(res)
}
roundMinute.$$$ = roundMinute$$$

const roundSecond$$$ = (date) => {
	const t = roundTimestampSecond(date.timestamp)
	_fromTimestamp(date, t)
	return date
}
const roundSecond = (date) => {
	const res = clone(date)
	return roundSecond$$$(res)
}
roundSecond.$$$ = roundSecond$$$

const round$$$ = (date, unit) => {
	if (false
		|| unit === 'milliseconds'
		|| unit === 'millisecond'
	) { return date }

	switch (unit) {
		case 'years': case 'year': return roundYear$$$(date)
		case 'months': case 'month': return roundMonth$$$(date)
		case 'days': case 'day': return roundDay$$$(date)
		case 'hours': case 'hour': return roundHour$$$(date)
		case 'minutes': case 'minute': return roundMinute$$$(date)
		case 'seconds': case 'second': return roundSecond$$$(date)
		case 'milliseconds': case 'millisecond': return date
		default: return null
	}
}
const round = (date, unit) => {
	const res = clone(date)
	return round$$$(res, unit)
}
round.$$$ = round$$$


module.exports = {
	floorTimestampYear,
	floorTimestampMonth,
	floorTimestampDay,
	floorTimestampHour,
	floorTimestampMinute,
	floorTimestampSecond,
	floorTimestamp,
	ceilTimestampYear,
	ceilTimestampMonth,
	ceilTimestampDay,
	ceilTimestampHour,
	ceilTimestampMinute,
	ceilTimestampSecond,
	ceilTimestamp,
	roundTimestampYear,
	roundTimestampMonth,
	roundTimestampDay,
	roundTimestampHour,
	roundTimestampMinute,
	roundTimestampSecond,
	roundTimestamp,
	floorYear,
	floorMonth,
	floorDay,
	floorHour,
	floorMinute,
	floorSecond,
	floor,
	ceilYear,
	ceilMonth,
	ceilDay,
	ceilHour,
	ceilMinute,
	ceilSecond,
	ceil,
	roundYear,
	roundMonth,
	roundDay,
	roundHour,
	roundMinute,
	roundSecond,
	round,
}
