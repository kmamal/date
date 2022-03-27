const { DURATION } = require('./duration')
const {
	_fromTimestamp,
	toTimestamp,
} = require('./date')
const { clone } = require('./clone')

const dDay = DURATION.day
const dWeek = 7 * dDay
const offset = 3 * dDay

const calcTimestampStartOfWeek = (timestamp) => {
	const adjusted = timestamp + offset
	const week = Math.floor(adjusted / dWeek)
	return week * dWeek - offset
}

const calcStartOfWeek$$$ = (date) => {
	const timestamp = calcTimestampStartOfWeek(date.timestamp)
	_fromTimestamp(date, timestamp)
	return date
}

const calcStartOfWeek = (date) => {
	const res = clone(date)
	return calcStartOfWeek$$$(res)
}

calcStartOfWeek.$$$ = calcStartOfWeek$$$


const _cachedfirstWeekOfYear = {}

const _doCalcFirstWeekOfYear = (year) => {
	const timestamp = toTimestamp({ year, month: 1, day: 4 })
	return calcTimestampStartOfWeek(timestamp)
}

const _calcFirstWeekOfYear = (year) => {
	const cached = _cachedfirstWeekOfYear[year]
	if (cached !== undefined) { return cached }
	const res = _doCalcFirstWeekOfYear(year)
	_cachedfirstWeekOfYear[year] = res
	return res
}


const calcWeek = (date) => {
	const { year, month, day, timestamp } = date
	let yearStartTimestamp
	if (month === 1 && day <= 10) {
		yearStartTimestamp = _calcFirstWeekOfYear(year)
		if (yearStartTimestamp > timestamp) {
			yearStartTimestamp = _calcFirstWeekOfYear(year - 1)
		}
	} else if (month === 12 && day >= 29) {
		yearStartTimestamp = _calcFirstWeekOfYear(year + 1)
		if (yearStartTimestamp > timestamp) {
			yearStartTimestamp = _calcFirstWeekOfYear(year)
		}
	} else {
		yearStartTimestamp = _calcFirstWeekOfYear(year)
	}
	return Math.floor((timestamp - yearStartTimestamp) / dWeek) + 1
}


module.exports = {
	calcTimestampStartOfWeek,
	calcStartOfWeek,
	calcWeek,
}
