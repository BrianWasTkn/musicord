
const bob = () => ({
	png: 'this is a png' ,
	webp: 'this is a webp' ,
	jpg: 'this is a jpg' ,
	links: () => {
		return ['png', 'webp', 'jpg']
		.map((f, i) => `[${f}](${Object.entries(bob())
			.map(e => e[1])[i]})`)
		.join(' | ')
	}
});


console.log(`Links\n${bob().links()}`)