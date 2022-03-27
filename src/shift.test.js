const { test } = require('@kmamal/testing')
const {
	shiftTimestampYear,
	// shiftTimestampMonth,
	shiftTimestampDay,
	shiftTimestampHour,
	shiftTimestampMinute,
	shiftTimestampSecond,
	shiftTimestamp,
	shiftYear,
	// shiftMonth,
	shiftDay,
	shiftHour,
	shiftMinute,
	shiftSecond,
	shift,
} = require('./shift')
const { fromTimestamp } = require('./date')
const { randInt } = require('../random/rand-int')

const year3000 = Date.UTC(3000)

test("date.shift", (t) => {
	for (let i = 0; i < 1e5; i++) {
		const timestamp = randInt(0, year3000)
		const a = fromTimestamp(timestamp)

		{
			const r = randInt(-100, 100)
			const b = new Date(timestamp)
			b.setUTCFullYear(b.getUTCFullYear() + r)
			const bt = b.getTime()
			t.equal(shiftTimestampYear(timestamp, r), bt, { a, r })
			t.equal(shiftTimestamp(timestamp, 'year', r), bt, { a, r })
			t.equal(shiftYear(a, r).timestamp, bt, { a, r })
			t.equal(shift(a, 'year', r).timestamp, bt, { a, r })
		}
		// {
		// 	const r = randInt(-100, 100)
		// 	const b = new Date(timestamp)
		// 	b.setUTCMonth(b.getUTCMonth() + r)
		// 	const bt = b.getTime()
		// 	t.equal(shiftTimestampMonth(timestamp, r), bt, { a, r })
		// 	t.equal(shiftTimestamp(timestamp, 'month', r), bt, { a, r })
		// 	t.equal(shiftMonth(a, r).timestamp, bt, { a, r })
		// 	t.equal(shift(a, 'month', r).timestamp, bt, { a, r })
		// }
		{
			const r = randInt(-100, 100)
			const b = new Date(timestamp)
			b.setUTCDate(b.getUTCDate() + r)
			const bt = b.getTime()
			t.equal(shiftTimestampDay(timestamp, r), bt, { a, r })
			t.equal(shiftTimestamp(timestamp, 'day', r), bt, { a, r })
			t.equal(shiftDay(a, r).timestamp, bt, { a, r })
			t.equal(shift(a, 'day', r).timestamp, bt, { a, r })
		}
		{
			const r = randInt(-100, 100)
			const b = new Date(timestamp)
			b.setUTCHours(b.getUTCHours() + r)
			const bt = b.getTime()
			t.equal(shiftTimestampHour(timestamp, r), bt, { a, r })
			t.equal(shiftTimestamp(timestamp, 'hour', r), bt, { a, r })
			t.equal(shiftHour(a, r).timestamp, bt, { a, r })
			t.equal(shift(a, 'hour', r).timestamp, bt, { a, r })
		}
		{
			const r = randInt(-100, 100)
			const b = new Date(timestamp)
			b.setUTCMinutes(b.getUTCMinutes() + r)
			const bt = b.getTime()
			t.equal(shiftTimestampMinute(timestamp, r), bt, { a, r })
			t.equal(shiftTimestamp(timestamp, 'minute', r), bt, { a, r })
			t.equal(shiftMinute(a, r).timestamp, bt, { a, r })
			t.equal(shift(a, 'minute', r).timestamp, bt, { a, r })
		}
		{
			const r = randInt(-100, 100)
			const b = new Date(timestamp)
			b.setUTCSeconds(b.getUTCSeconds() + r)
			const bt = b.getTime()
			t.equal(shiftTimestampSecond(timestamp, r), bt, { a, r })
			t.equal(shiftTimestamp(timestamp, 'second', r), bt, { a, r })
			t.equal(shiftSecond(a, r).timestamp, bt, { a, r })
			t.equal(shift(a, 'second', r).timestamp, bt, { a, r })
		}
	}
})
