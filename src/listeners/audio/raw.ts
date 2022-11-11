import { ApplyOptions } from '@sapphire/decorators';
import { Events, Listener, ListenerOptions } from '@sapphire/framework';
import type { IncomingDiscordPayload } from 'vulkava/lib/@types';

@ApplyOptions<ListenerOptions>({
	event: Events.Raw
})
export class InterestingListner extends Listener {
	public override run(packet: IncomingDiscordPayload) {
		this.container.audio.handleVoiceUpdate(packet);
	}
}
