export default {
	/* {Object} */
	player_config: {
		/* {Boolean} */
		emitNewSongOnly: true,
		/* {Boolean} */
		leaveOnEmpty: true,
		/* {Boolean} */
		leaveOnFinish: true,
		/* {Boolean} */
		leaveOnStop: false,
		/* {Boolean} */
		searchSongs: true,
		/* {Object} */
		customFilters: {
			'3D': 'apulsator=hz=0.03',
			'8D': 'apulsator=hz=0.08',
			treble: 'treble=g=5',
			bassboost: 'bass=g=20,dynaudnorm=f=200',
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