
const zeroPad = (x, z) => x.toString().padStart(z, '0')

const pad2 = []
for (let i = 0; i < 60; i++) { pad2.push(zeroPad(i, 2)) }

const pad3 = []
for (let i = 0; i < 1000; i++) { pad3.push(zeroPad(i, 3)) }

const toString = (date) => {
	const yyyy = date.year
	const mm = pad2[date.month]
	const dd = pad2[date.day]
	const HH = pad2[date.hour]
	const MM = pad2[date.minute]
	const SS = pad2[date.second]
	const MMM = pad3[date.millisecond]

	return `${yyyy}-${mm}-${dd}T${HH}:${MM}:${SS}.${MMM}Z`
}

module.exports = { toString }
