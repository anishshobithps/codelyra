import { ApplicationCommandRegistry, Command, CommandOptions, UserError, type ChatInputCommand } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { Modal, TextInputComponent, MessageActionRow, ModalActionRowComponent, Formatters } from 'discord.js';
import { constants, evaluate } from 'tryitonline';
import { Duration } from '#utils/constants';
@ApplyOptions<CommandOptions>({
	description: 'Run arbitary code on discord using the bot.'
})
export class RunCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand({
			name: this.name,
			description: this.description,
			options: [
				{
					type: 'STRING',
					name: 'lang',
					description: 'The language you want to use.',
					required: true,
					autocomplete: true
				}
			]
		});
	}

	public override async chatInputRun(interaction: ChatInputCommand.Interaction) {
		constants({ defaultTimeout: 15_000 });
		const modalCustomId = `code-modal-${interaction.id}`;
		const modal = new Modal() //
			.setCustomId(modalCustomId)
			.setTitle('Code')
			.setComponents(
				new MessageActionRow<ModalActionRowComponent>().addComponents(
					new TextInputComponent() //
						.setCustomId('codeInput')
						.setLabel('Code')
						.setStyle('PARAGRAPH')
						.setRequired(true)
				)
			);

		await interaction.showModal(modal);
		const modalInteraction = await interaction
			.awaitModalSubmit({
				filter: (interaction) => interaction.customId === modalCustomId,
				time: 10 * Duration.Minute
			})
			.catch((error) => {
				if ((error as NodeJS.ErrnoException).code !== 'INTERACTION_COLLECTOR_ERROR') throw error;
				throw new UserError({ identifier: 'The session has expired, please try again.' });
			});
		const lang = interaction.options.getString('lang', true);

		const result = await evaluate({
			code: modalInteraction.fields.getTextInputValue('codeInput').replace('%22', '"'),
			language: lang
		});
		const res: string[] = [];
		res.push(`❯ **Language:** ${result.language.name}`);
		if (result.output.length) res.push(`❯ **Output:**${Formatters.codeBlock(result.output)}`);
		res.push(`❯ **Debug:** ${Formatters.codeBlock(result.debug!)}`);
		return modalInteraction.reply({
			content: res
				.join('\n')
				.replace(/( {2}| {4})/g, '')
				.trimEnd()
		});
	}
}
