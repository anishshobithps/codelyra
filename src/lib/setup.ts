// Unless explicitly defined, set NODE_ENV as development:
process.env.NODE_ENV ??= 'development';

import 'reflect-metadata';
import '@sapphire/plugin-logger/register';
import '@sapphire/plugin-editable-commands/register';

import * as colorette from 'colorette';
import { container } from '@sapphire/framework';
import { config } from 'dotenv-cra';
import { join } from 'node:path';
import { inspect } from 'node:util';
import { readFileSync } from 'node:fs';
import { EnvClient } from '#utils/env/parser';
import type { PackageJson } from 'type-fest';

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
	}
}
