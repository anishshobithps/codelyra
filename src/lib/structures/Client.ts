import { container, LogLevel, SapphireClient } from '@sapphire/framework';
import type { ClientOptions } from 'discord.js';

export class Client extends SapphireClient {
	public constructor(options?: Omit<ClientOptions, 'intents'>) {
		super({
			intents: ['GUILDS', 'GUILD_MESSAGES', 'MESSAGE_CONTENT', 'GUILD_VOICE_STATES'],
			shards: 'auto',
			defaultPrefix: container.env.envParseString('PREFIX', 'i'),
			regexPrefix: new RegExp(`^((hey|yo|howdy|sup|hi) +)?${container.env.envParseString('BOT_NAME', 'BOT')}[,! ]`, 'i'),
			caseInsensitiveCommands: true,
			loadMessageCommandListeners: true,
			logger: {
				level: LogLevel.Debug
			},
			...options
		});
	}
}

declare module 'discord.js' {
	interface ClientOptions {
		botName?: string;
	}
}
