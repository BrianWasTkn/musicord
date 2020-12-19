
const c = '! help command';
const p = '!';

console.log(
	c.replace(/<@!/g, '<@').substring(p.length).trim().split(/ +/g)
);