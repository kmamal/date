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

const _makeDaysToMonth = (dst, src) => {
	let index = 0
	for (let i = 0; i < 12; i++) {
		const numDays = src[i]
		for (let j = 0; j < numDays; j++) {
			dst[index++] = i
		}
	}
	return dst
}

const DAYS_TO_MONTH = _makeDaysToMonth(new Array(364), DAYS_IN_MONTH)
const DAYS_TO_MONTH_LEAP = _makeDaysToMonth(new Array(365), DAYS_IN_MONTH_LEAP)

const MONTH_START = prefixSums(DAYS_IN_MONTH)
const MONTH_START_LEAP = prefixSums(DAYS_IN_MONTH_LEAP)


const _cachedIsLeapYearFromYear = {}

const _doCalcIsLeapYearFromYear = (year) => false
|| year % 400 === 0
|| (true
	&& year % 4 === 0
	&& year % 100 !== 0
)

const calcIsLeapYearFromYear = (year) => {
	const cached = _cachedIsLeapYearFromYear[year]
	if (cached !== undefined) { return cached }
	const res = _doCalcIsLeapYearFromYear(year)
	_cachedIsLeapYearFromYear[year] = res
	return res
}


const calcDaysInMonthFromMonth = (month, isLeapYear = false) => {
	const days = isLeapYear ? DAYS_IN_MONTH_LEAP : DAYS_IN_MONTH
	return days[month - 1]
}


const _cachedLeapYearSinceEpoch = {}

const _doCalcLeapYearsSinceEpoch = (_year, isLeapYear) => (isLeapYear ? -1 : 0)
	+ Math.floor((_year + 2) / 4)
	- Math.floor((_year + 70) / 100)
	+ Math.floor((_year + 370) / 400)

const calcLeapYearsSinceEpochFromYear = (_year, isLeapYear) => {
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

const calcDayOfWeekFromDaysSinceEpoch = (daysSinceEpoch) => (daysSinceEpoch + 3) % 7

const calcYearFromDaysSinceEpoch = (daysSinceEpoch) => {
	let _year = Math.floor(daysSinceEpoch / 365)
	let year = 1970 + _year
	let isLeapYear = calcIsLeapYearFromYear(year)
	const leapYearsSinceEpoch = calcLeapYearsSinceEpochFromYear(_year, isLeapYear)

	let daysSinceYear = daysSinceEpoch - (_year * 365 + leapYearsSinceEpoch)
	if (daysSinceYear < 0) {
		_year -= 1
		year -= 1
		daysSinceYear += 365
		isLeapYear = isLeapYear ? false : calcIsLeapYearFromYear(year)
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


const calcIsLeapYear = (timestamp) => {
	const year = calcYear(timestamp)
	return calcIsLeapYearFromYear(year)
}

const calcDaysInMonth = (timestamp) => {
	const daysSinceEpoch = calcDaysSinceEpoch(timestamp)
	const { isLeapYear, daysSinceYear } = calcYearFromDaysSinceEpoch(daysSinceEpoch)
	const { month } = calcMonthFromDaysSinceYear(daysSinceYear, isLeapYear)
	return calcDaysInMonthFromMonth(month, isLeapYear)
}

const calcDayOfWeek = (timestamp) => {
	const daysSinceEpoch = calcDaysSinceEpoch(timestamp)
	return calcDayOfWeekFromDaysSinceEpoch(daysSinceEpoch)
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

	const daysSinceEpoch = remaining

	const {
		year,
		isLeapYear,
		daysSinceYear,
	} = calcYearFromDaysSinceEpoch(daysSinceEpoch)

	const { month, day } = calcMonthFromDaysSinceYear(daysSinceYear, isLeapYear)

	const daysInMonth = calcDaysInMonthFromMonth(month, isLeapYear)

	const dayOfWeek = calcDayOfWeekFromDaysSinceEpoch(daysSinceEpoch)

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
	const { isLeapYear = calcIsLeapYearFromYear(year) } = date
	timestamp += _year * 365 + calcLeapYearsSinceEpochFromYear(_year, isLeapYear)

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
	_fromTimestamp,
	fromTimestamp,
	toTimestamp,
	_fromPartial,
	fromPartial,
	//
	calcIsLeapYearFromYear,
	calcDaysInMonthFromMonth,
	calcDayOfWeekFromDaysSinceEpoch,
	calcDaysSinceEpoch,
	calcYearFromDaysSinceEpoch,
	calcMonthFromDaysSinceYear,
	calcLeapYearsSinceEpochFromYear,
}
