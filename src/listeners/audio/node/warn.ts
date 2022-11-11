import { yellowBright } from 'colorette';
import { ApplyOptions } from '@sapphire/decorators';
import { container, Listener, ListenerOptions } from '@sapphire/framework';
import type { Node } from 'vulkava';

@ApplyOptions<ListenerOptions>({
	event: 'warn',
	emitter: container.audio
})
export class InterestingListner extends Listener {
	public override run(node: Node, warn: string) {
		console.log(
			[
				`Warning of ${yellowBright('Lavalink Node Warning')} : ${node.identifier}`, //
				`Reason: ${warn}`
			].join('\n')
		);
	}
}
