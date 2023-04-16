import { ApplicationCommandRegistry, Command, CommandOptions, type ChatInputCommand } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import type { TextChannel } from 'discord.js';

interface Answers {
	round: number;
	values: string[];
}

interface Roles {
	name: string;
	id: string;
}

interface Round {
	round: number;
	link: string;
}

const answers = new Map<number, Answers>([
	[1, { round: 1, values: ['mecchgdawilbfqkxpprb', 'mcwlbqkprb', 'echgdaifxp'] }],
	[2, { round: 2, values: ['241'] }],
	[3, { round: 3, values: ['US20150319342A1', 'us20150319342a1'] }]
]);

const rounds = new Map<number, Round>([
	[1, { round: 1, link: 'https://puzzel.org/crossword/play?p=-NQKmgBIFBwgZvBGKPwN' }],
	[2, { round: 2, link: 'https://drive.google.com/drive/folders/10zWdmzUkaFxF0bsLFWFh-Irwmhj2CjlH?usp=share_link' }],
	[3, { round: 3, link: 'https://puzzel.org/scavenger-hunt/play?p=-NR7X0d5PU9QsICgq6-G' }]
]);

const roles = new Map<string, Roles>([
	['Round1', { name: 'Round 1', id: '1039905696424132729' }],
	['Round2', { name: 'Round 2', id: '1096420747221672146' }],
	['Round3', { name: 'Round 3', id: '1096420803366633542' }]
]);

@ApplyOptions<CommandOptions>({
	description: 'Submit your mind of madness answers.'
})
export class SubmitCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand({
			name: this.name,
			description: this.description,
			options: [
				{
					type: 'INTEGER',
					name: 'round',
					description: 'The round you want to submit your answer for.',
					required: true,
					choices: [
						{ name: 'Round 1', value: 1 },
						{ name: 'Round 2', value: 2 },
						{ name: 'Round 3', value: 3 }
					]
				},
				{
					type: 'STRING',
					name: 'answer',
					description: 'The answer you want to submit.',
					required: true
				}
			]
		});
	}

	public override async chatInputRun(interaction: ChatInputCommand.Interaction) {
		const answer = interaction.options.getString('answer', true);
		const round = interaction.options.getInteger('round', true);

		if (answer.length > 100) await interaction.reply({ content: 'Your answer is too long.', ephemeral: true });
		if (answer.length < 1) await interaction.reply({ content: 'Your answer is too short.', ephemeral: true });

		const guild = this.container.client.guilds.cache.get('907574715974045736');
		// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
		const role = guild?.roles.cache.get(roles.get(`Round${round}`)!.id)!;
		const member = guild?.members.cache.get(interaction.user.id);
		const textChannel = guild?.channels.cache.get('1096397020861841420') as TextChannel;

		if (member!.roles.cache.has(role.id)) {
			const nextRound = rounds.get(round + 1);
			// eslint-disable-next-line no-negated-condition
			if (typeof nextRound !== 'undefined') {
				await interaction.reply({
					content: ['You have already completed this round!', `**Link to Round ${nextRound?.round}**: ${nextRound?.link}`].join('\n\n'),
					ephemeral: true
				});
			} else {
				await interaction.reply({
					content: 'Congratulations! You have completed the final round!',
					ephemeral: true
				});
			}
		} else if (round > 1 && !member!.roles.cache.has(roles.get(`Round${round - 1}`)!.id)) {
			await interaction.reply({ content: `You have not completed **round ${round - 1}** yet!`, ephemeral: true });
		} else if (answers.has(round) && answers.get(round)?.values.includes(answer)) {
			const nextRound = rounds.get(round + 1);
			if (nextRound) {
				await interaction.reply({
					content: ['Correct!', `**Link to Round ${nextRound?.round}**: ${nextRound?.link}`].join('\n'),
					ephemeral: true
				});
			} else {
				await interaction.reply({
					content: 'Congratulations! You have completed the final round!',
					ephemeral: true
				});
			}
			await textChannel.send(`${member} has completed round ${round}!`);
			await member!.roles.add(role.id);
		} else {
			await interaction.reply({ content: 'Incorrect!', ephemeral: true });
		}
	}
}
