const { DURATION } = require('./duration')
const { prefixSums } = require('@kmamal/util/array/prefix-sums')

const {
	day: dDay,
	hour: dHour,
	minute: dMinute,
	second: dSecond,
} = DURATION

const PARTS = [
	'year',
	'month',
	'day',
	'hour',
	'minute',
	'second',
	'millisecond',
]

const DAYS_IN_MONTH = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ]
const DAYS_IN_MONTH_LEAP = [ 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ]
const DAYS_TO_MONTH = new Array(364)
{
	let index = 0
	for (let i = 0; i < 12; i++) {
		const numDays = DAYS_IN_MONTH[i]
		for (let j = 0; j < numDays; j++) {
			DAYS_TO_MONTH[index++] = i
		}
	}
}
const DAYS_TO_MONTH_LEAP = Array.from(DAYS_TO_MONTH)
DAYS_TO_MONTH_LEAP.splice(31, 0, 1)
const MONTH_START = prefixSums(DAYS_IN_MONTH)
const MONTH_START_LEAP = prefixSums(DAYS_IN_MONTH_LEAP)


const _cachedIsLeapYear = {}

const _doCalcIsLeapYear = (year) => false
|| year % 400 === 0
|| (true
	&& year % 4 === 0
	&& year % 100 !== 0
)

const calcIsLeapYear = (year) => {
	const cached = _cachedIsLeapYear[year]
	if (cached !== undefined) { return cached }
	const res = _doCalcIsLeapYear(year)
	_cachedIsLeapYear[year] = res
	return res
}


const calcDaysInMonth = (month, isLeapYear = false) => {
	const days = isLeapYear ? DAYS_IN_MONTH_LEAP : DAYS_IN_MONTH
	return days[month - 1]
}


const _cachedLeapYearSinceEpoch = {}

const _doCalcLeapYearsSinceEpoch = (_year, isLeapYear) => (isLeapYear ? -1 : 0)
	+ Math.floor((_year + 2) / 4)
	- Math.floor((_year + 70) / 100)
	+ Math.floor((_year + 370) / 400)

const _calcLeapYearsSinceEpoch = (_year, isLeapYear) => {
	const cached = _cachedLeapYearSinceEpoch[_year]
	if (cached !== undefined) { return cached }
	const res = _doCalcLeapYearsSinceEpoch(_year, isLeapYear)
	_cachedLeapYearSinceEpoch[_year] = res
	return res
}


const calcMillisecond = (timestamp) => timestamp % dSecond
const calcSecond = (timestamp) => Math.floor((timestamp % dMinute) / dSecond)
const calcMinute = (timestamp) => Math.floor((timestamp % dHour) / dMinute)
const calcHour = (timestamp) => Math.floor((timestamp % dDay) / dHour)

const calcDaysSinceEpoch = (timestamp) => Math.floor(timestamp / dDay)

const calcDayOfWeek = (daysSinceEpoch) => (daysSinceEpoch + 3) % 7

const calcYearFromDaysSinceEpoch = (daysSinceEpoch) => {
	let _year = Math.floor(daysSinceEpoch / 365)
	let year = 1970 + _year
	let isLeapYear = calcIsLeapYear(year)
	const leapYearsSinceEpoch = _calcLeapYearsSinceEpoch(_year, isLeapYear)

	let daysSinceYear = daysSinceEpoch - (_year * 365 + leapYearsSinceEpoch)
	if (daysSinceYear < 0) {
		_year -= 1
		year -= 1
		daysSinceYear += 365
		isLeapYear = isLeapYear ? false : calcIsLeapYear(year)
		if (isLeapYear) { daysSinceYear += 1 }
	}

	return { year, isLeapYear, daysSinceYear }
}

const calcMonthFromDaysSinceYear = (daysSinceYear, isLeapYear) => {
	let daysToMonth
	let monthStart
	if (isLeapYear) {
		daysToMonth = DAYS_TO_MONTH_LEAP
		monthStart = MONTH_START_LEAP
	} else {
		daysToMonth = DAYS_TO_MONTH
		monthStart = MONTH_START
	}

	const _month = daysToMonth[daysSinceYear]
	const month = _month + 1

	let day = daysSinceYear + 1
	if (_month > 0) { day -= monthStart[_month - 1] }

	return { month, day }
}

const calcYear = (timestamp) => {
	const daysSinceEpoch = calcDaysSinceEpoch(timestamp)
	const { year } = calcYearFromDaysSinceEpoch(daysSinceEpoch)
	return year
}

const calcMonth = (timestamp) => {
	const daysSinceEpoch = calcDaysSinceEpoch(timestamp)
	const { isLeapYear, daysSinceYear } = calcYearFromDaysSinceEpoch(daysSinceEpoch)
	const { month } = calcMonthFromDaysSinceYear(daysSinceYear, isLeapYear)
	return month
}

const calcDay = (timestamp) => {
	const daysSinceEpoch = calcDaysSinceEpoch(timestamp)
	const { isLeapYear, daysSinceYear } = calcYearFromDaysSinceEpoch(daysSinceEpoch)
	const { day } = calcMonthFromDaysSinceYear(daysSinceYear, isLeapYear)
	return day
}


const _fromTimestamp = (date, timestamp) => {
	let remaining = timestamp

	const millisecond = remaining % 1000
	remaining -= millisecond
	remaining /= 1000

	const second = remaining % 60
	remaining -= second
	remaining /= 60

	const minute = remaining % 60
	remaining -= minute
	remaining /= 60

	const hour = remaining % 24
	remaining -= hour
	remaining /= 24

	const {
		year,
		isLeapYear,
		daysSinceYear,
	} = calcYearFromDaysSinceEpoch(remaining)

	const { month, day } = calcMonthFromDaysSinceYear(daysSinceYear, isLeapYear)

	const daysInMonth = calcDaysInMonth(month, isLeapYear)

	const dayOfWeek = calcDayOfWeek(remaining)

	date.timestamp = timestamp
	date.year = year
	date.month = month
	date.day = day
	date.hour = hour
	date.minute = minute
	date.second = second
	date.millisecond = millisecond
	date.isLeapYear = isLeapYear
	date.daysInMonth = daysInMonth
	date.dayOfWeek = dayOfWeek
}

const fromTimestamp = (timestamp) => {
	const res = {}
	_fromTimestamp(res, timestamp)
	return res
}

const toTimestamp = (date) => {
	if (date.timestamp) { return date.timestamp }

	let timestamp = 0

	const { year } = date
	if (year === undefined) { return 0 }
	const _year = year - 1970
	const { isLeapYear = calcIsLeapYear(year) } = date
	timestamp += _year * 365 + _calcLeapYearsSinceEpoch(_year, isLeapYear)

	const { month } = date
	if (month === undefined) { return timestamp * dDay }
	const _month = month - 1
	const monthStart = isLeapYear ? MONTH_START_LEAP : MONTH_START
	if (_month > 0) { timestamp += monthStart[_month - 1] }

	const { day } = date
	if (day === undefined) { return timestamp * dDay }
	const _day = day - 1
	timestamp += _day
	timestamp *= dDay

	const { hour } = date
	if (hour === undefined) { return timestamp }
	timestamp += hour * dHour

	const { minute } = date
	if (minute === undefined) { return timestamp }
	timestamp += minute * dMinute

	const { second } = date
	if (second === undefined) { return timestamp }
	timestamp += second * dSecond

	const { millisecond } = date
	if (millisecond === undefined) { return timestamp }
	timestamp += millisecond

	return timestamp
}

const _fromPartial = (dst, partial) => _fromTimestamp(dst, toTimestamp(partial))
const fromPartial = (partial) => fromTimestamp(toTimestamp(partial))


module.exports = {
	PARTS,
	calcYear,
	calcMonth,
	calcDay,
	calcHour,
	calcMinute,
	calcSecond,
	calcMillisecond,
	calcIsLeapYear,
	calcDaysInMonth,
	calcDayOfWeek,
	calcDaysSinceEpoch,
	calcYearFromDaysSinceEpoch,
	calcMonthFromDaysSinceYear,
	_fromTimestamp,
	fromTimestamp,
	toTimestamp,
	_fromPartial,
	fromPartial,
}
