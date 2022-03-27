const { DURATION } = require('./duration')
const { shift } = require('./shift')

const elapsed = (a, b, part) => {
	if (part === 'years' || part === 'year') {
		return b.year - a.year
	}

	if (part === 'months' || part === 'month') {
		return 12 * (b.year - a.year) + (b.month - a.month)
	}

	const duration = DURATION[part]
	if (!duration) { return null }

	const at = a.timestamp
	const bt = b.timestamp
	const t = bt - at
	let estimate = Math.floor(t / duration)

	const c = shift(a, part, estimate)
	const cmp = c[part] - b[part]
	if (cmp !== 0) {
		estimate += Math.sign(b.timestamp - c.timestamp)
	}

	return estimate
}

module.exports = { elapsed }
