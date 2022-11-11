import { magentaBright } from 'colorette';
import { ApplyOptions } from '@sapphire/decorators';
import { container, Listener, ListenerOptions } from '@sapphire/framework';
import type { Node } from 'vulkava';

@ApplyOptions<ListenerOptions>({
	event: 'nodeResume',
	emitter: container.audio
})
export class InterestingListner extends Listener {
	public override run(node: Node) {
		console.log(`${magentaBright('Lavalink Node Resumed')} : ${node.identifier}`);
	}
}
