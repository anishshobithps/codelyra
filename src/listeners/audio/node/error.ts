import { redBright } from 'colorette';
import { ApplyOptions } from '@sapphire/decorators';
import { container, Listener, ListenerOptions } from '@sapphire/framework';
import type { Node } from 'vulkava';

@ApplyOptions<ListenerOptions>({
	event: 'errror',
	emitter: container.audio
})
export class InterestingListner extends Listener {
	public override run(node: Node, error: Error) {
		console.log(
			[
				`${redBright('Lavalink Node Error')} : ${node.identifier}`, //
				`Stack: ${error.stack}`,
				`Message: ${error.message}`
			].join('\n')
		);
	}
}
