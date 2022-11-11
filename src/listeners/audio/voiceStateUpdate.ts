import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener, ListenerOptions } from '@sapphire/framework';
import type { VoiceState } from 'discord.js';

@ApplyOptions<ListenerOptions>({
	event: Events.VoiceServerUpdate
})
export class VoiceServerUpdateListner extends Listener {
	public override async run(o: VoiceState, n: VoiceState) {
		const { players } = this.container.audio;
		const dispatcher = players.get(o.guild.id) || players.get(n.guild.id);
		if (o.member!.id !== this.container.client.user!.id && n.member!.id !== this.container.client.user!.id) return; // Not the client
		if (!o.channelId) return; // Client entered a channel
		if (!n.channelId && dispatcher) return dispatcher.destroy(); // Client disconnected from the channel
		if (o.channelId !== n.channelId && o.channelId && n.channelId) {
			// Client moved to another channel
			if (n.channel!.type === 'GUILD_STAGE_VOICE') {
				await n.setSuppressed(false);
			}
		}
	}
}
