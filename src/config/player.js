export default {
	/* {Object} */
	playerOptions: {
		/* {Boolean} */
		emitNewSongOnly: true,
		/* {Boolean} */
		leaveOnEmpty: true,
		/* {Boolean} */
		leaveOnFinish: true,
		/* {Boolean} */
		leaveOnStop: false,
		/* {Boolean} */
		searchSongs: false,
		/* {Object} */
		customFilters: {
			// Treble
			'treble@earplug': 'treble=g=1',
			'treble@normal': 'treble=g=5',
			'treble@sharpest': 'treble=g=10',
			// Bassboost
			'bassboost@low': 'bass=g=10,dynaudnorm=f=200',
			'bassboost@mid': 'bass=g=20,dynaudnorm=f=200',
			'bassboost@high': 'bass=g=30,dynaudnorm=f=200',
			// <Number>D
			'3D': 'apulsator=hz=0.03',
			'5D': 'apulsator=hz=0.05',
			'8D': 'apulsator=hz=0.08',
			// Other Filters
			karaoke: 'stereotools=mlev=0.03',
			nightcore: 'aresample=48000,asetrate=48000*1.25',
			normalizer: 'dynaudnorm=f=200',
			vaporwave: 'aresample=48000,asetrate=48000*0.8',
			phaser: 'aphaser=in_gain=0.4',
			vibrato: 'vibrato=f=6.5',
			pulsator: 'apulsator=hz=1',
			flanger: 'flanger',
			surround: 'surround',
			subboost: 'asubboost',
			reverse: 'areverse',
			tremolo: 'tremolo',
			haas: 'haas'
		}
	}
}