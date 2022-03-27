const { test } = require('@kmamal/testing')
const {
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
} = require('./rounding')
const {
	fromPartial,
	calcIsLeapYear,
	calcDaysInMonth,
} = require('./date')
const { randInt } = require('../random/rand-int')

const randomMillisecond = () => randInt(0, 1000)
const randomSecond = () => randInt(0, 60)
const randomMinute = () => randInt(0, 60)
const randomHour = () => randInt(0, 24)
const randomDay = (daysInMonth) => randInt(0, daysInMonth) + 1
const randomMonth = () => randInt(0, 12) + 1
const randomYear = () => randInt(1970, 3000)

test("date.rounding.floor", (t) => {
	for (let i = 0; i < 1e4; i++) {
		const year = randomYear()
		const month = randomMonth()
		const isLeapYear = calcIsLeapYear(year)
		const daysInMonth = calcDaysInMonth(month, isLeapYear)
		const day = randomDay(daysInMonth)
		const hour = randomHour()
		const minute = randomMinute()
		const second = randomSecond()
		const millisecond = randomMillisecond()

		const date = fromPartial({
			year,
			month,
			day,
			hour,
			minute,
			second,
			millisecond,
		})

		const { timestamp } = date

		{
			const bt = Date.UTC(year)
			t.equal(floorTimestampYear(timestamp), bt)
			t.equal(floorTimestamp(timestamp, 'year'), bt)
			t.equal(floorYear(date).timestamp, bt)
			t.equal(floor(date, 'year').timestamp, bt)
		}
		{
			const bt = Date.UTC(year, month - 1)
			t.equal(floorTimestampMonth(timestamp), bt)
			t.equal(floorTimestamp(timestamp, 'month'), bt)
			t.equal(floorMonth(date).timestamp, bt)
			t.equal(floor(date, 'month').timestamp, bt)
		}
		{
			const bt = Date.UTC(year, month - 1, day)
			t.equal(floorTimestampDay(timestamp), bt)
			t.equal(floorTimestamp(timestamp, 'day'), bt)
			t.equal(floorDay(date).timestamp, bt)
			t.equal(floor(date, 'day').timestamp, bt)
		}
		{
			const bt = Date.UTC(year, month - 1, day, hour)
			t.equal(floorTimestampHour(timestamp), bt)
			t.equal(floorTimestamp(timestamp, 'hour'), bt)
			t.equal(floorHour(date).timestamp, bt)
			t.equal(floor(date, 'hour').timestamp, bt)
		}
		{
			const bt = Date.UTC(year, month - 1, day, hour, minute)
			t.equal(floorTimestampMinute(timestamp), bt)
			t.equal(floorTimestamp(timestamp, 'minute'), bt)
			t.equal(floorMinute(date).timestamp, bt)
			t.equal(floor(date, 'minute').timestamp, bt)
		}
		{
			const bt = Date.UTC(year, month - 1, day, hour, minute, second)
			t.equal(floorTimestampSecond(timestamp), bt)
			t.equal(floorTimestamp(timestamp, 'second'), bt)
			t.equal(floorSecond(date).timestamp, bt)
			t.equal(floor(date, 'second').timestamp, bt)
		}
	}
})

test("date.rounding.ceil", (t) => {
	for (let i = 0; i < 1e4; i++) {
		const year = randomYear()
		const month = randomMonth()
		const isLeapYear = calcIsLeapYear(year)
		const daysInMonth = calcDaysInMonth(month, isLeapYear)
		const day = randomDay(daysInMonth)
		const hour = randomHour()
		const minute = randomMinute()
		const second = randomSecond()
		const millisecond = randomMillisecond() || 1

		const date = fromPartial({
			year,
			month,
			day,
			hour,
			minute,
			second,
			millisecond,
		})

		const { timestamp } = date

		{
			const bt = Date.UTC(year + 1)
			t.equal(ceilTimestampYear(timestamp), bt)
			t.equal(ceilTimestamp(timestamp, 'year'), bt)
			t.equal(ceilYear(date).timestamp, bt)
			t.equal(ceil(date, 'year').timestamp, bt)
		}
		{
			const b = new Date(Date.UTC(year, month - 1))
			b.setUTCMonth(b.getUTCMonth() + 1)
			const bt = b.getTime()
			t.equal(ceilTimestampMonth(timestamp), bt)
			t.equal(ceilTimestamp(timestamp, 'month'), bt)
			t.equal(ceilMonth(date).timestamp, bt)
			t.equal(ceil(date, 'month').timestamp, bt)
		}
		{
			const b = new Date(Date.UTC(year, month - 1, day))
			b.setUTCDate(b.getUTCDate() + 1)
			const bt = b.getTime()
			t.equal(ceilTimestampDay(timestamp), bt)
			t.equal(ceilTimestamp(timestamp, 'day'), bt)
			t.equal(ceilDay(date).timestamp, bt)
			t.equal(ceil(date, 'day').timestamp, bt)
		}
		{
			const b = new Date(Date.UTC(year, month - 1, day, hour))
			b.setUTCHours(b.getUTCHours() + 1)
			const bt = b.getTime()
			t.equal(ceilTimestampHour(timestamp), bt)
			t.equal(ceilTimestamp(timestamp, 'hour'), bt)
			t.equal(ceilHour(date).timestamp, bt)
			t.equal(ceil(date, 'hour').timestamp, bt)
		}
		{
			const b = new Date(Date.UTC(year, month - 1, day, hour, minute))
			b.setUTCMinutes(b.getUTCMinutes() + 1)
			const bt = b.getTime()
			t.equal(ceilTimestampMinute(timestamp), bt)
			t.equal(ceilTimestamp(timestamp, 'minute'), bt)
			t.equal(ceilMinute(date).timestamp, bt)
			t.equal(ceil(date, 'minute').timestamp, bt)
		}
		{
			const b = new Date(Date.UTC(year, month - 1, day, hour, minute, second))
			b.setUTCSeconds(b.getUTCSeconds() + 1)
			const bt = b.getTime()
			t.equal(ceilTimestampSecond(timestamp), bt)
			t.equal(ceilTimestamp(timestamp, 'second'), bt)
			t.equal(ceilSecond(date).timestamp, bt)
			t.equal(ceil(date, 'second').timestamp, bt)
		}
	}
})
