import {
	ActionRowBuilder,
	ApplicationCommandOptionType,
	ButtonBuilder,
	ButtonStyle,
	StringSelectMenuBuilder,
} from "discord.js";
import { SlashCommand } from "../scripts/types/SlashCommand";
import { download } from "../services/Download.service";

type PingButtonValue = {
	button: string;
	count: number;
};

function PingButton({ disabled = false, count = 0 }): ActionRowBuilder<any> {
	const initialValue: PingButtonValue = {
		button: "ping",
		count: count,
	};

	return new ActionRowBuilder().addComponents(
		new ButtonBuilder()
			.setCustomId(JSON.stringify(initialValue))
			.setLabel("Press Me")
			.setStyle(ButtonStyle.Primary)
			.setDisabled(disabled)
	);
}

function PingMenuSelect(): ActionRowBuilder<any> {
	return new ActionRowBuilder().addComponents(
		new StringSelectMenuBuilder()
			.setCustomId("select")
			.setPlaceholder("Nothing selected")
			.addOptions(
				{
					label: "Select me",
					description: "This is a description",
					value: "first",
				},
				{
					label: "You can select me too",
					description: "This is also a description",
					value: "second",
				}
			)
	);
}

export const Ping: SlashCommand = {
	name: "ping",
	description: "Replies with pong!!!",
	options: [
		{
			name: "url",
			description: "Type something here",
			type: ApplicationCommandOptionType.String,
			required: true,
		},
		{
			name: "start",
			description: "Type something here",
			type: ApplicationCommandOptionType.String,
			required: false,
		},
		{
			name: "end",
			description: "Type something here",
			type: ApplicationCommandOptionType.String,
			required: false,
		},
	],

	async onCommandExecuted(interaction) {

        await interaction.deferReply({ ephemeral: true });

		const url = interaction.options.get("url");
        const start = interaction.options.get("start");
        const end = interaction.options.get("end");

        if (!url || !start || !end) return;

		// const response = await download({
        //     videos: [
        //         {
        //             url: url.value as string, 
        //             highlight: (start && end) ? [
        //                 {
        //                     start: start.value as string,
        //                     end: end.value as string
        //                 }
        //             ] : []
        //         }
        //     ]
        // })

        // console.log(response)

		await interaction.editReply("Done!!!!");
	},

	async onButtonPressed(interaction) {
		let buttonValue: PingButtonValue = JSON.parse(interaction.customId);
		buttonValue.count++;

		const button = PingButton({ count: buttonValue.count });

		await interaction.update({
			content: `Count: ${buttonValue.count}`,
			components: [button],
		});
	},

	async onMenuSelected(interaction) {
		switch (interaction.values[0]) {
			case "first":
				await interaction.update({ content: `Select 1` });
				break;

			case "second":
				await interaction.update({ content: `Select 2` });
				break;
		}
		console.log(interaction);
	},
};
