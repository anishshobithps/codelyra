export function cleanup(str: string) {
	return str.replace(/\s?\d+(\.\d+)?/gim, '').replace(/\([\w\s\-\/\.\,\#]+\)/gim, '');
}
