const path = require('path');
const fs = require('fs');

function dir(dir) {
	return fs.statSync(dir).isDirectory()
		? [].concat(...fs.readdirSync(dir)) // ['a', 'b']
			.map(d => path.join(dir, d)) // ['path/to/a', 'path/to/b']
			.filter(Boolean)
		: undefined;
}

console.log(dir(path.join(__dirname, 'plugs')).map(e => require(e)));