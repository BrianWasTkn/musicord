export default async function(Bot) => ({
	/* Economy */
	addPocket: async (user, amount) => {
		return db.add(`currency.pockets.${user.id}`, amount);
	},
	removePocket: async (user, amount) => {
		return db.subtract(`currency.pockets.${user.id}`, amount);
	},
	addVault: async (user, amount) => {
		return db.add(`currency.vaults.${user.id}`, amount);
	},
	removeVault: async (user, amount) => {
		return db.subtract(`currency.vaults.${user.id}`, amount);
	},
	incrementVaultSpace: async (user, int) => {
		return db.add(`currency.space.${user.id}`, int);
	},

	/* Moderation */
	modlogsChannel: async (guild) => {
		return db.fetch(`mod.modlogs.${guild.id}`);
	}
})

/* Economy */
export const addPocket = async (guild, user, amount) => {
	await db.add
}