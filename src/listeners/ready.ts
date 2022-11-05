import { container, Events, Listener, Store, type ListenerOptions } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { blue, gray, magenta, magentaBright, white, cyan, green, yellow } from 'colorette';
import { capitalize } from '#utils/capitalize';
import { pluralise } from '#utils/pluralise';

const dev = container.env.envParseBoolean('DEV');

@ApplyOptions<ListenerOptions>({
	event: Events.ClientReady,
	once: true
})
export class ReadyListner extends Listener {
	private readonly style = dev ? yellow : blue;

	public override run() {
		this.printBanner();
		this.printStoreDebugInformation();
		// eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
		this.container.client.logger.info(`${gray('└─')} Logged as  ${green(this.container.client.user?.username!)}.`);
	}

	private printBanner() {
		const llc = dev ? magentaBright : white;
		const blc = dev ? magenta : blue;

		console.log(
			[
				`${cyan('Version:')} ${blc(this.container.pkg.version!)}`,
				`${dev ? `${blc('<')}${llc('/')}${blc('>')} ${llc('DEVELOPMENT MODE')}` : 'PRODUCTION MODE'}`
			].join('\n')
		);
	}

	private printStoreDebugInformation() {
		const { client, logger } = this.container;
		const stores = [...client.stores.values()].filter((val) => val.size !== 0).sort((a, b) => a.size - b.size);

		const first = stores.shift()!;
		const last = stores.pop()!;

		logger.info(this.styleStore(first, true));
		for (const store of stores) logger.info(this.styleStore(store, false));
		logger.info(this.styleStore(last, false));
	}

	private styleStore(store: Store<any>, start: boolean) {
		return gray(
			`${start ? '┌─' : '├─'} Loaded ${this.style(store.size.toString().padEnd(3, ' '))} ${magentaBright(
				capitalize(pluralise(store.name.slice(0, -1), store.size))
			)}.`
		);
	}
}
