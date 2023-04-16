import type { Message } from 'discord.js';
import { PatternCommand, type PatternCommandOptions } from '@sapphire/plugin-pattern-commands';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';

@ApplyOptions<PatternCommandOptions>({
	aliases: ['241|mecchgdawilbfqkxpprb|mcwlbqkprb|echgdaifxp|US20150243099A1']
})
export class InterestingCommand extends PatternCommand {
	public override async messageRun(message: Message) {
		const msg = message;
		await message.delete();
		await send(
			message,
			'Please use /submit command in <#1026787982616838157>, sharing answer is not allowed will spoil the fun of the game, You have been timed out for 30 seconds.'
		);
		await msg.member?.timeout(1000 * 30, 'Sharing answer');
	}
}
