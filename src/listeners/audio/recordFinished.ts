import { ApplyOptions } from '@sapphire/decorators';
import { container, Listener, ListenerOptions } from '@sapphire/framework';
import type { Node } from 'vulkava';

@ApplyOptions<ListenerOptions>({
	event: 'recordFinished',
	emitter: container.audio
})
export class RecordFinishedListner extends Listener {
	public override async run(node: Node, guildId: string, id: string) {
		const file = await node.getRecord(guildId, id);
		const { records } = this.container;
		records.get(guildId).send({
			content: 'Record finished!',
			files: [
				{
					name: 'rec.mp3',
					attachment: file
				}
			]
		});

		records.delete(guildId);
		await node.deleteRecord(guildId, id);
	}
}
