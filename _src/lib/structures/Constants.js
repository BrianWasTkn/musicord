import { Constants } from 'discord.js'

export const intro = Bot => {
	return [
	`${Bot.user.username} - Providing you the best music experience in your Discord server.`,
	'From **music effects**, a **clean interface** and a wide-range support of up to **700+** sources!',
	'Nothing can stop you for playing with whatever you want.\n\n',
	`You can run \`${Bot.prefix}help\` to view information about my commands or`,
	`\`${Bot.prefix}about\` to see much info about me.`
	].join(' ');
}

export const Embeds = Bot => ({
	voice_channel: Bot.utils.createEmbed({
		title: 'Voice Channel',
		color: 'RED',
		text: 'You need to join a voice channel first!'
	}),
	player_empty: Bot.utils.createEmbed({
		title: 'Player Empty',
		color: 'RED',
		text: 'There\'s nothing playing in the queue.'
	})
})

export const Colors = {
	RED: 0xE74C3C, 
	ORANGE: 0xF39C12,
	YELLOW: 0xF1C40F,
	GREEN: 0x2ECC71,
	BLUE: 0x3498DB,
	PURPLE: 0x9932CC,
	GREY: 0x34495E,
	BLURPLE: 0x7289DA,
	GREYPLE: 0x99AAB5,
	...Constants.Colors
};

export const PermissionStrings = {
	CREATE_INSTANT_INVITE: 'create instant invite',
	KICK_MEMBERS: 'kick members',
	BAN_MEMBERS: 'ban members',
	ADMINISTRATOR: 'administrator',
	MANAGE_CHANNELS: 'manage and edit channels',
	MANAGE_GUILD: 'manage server',
	ADD_REACTIONS: 'add reactions',
	VIEW_AUDIT_LOG: 'view audit log',
	PRIORITY_SPEAKER: 'priority speaker',
	STREAM: 'stream',
	VIEW_CHANNEL: 'read messages',
	SEND_MESSAGES: 'send messages',
	SEND_TTS_MESSAGES: 'send tts messages',
	MANAGE_MESSAGES: 'manage and delete messages',
	EMBED_LINKS: 'embed links',
	ATTACH_FILES: 'attach files',
	READ_MESSAGE_HISTORY: 'read message history',
	MENTION_EVERYONE: 'mention everyone',
	USE_EXTERNAL_EMOJIS: 'use external emojis',
	VIEW_GUILD_INSIGHTS: 'view guild insights',
	CONNECT: 'connect',
	SPEAK: 'speak',
	MUTE_MEMBERS: 'mute members',
	DEAFEN_MEMBERS: 'defean members',
	MOVE_MEMBERS: 'move members',
	USE_VAD: 'use vad',
	CHANGE_NICKNAME: 'change nickname',
	MANAGE_NICKNAMES: 'edit nicknames',
	MANAGE_ROLES: 'manage roles',
	MANAGE_WEBHOOKS: 'manage webhooks',
	MANAGE_EMOJIS: 'manage emojis'
}