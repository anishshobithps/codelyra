import { request } from 'undici';
import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerOptions, InteractionHandlerTypes } from '@sapphire/framework';
import type { AutocompleteInteraction } from 'discord.js';

@ApplyOptions<InteractionHandlerOptions>({
	interactionHandlerType: InteractionHandlerTypes.Autocomplete
})
export class LangAutoComplete extends InteractionHandler {
	public override async run(interaction: AutocompleteInteraction, parsedData: Array<{ name: string; value: string }>) {
		await interaction.respond(parsedData);
	}

	public override async parse(interaction: AutocompleteInteraction) {
		const focusedOption = interaction.options.getFocused(true);
		if (focusedOption.name !== 'song') return this.none();

		const query = focusedOption.value.toString().trim();
		const parsedData = [];
		const res = await request(`https://clients1.google.com/complete/search?client=youtube&hl=pt-PT&ds=yt&q=${encodeURIComponent(query)}`, {
			headers: {
				'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.60 Safari/537.36'
			}
		}).then(async (r) => Buffer.from(await r.body.arrayBuffer()).toString('latin1'));
		const data = res.split('[');

		for (let i = 3, min = Math.min(8 * 2, data.length); i < min; i += 2) {
			const choice = data[i].split('"')[1].replace(/\\u([0-9a-fA-F]{4})/g, (_, cc) => String.fromCharCode(parseInt(cc, 16)));

			if (choice) {
				parsedData.push({
					name: `🎵 ${choice}`,
					value: choice
				});
			}
		}

		return this.some(parsedData);
	}
}
