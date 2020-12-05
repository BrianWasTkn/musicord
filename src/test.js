const { Collection } = require('discord.js');

const e = new Collection();
e.set('124354164144313454013', {
	user: 'another someone who blah blah#0045',
	time: new Date(Date.now()),
	won: Math.floor(Math.random() * 500) * 1000
});
e.set('444646113', {
	user: 'maybe someone idk lol#5421',
	time: new Date(Date.now()),
	won: Math.floor(Math.random() * 600) * 1000
});
const obj = {};
e.keyArray().forEach(w => {
	obj[w] = e.get(w)
});

const l = () => {
	console.log(Date.now());
	console.clear();
	return l();
}
console.log(l());