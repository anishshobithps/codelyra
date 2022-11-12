import type { Message } from 'discord.js';
import { PatternCommand, type PatternCommandOptions } from '@sapphire/plugin-pattern-commands';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';

@ApplyOptions<PatternCommandOptions>({
	aliases: ['interesting']
})
export class InterestingCommand extends PatternCommand {
	public override async messageRun(message: Message) {
		await send(message, 'Ya I know!');
	}
}
