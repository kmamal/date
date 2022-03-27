const { test } = require('@kmamal/testing')
const {
	fromTimestamp,
	calcYear,
	calcMonth,
	calcDay,
	calcHour,
	calcMinute,
	calcSecond,
	calcMillisecond,
	toTimestamp,
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

const year3000 = Date.UTC(3000)

test("date.fromTimestamp", (t) => {
	for (let i = 0; i < 1e5; i++) {
		const timestamp = randInt(0, year3000)
		const a = fromTimestamp(timestamp)

		const date = new Date(timestamp)
		const year = date.getUTCFullYear()
		const isLeapYear = calcIsLeapYear(year)
		const month = date.getUTCMonth() + 1
		const b = {
			timestamp,
			year,
			month,
			day: date.getUTCDate(),
			hour: date.getUTCHours(),
			minute: date.getUTCMinutes(),
			second: date.getUTCSeconds(),
			millisecond: date.getUTCMilliseconds(),
			isLeapYear,
			daysInMonth: calcDaysInMonth(month, isLeapYear),
			dayOfWeek: (6 + date.getUTCDay()) % 7,
		}

		t.equal(a, b)
		t.equal(calcYear(timestamp), b.year)
		t.equal(calcMonth(timestamp), b.month)
		t.equal(calcDay(timestamp), b.day)
		t.equal(calcHour(timestamp), b.hour)
		t.equal(calcMinute(timestamp), b.minute)
		t.equal(calcSecond(timestamp), b.second)
		t.equal(calcMillisecond(timestamp), b.millisecond)
	}
})

test("date.toTimestamp", (t) => {
	for (let i = 0; i < 1e5; i++) {
		const year = randomYear()
		const isLeapYear = calcIsLeapYear(year)
		const month = randomMonth()
		const daysInMonth = calcDaysInMonth(month, isLeapYear)
		const day = randomDay(daysInMonth)
		const hour = randomHour()
		const minute = randomMinute()
		const second = randomSecond()
		const millisecond = randomMillisecond()

		const a = {
			year,
			month,
			day,
			hour,
			minute,
			second,
			millisecond,
		}

		const b = new Date(Date.UTC(
			year,
			month - 1,
			day,
			hour,
			minute,
			second,
			millisecond,
		))

		t.equal(toTimestamp(a), b.getTime(), { a, b })
	}
})
