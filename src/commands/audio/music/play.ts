import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationCommandRegistry, ChatInputCommand, Command, CommandOptions } from '@sapphire/framework';
import type { GuildMember } from 'discord.js';

@ApplyOptions<CommandOptions>({
	description: 'Plays music within discord.'
})
export class PlayCommand extends Command {
	public override registerApplicationCommands(registry: ApplicationCommandRegistry) {
		registry.registerChatInputCommand({
			name: this.name,
			description: this.description,
			options: [
				{
					type: 'STRING',
					name: 'song',
					description: 'The track you want to play.',
					required: true,
					autocomplete: true
				}
			]
		});
	}

	public override async chatInputRun(interaction: ChatInputCommand.Interaction) {
		const { audio } = this.container;
		const track = interaction.options.getString('song', true);
		const res = await audio.search(track);

		if (res.loadType === 'LOAD_FAILED') {
			return interaction.reply(`:x: Load failed. Error: ${res.exception?.message}`);
		} else if (res.loadType === 'NO_MATCHES') {
			return interaction.reply(':x: No matches!');
		}

		// Creates the audio player
		const player = audio.createPlayer({
			guildId: interaction.guild!.id,
			voiceChannelId: (interaction.member as GuildMember).voice.channelId!,
			textChannelId: interaction.channel?.id,
			selfDeaf: true
		});

		player.connect(); // Connects to the voice channel

		if (res.loadType === 'PLAYLIST_LOADED') {
			for (const track of res.tracks) {
				track.setRequester(interaction.user);
				await player.queue.add(track);
			}

			await interaction.reply(`Playlist \`${res.playlistInfo.name}\` loaded!`);
		} else {
			const track = res.tracks[0];
			track.setRequester(interaction.user);

			await player.queue.add(track);
			await interaction.reply(`Queued \`${track.title}\``);
		}

		if (!player.playing) await player.play();
	}
}
