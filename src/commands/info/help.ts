import { ApplyOptions } from '@sapphire/decorators';
import { PaginatedMessage } from '@sapphire/discord.js-utilities';
import { Command, CommandOptions } from '@sapphire/framework';
import type { Message, MessageEmbed } from 'discord.js';

@ApplyOptions<CommandOptions>({
	name: 'help',
	description: 'The help command for no reason other than to be helpful.'
})
export class HelpCommand extends Command {
	public override messageRun(message: Message) {
		const commands = this.container.stores.get('commands');
		const paginatedMessage = new PaginatedMessage() //
			.addPageEmbed((embed: MessageEmbed) => {
				return embed
					.setTitle('Commands')
					.setDescription(commands.map((command) => `**${command.name}** - ${command.description}`).join('\n'));
			});

		return paginatedMessage.run(message);
	}
}
