module.exports = {
	/* Common Structures */
	Musicord: require('./structures/Musicord').default,
	Command: require('./structures/Command').default,
	Constants: require('./structures/Contants'),

	/* Unimportable Structs */
	Manager: require('./structures/Manager').default,
	Listener: require('./structures/Listener').default,
	Util: require('./structures/Util').default,
	DisTube: require('./structures/DisTube').default
}