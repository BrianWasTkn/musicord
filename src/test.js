const parse = s => {

	/* String and Time amount to use */
	const times = [
		{ name: 'day', value: 60 * 60 * 24 },
		{ name: 'hour', value: 60 * 60 },
		{ name: 'minute', value: 60 },
		{ name: 'second', value: 1 }
	]

	/* Maths */
	const calc = (s, index, modulus = true) => {
		return modulus 
		? Math.floor(s % times[index].value) 
			: Math.floor(s / times[index].value);
	}

	/* Formatting Time */
	let results = [ `${calc(s, 0, false).toString()} ${times[0].name}` ];
	for (let i = 0 ; i < 3 ; i++) {
		const formula = Math.floor(s % times[i].value / times[i + 1].value);
		const label = formula > 1 ? `${times[i + 1].name}s` : times[i + 1].name;
		results.push(`${formula.toString()} ${label}`)
	}

	/* Return */
	results = results.filter(r => !r.startsWith('0')).reverse();
	results = [[results.reverse()[0], ...(results.reverse[1] || [])].join(', '), [results[0], results[1]].reverse().join(' and ')];
	return results.join(', ');
}

console.log(parse(60 * 60 + 1 + 61));