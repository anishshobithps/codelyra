import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerOptions, InteractionHandlerTypes } from '@sapphire/framework';
import { matchSorter } from 'match-sorter';
import type { AutocompleteInteraction } from 'discord.js';
import { langs } from '#lib/utils/constants';

@ApplyOptions<InteractionHandlerOptions>({
	interactionHandlerType: InteractionHandlerTypes.Autocomplete,
	name: 'langAutoComplete'
})
export class LangAutoComplete extends InteractionHandler {
	public async run(interaction: AutocompleteInteraction, parsedData: Array<{ name: string; value: string }>) {
		await interaction.respond(parsedData);
	}

	public parse(interaction: AutocompleteInteraction) {
		const focusedOption = interaction.options.getFocused(true);
		if (focusedOption.name !== 'lang') return this.none();

		const query = focusedOption.value.toString().trim();
		const parsedData = [];
		for (const lang of matchSorter(langs, query).slice(0, 25)) {
			parsedData.push({
				name: lang,
				value: lang
			});
		}

		return this.some(parsedData);
	}
}
