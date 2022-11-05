import '#lib/setup';
import { Client } from '#lib/structures/Client';

const client = new Client();

const main = async () => {
	try {
		client.logger.info('Logging in...');
		await client.login();
	} catch (error) {
		client.logger.fatal(error);
		client.destroy();
		process.exit(1);
	}
};

main().catch(console.error);
