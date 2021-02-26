import { 
	EmojiResolvable, 
	GuildMember, 
	TextChannel, 
	Snowflake
} from 'discord.js'
import {
	Spawn
} from '../../handlers/spawn'

export type SpawnVisualsType = 'COMMON' | 'UNCOMMON' | 'SUPER' | 'GODLY'
export type SpawnConfigType = 'message' | 'spam' | 'react'
export type SpawnCooldown = (member: GuildMember) => number
export type SpawnReward = { [reward: string]: number }

export interface SpawnConfig {
	odds: number
	type: SpawnConfigType
	cooldown?: SpawnCooldown
	enabled: boolean
	timeout: number
	entries: number
	rewards: SpawnReward
}

export interface SpawnVisual {
	emoji: EmojiResolvable
	type: SpawnVisualsType
	title: string
	description: string
	strings: string[]
}

export interface SpawnQueue {
	channel: TextChannel
	spawn: Spawn
	msgId: Snowflake
}