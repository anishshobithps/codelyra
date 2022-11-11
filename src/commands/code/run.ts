import { Duration } from '#utils/constants';
import { Formatters, MessageActionRow, Modal, ModalActionRowComponent, TextInputComponent } from 'discord.js';
import { constants, evaluate } from 'tryitonline';
import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, ChatInputCommand, Command, CommandOptions, UserError } from '@sapphire/framework';

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
					name: 'language',
					description: 'The language you want to use.',
					required: true,
					autocomplete: true
				},
				{
					type: 'STRING',
					name: 'flags',
					description: 'If you have to pass any compiler flags.'
				},
				{
					type: 'STRING',
					name: 'options',
					description: 'If you have to pass any command line options.'
				},
				{
					type: 'STRING',
					name: 'driver',
					description: 'Any driver options if you have to pass'
				},
				{
					type: 'STRING',
					name: 'input',
					description: 'If you want to input any data to the code.'
				},
				{
					type: 'STRING',
					name: 'args',
					description: 'If you have any arguments to pass'
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
		const options = this.getOptions(interaction);
		const code = modalInteraction.fields.getTextInputValue('codeInput').replace('%22', '"');
		const result = await evaluate({
			code,
			...options
		});
		const res: string[] = [];
		res.push(`❯ **Input:** ${Formatters.codeBlock(code)}`);
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

	private getOptions(interaction: ChatInputCommand.Interaction) {
		const options: EvaluateOptions = {
			language: interaction.options.getString('language', true),
			flags: interaction.options.getString('flags')?.split(' '),
			options: interaction.options.getString('options')?.split(' '),
			driver: interaction.options.getString('driver')?.split(' '),
			input: interaction.options.getString('input') ?? undefined,
			args: interaction.options.getString('args')?.split(' ')
		};

		return options;
	}
}

interface EvaluateOptions {
	language: string;
	flags: string[] | undefined;
	options: string[] | undefined;
	driver: string[] | undefined;
	input: string | undefined;
	args: string[] | undefined;
}
