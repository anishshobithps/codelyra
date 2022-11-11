import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, ChatInputCommand, Command, CommandOptions } from '@sapphire/framework';
import type { GuildMember } from 'discord.js';

@ApplyOptions<CommandOptions>({
	description: 'Plays music within discord.'
})
export class RecordCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand({
			name: this.name,
			description: this.description
		});
	}

	public override async chatInputRun(interaction: ChatInputCommand.Interaction) {
		const { audio, records } = this.container;

		if (!records.has(interaction.guild!.id)) {
			const player = audio.createPlayer({
				guildId: interaction.guild!.id,
				textChannelId: interaction.channel!.id,
				voiceChannelId: (interaction.member as GuildMember).voice.channelId!
			});

			player.connect();

			player.recorder.start({
				id: (interaction.member as GuildMember).voice.channelId!,
				bitrate: (interaction.member as GuildMember).voice.channel!.bitrate
			});

			await interaction.reply(':red_circle: Started recording!');

			records.set(interaction.guild!.id, interaction.channel);
		} else if (records.has(interaction.guild!.id)) {
			const player = audio.players.get(interaction.guild!.id);
			player?.destroy();
		}
	}
}
