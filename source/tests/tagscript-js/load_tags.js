const path = require('path');
const fs = require('fs');

function readSync(dir) {
	return fs.statSync(dir).isDirectory()
		? [].concat(...fs.readdirSync(dir)).map(d => path.join(dir, d))
		: dir;
}

module.exports = () => {
	const genericTagFiles = readSync(path.join(__dirname, 'tags'));
	const tags = new Map();

	for (const file of genericTagFiles.filter(f => !f.startsWith('middleware'))) {
		const tag = require(file);
		if (tag.config.aliases) {
			tag.config.aliases.map(a => tags.set(a.toLowerCase(), tag));
		}

		tags.set(tag.config.name.toLowerCase(), tag);
	}

	console.log(`${tags.size} tags loaded.`);

	return tags;
}