/**
 * @license Apache License, Version 2.0
 * @copyright Skyra Project
 *
 * Changes made: Renamed types, Converted into class.
 */

import type { Env, EnvAny, EnvArray, EnvBoolean, EnvInteger, EnvNumber, EnvString } from './types';

export class EnvClient {
	public static envParseInteger(key: EnvInteger, defaultValue?: number): number;
	public static envParseInteger(key: EnvInteger, defaultValue: number | null): number | null;
	public static envParseInteger(key: EnvInteger, defaultValue?: number | null): number | null {
		const value = process.env[key];
		if (!value) {
			if (defaultValue === undefined) throw new ReferenceError(`[ENV] ${key} - The key must be an integer, but is empty or undefined.`);
			return defaultValue;
		}

		const integer = Number(value);
		if (Number.isInteger(integer)) return integer;
		throw new TypeError(`[ENV] ${key} - The key must be an integer, but received '${value}'.`);
	}

	public static envParseNumber(key: EnvNumber, defaultValue?: number): number;
	public static envParseNumber(key: EnvNumber, defaultValue: number | null): number | null;
	public static envParseNumber(key: EnvNumber, defaultValue?: number | null): number | null {
		const value = process.env[key];
		if (!value) {
			if (defaultValue === undefined) throw new ReferenceError(`[ENV] ${key} - The key must be a number, but is empty or undefined.`);
			return defaultValue;
		}

		const integer = Number(value);
		if (!Number.isNaN(integer)) return integer;
		throw new TypeError(`[ENV] ${key} - The key must be a number, but received '${value}'.`);
	}

	public static envParseBoolean(key: EnvBoolean, defaultValue?: boolean): boolean;
	public static envParseBoolean(key: EnvBoolean, defaultValue: boolean | null): boolean | null;
	public static envParseBoolean(key: EnvBoolean, defaultValue?: boolean | null): boolean | null {
		const value = process.env[key];
		if (!value) {
			if (defaultValue === undefined) throw new ReferenceError(`[ENV] ${key} - The key must be a boolean, but is empty or undefined.`);
			return defaultValue;
		}

		if (value === 'true') return true;
		if (value === 'false') return false;
		throw new TypeError(`[ENV] ${key} - The key must be a boolean, but received '${value}'.`);
	}

	public static envParseString<K extends EnvString>(key: K, defaultValue?: Env[K]): NonNullable<Env[K]>;
	public static envParseString<K extends EnvString>(key: K, defaultValue: Env[K] | null): NonNullable<Env[K]> | null;
	public static envParseString<K extends EnvString>(key: K, defaultValue?: Env[K] | null): NonNullable<Env[K]> | null {
		const value = process.env[key];
		if (!value) {
			if (defaultValue === undefined) throw new ReferenceError(`[ENV] ${key} - The key must be a string, but is empty or undefined.`);
			return defaultValue!;
		}

		return value!;
	}

	public static envParseArray(key: EnvArray, defaultValue?: string[]): string[];
	public static envParseArray(key: EnvArray, defaultValue: string[] | null): string[] | null;
	public static envParseArray(key: EnvArray, defaultValue?: string[] | null): string[] | null {
		const value = process.env[key];
		if (!value) {
			if (defaultValue === undefined) throw new ReferenceError(`[ENV] ${key} - The key must be an array, but is empty or undefined.`);
			return defaultValue;
		}

		return value.split(',');
	}

	public static envIsDefined(...keys: readonly EnvAny[]): boolean {
		return keys.every((key) => {
			const value = process.env[key];
			return value !== undefined && value.length !== 0;
		});
	}
}

declare global {
	namespace NodeJS {
		interface ProcessEnv extends Env {}
	}
}
