export async function run() {
	this.user.setPresence({
		status: 'dnd',
		activity: { type: 'WATCHING', name: 'Developer Mode' }
	}).then(presence => {
		for (const msg of [
			`Status: ${presence.status}`,
			`Activity: ${presence.activities[0].type}`,
			`Presence: ${presence.activities[0].name}`,
			`Now logged in as ${this.user.tag}.`
		]) {
			this.utils.log('Musicord', 'main', msg);
		}
	}).catch(error => {
		this.utils.log('Musicord', 'error', 'dev:ready@presence', error);
		process.exit(1);
	});
}