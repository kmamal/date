const { test } = require('@kmamal/testing')
const { toString } = require('./iso-string')
const { fromTimestamp } = require('./date')

const year3000 = Date.UTC(3000)

test("date.toString", (t) => {
	for (let i = 0; i < 1e5; i++) {
		const timestamp = Math.floor(Math.random() * year3000)
		const a = new Date(timestamp)
		const as = a.toISOString()
		const b = fromTimestamp(timestamp)
		const bs = toString(b)
		t.equal(as, bs, { a, b })
	}
})
