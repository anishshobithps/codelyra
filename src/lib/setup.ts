// Unless explicitly defined, set NODE_ENV as development:
process.env.NODE_ENV ??= 'development';

import 'reflect-metadata';
import '@sapphire/plugin-logger/register';
import '@sapphire/plugin-editable-commands/register';

import { EnvClient } from '#utils/env/parser';
import * as colorette from 'colorette';
import { config } from 'dotenv-cra';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { inspect } from 'node:util';
import { Vulkava } from 'vulkava';
import { container } from '@sapphire/framework';
import type { PackageJson } from 'type-fest';
import type { OutgoingDiscordPayload } from 'vulkava/lib/@types';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8')) as PackageJson;

Object.defineProperty(container, 'pkg', {
	value: pkg,
	configurable: false,
	writable: false,
	enumerable: false
});

Object.defineProperty(container, 'env', {
	value: EnvClient,
	configurable: false,
	writable: false,
	enumerable: false
});

const records = new Map();

Object.defineProperty(container, 'records', {
	value: records
});

const audio: Vulkava = new Vulkava({
	nodes: [
		{
			id: 'Node 1',
			hostname: '127.0.0.1',
			port: 2333,
			password: 'youshallnotpass'
		}
	],
	sendWS: (guildId: string, payload: OutgoingDiscordPayload) => {
		container.client.guilds.cache.get(guildId)?.shard.send(payload);
	}
});

Object.defineProperty(container, 'audio', {
	value: audio,
	configurable: false,
	writable: false,
	enumerable: false
});

// Read env var
config({ path: join(process.cwd(), '.env') });

// Set default inspection depth
inspect.defaultOptions.depth = 1;

// Enable colorette
colorette.createColors({ useColor: true });

declare module '@sapphire/pieces' {
	interface Container {
		pkg: typeof pkg;
		env: typeof EnvClient;
		audio: typeof audio;
		records: typeof records;
	}
}
