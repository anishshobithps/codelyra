import { red } from 'colorette';
import { ApplyOptions } from '@sapphire/decorators';
import { container, Listener, ListenerOptions } from '@sapphire/framework';
import type { Node } from 'vulkava';

@ApplyOptions<ListenerOptions>({
	event: 'nodeDisconnect',
	emitter: container.audio
})
export class InterestingListner extends Listener {
	public override run(node: Node, code: number, reason: string) {
		console.log(
			[
				`${red('Lavalink Node Disconnected')} : ${node.identifier}`, //
				`Error code: ${code}`,
				`Reason: ${reason}`
			].join('\n')
		);
	}
}
