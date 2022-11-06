import { Formatters, type Message } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators';
import { Command, CommandOptions } from '@sapphire/framework';
import { send } from '@sapphire/plugin-editable-commands';
import { table } from 'table';
import { languages } from 'tryitonline';
import { chunks } from '#utils/chunks';
import { cleanup } from '#utils/cleanup';
import { shuffle } from '#lib/utils/shuffle';
import { tableConfig } from '#utils/constants';

@ApplyOptions<CommandOptions>({
	aliases: ['langs', 'lang'],
	description: 'List of the languages I provide.'
})
export class LanguagesCommand extends Command {
	public override async messageRun(message: Message) {
		const langschunk = [
			...chunks(
				[
					...new Set(
						shuffle(
							(await languages())
								.filter((lang) => (lang.categories as any).includes(Category.Practical))
								.map((lang) => cleanup(lang.name))
						)
					)
				].slice(-18),
				3
			)
		].slice(0, -1);

		const msg = ['You can find all the languages I provide in here:', 'Here are few of the languages :'];
		const tableView = Formatters.codeBlock(table(langschunk, tableConfig));
		msg.push(tableView);
		msg.push(
			'Find more languages at:',
			'https://tio.run/#',
			'To use the following language use:',
			`\`${this.container.client.options.defaultPrefix}run <lang> <code>\``
		);
		return send(message, msg.join('\n'));
	}
}

const Category = {
	Practical: 'practical',
	Recreational: 'recreational',
	Unlisted: 'unlisted'
} as const;
