const log = (...args) => console.log(...args);


let now = new Date();
log({
	f: Date.now() - now.getMilliseconds(),
	ms: now.getMilliseconds()
});

function nice() {
	return setTimeout(async () => {
		now = new Date();
		let f = Date.now() - now.getMilliseconds();
		let ms = now.getMilliseconds()
		log({ f, ms });
		return nice();
	}, ((60 - now.getSeconds()) * 1e3) - now.getMilliseconds());
}

log(nice());

// log({
// 	modded: 1e3 - now.getMilliseconds(),
// 	orig: now.getMilliseconds()
// });