import { Events, Listener, type ListenerOptions } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { send } from '@sapphire/plugin-editable-commands';
import type { Message } from 'discord.js';

@ApplyOptions<ListenerOptions>({
	event: Events.MessageUpdate
})
export class InterestingListner extends Listener {
	public override run(oldmessage: Message, newmessage: Message) {
		if (oldmessage.content === newmessage.content) return null;
		if (/interesting/gi.test(newmessage.content)) {
			return send(newmessage, 'Ya I know!');
		}
		return null;
	}
}
