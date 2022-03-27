const { test } = require('@kmamal/testing')
const {
	calcWeek,
	calcTimestampStartOfWeek,
} = require('./week')
const { DURATION } = require('./duration')
const { fromPartial } = require('./date')
const { randInt } = require('../random/rand-int')

test("date.calcWeek", (t) => {
	t.equal(calcWeek(fromPartial({ year: 1977, month: 1, day: 1 })), 53)
	t.equal(calcWeek(fromPartial({ year: 1977, month: 1, day: 2 })), 53)
	t.equal(calcWeek(fromPartial({ year: 1977, month: 12, day: 31 })), 52)
	t.equal(calcWeek(fromPartial({ year: 1978, month: 1, day: 1 })), 52)
	t.equal(calcWeek(fromPartial({ year: 1978, month: 1, day: 2 })), 1)
	t.equal(calcWeek(fromPartial({ year: 1978, month: 12, day: 31 })), 52)
	t.equal(calcWeek(fromPartial({ year: 1979, month: 1, day: 1 })), 1)
	t.equal(calcWeek(fromPartial({ year: 1979, month: 12, day: 30 })), 52)
	t.equal(calcWeek(fromPartial({ year: 1979, month: 12, day: 31 })), 1)
	t.equal(calcWeek(fromPartial({ year: 1980, month: 1, day: 1 })), 1)
	t.equal(calcWeek(fromPartial({ year: 1980, month: 12, day: 28 })), 52)
	t.equal(calcWeek(fromPartial({ year: 1980, month: 12, day: 29 })), 1)
	t.equal(calcWeek(fromPartial({ year: 1980, month: 12, day: 30 })), 1)
	t.equal(calcWeek(fromPartial({ year: 1980, month: 12, day: 31 })), 1)
	t.equal(calcWeek(fromPartial({ year: 1981, month: 1, day: 1 })), 1)
	t.equal(calcWeek(fromPartial({ year: 1981, month: 12, day: 31 })), 53)
	t.equal(calcWeek(fromPartial({ year: 1982, month: 1, day: 1 })), 53)
	t.equal(calcWeek(fromPartial({ year: 1982, month: 1, day: 2 })), 53)
	t.equal(calcWeek(fromPartial({ year: 1982, month: 1, day: 3 })), 53)
})

const year3000 = Date.UTC(3000)
const dDay = DURATION.day

test("date.calcStartOfWeek", (t) => {
	for (let i = 0; i < 1e5; i++) {
		const timestamp = randInt(0, year3000)
		const w = calcTimestampStartOfWeek(timestamp)
		const diff = timestamp - w
		t.ok(diff >= 0)
		t.ok(diff < 7 * dDay)
		t.equal(new Date(w).getUTCDay(), 1)
	}
})
