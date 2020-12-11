const log = (Class, type, tag, info = false) => {
	console.log(Class, '=>', tag, info ? info : '');
}

export default {
	log
}