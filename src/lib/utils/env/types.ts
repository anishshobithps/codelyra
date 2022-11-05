/**
 * @license Apache License, Version 2.0
 * @copyright Skyra Project
 *
 * Changes made: Renamed types
 */

export type BooleanString = 'true' | 'false';
export type IntegerString = `${bigint}`;
export type NumberString = `${number}`;
export type ArrayString = string & { __type__: 'ArrayString' };

export type EnvAny = keyof Env;
export type EnvString = { [K in EnvAny]: Env[K] extends BooleanString | IntegerString | NumberString ? never : K }[EnvAny];
export type EnvBoolean = { [K in EnvAny]: Env[K] extends BooleanString | undefined ? K : never }[EnvAny];
export type EnvInteger = { [K in EnvAny]: Env[K] extends IntegerString | undefined ? K : never }[EnvAny];
export type EnvNumber = { [K in EnvAny]: Env[K] extends NumberString | undefined ? K : never }[EnvAny];
export type EnvArray = { [K in EnvAny]: Env[K] extends ArrayString | undefined ? K : never }[EnvAny];

export interface Env {
	DISCORD_TOKEN: string;
	PREFIX: string;
	OWNERS: ArrayString;
	BOT_NAME: string;
	DEV: BooleanString;
}
