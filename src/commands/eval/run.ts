import { Args, Command, CommandOptions } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { Formatters, type Message } from 'discord.js';
import { constants, evaluate } from 'tryitonline';
import { send } from '@sapphire/plugin-editable-commands';

@ApplyOptions<CommandOptions>({
	description: 'Run arbitary code on discord using the bot.',
	options: ['lang', 'language', 'l']
})
export class PingCommand extends Command {
	public override async messageRun(message: Message, args: Args) {
		constants({ defaultTimeout: 15_000 });

		const lang = args.next();
		if (!lang) return send(message, 'Provide a language');

		let code = await args.rest('string');
		if (!code.startsWith('```') || !code.endsWith('```')) return send(message, 'Send code within code blocks');

		code = code.slice(4, -4);
		const result = await evaluate({
			code,
			language: lang
		}).catch((error) => {
			return send(message, Formatters.codeBlock(error));
		});

		return send(
			message,
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			[`❯ **Language:** ${result.language.name}`, `❯ **Output:**${Formatters.codeBlock(result.output)}`]
				.join('\n')
				.replace(/( {2}| {4})/g, '')
				.trimEnd()
		);
	}
}
