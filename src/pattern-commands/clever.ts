import type { Message } from 'discord.js';
import Chatbot from 'smartestchatbot';
import { container } from '@sapphire/framework';
import { PatternCommand, type PatternCommandOptions } from '@sapphire/plugin-pattern-commands';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';

const PATTERN = `^<@!?${container.env.envParseString('BOT_ID')}>\\s?`;
const KEY = container.env.envParseString('API_KEY');
const gender = container.env.envParseString('BOT_GENDER');
const name = container.env.envParseString('BOT_NAME');

@ApplyOptions<PatternCommandOptions>({
	aliases: [PATTERN]
})
export class InterestingCommand extends PatternCommand {
	public override async messageRun(message: Message) {
		const commands = container.stores.get('commands').map((command) => command.name);
		const [, ...args] = message.content.split(' ');
		if (!commands.includes(args[0])) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			const client = new Chatbot.Client(KEY);
			await client.chat({ message: args.join(' '), name, gender }).then(async (reply) => {
				await send(message, reply);
			});
		}
	}
}
