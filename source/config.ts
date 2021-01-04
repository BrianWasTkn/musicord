const BLED_DANK: string[] = [
	'691594488103305216', '691595376524001290',
	'692547222017015828', '694697159848886343',
	'703214235701739530'
];

const BLED_PUBLIC: string[] = [
	'791659327148261406', '699237791313166409',
	'699237791313166409', '692923254872080395',	
	'691597490411012137'
];

export const config = {
	dev: false,
	prefixes: ['lava', ';;', '??'],
	token: process.env.TOKEN,
	owners: ['605419747361947649'],

	spawn: {
		rateLimit: 15,
		blChannels: [...BLED_DANK, ...BLED_PUBLIC],
		categories: [
			'691595121866571776', // Dank Memer
			'791576124185378817', // Dank Donor
			'691416705917780000', // Public
			'724618509958774886' // Bot Workplace
		]
	}
}