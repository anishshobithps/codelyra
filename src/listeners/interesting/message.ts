import { Events, Listener, type ListenerOptions } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import type { Message } from 'discord.js';

@ApplyOptions<ListenerOptions>({
	event: Events.MessageCreate
})
export class InterestingListner extends Listener {
	public override run(message: Message) {
		if (/interesting/gim.test(message.content)) {
			return send(message, 'Ya I know!');
		}
		return null;
	}
}
