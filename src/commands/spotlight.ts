import {
	ActionRowBuilder,
	ApplicationCommandOptionType,
	ButtonBuilder,
	ButtonStyle,
	StringSelectMenuBuilder,
} from "discord.js";
import { SlashCommand } from "../scripts/types/SlashCommand";
import { DownloadManyVideoRequest, download } from "../services/Download.service";
import { statSync } from "fs";
import ffmpeg from "ffmpeg";

function isFileTooLarge(filePath: string): boolean {
	return statSync(filePath).size > 8 * 1024 * 1024;
}

export const Spotlight: SlashCommand = {
	name: "spotlight",
	description: "a with pong!!!",
	options: [
		{
			name: "url",
			description: "Type something here",
			type: ApplicationCommandOptionType.String,
			required: true,
		},
		...Array.from(Array(10).keys()).map((v, i) => ({
			name: `range${i + 1}`,
			description:
				"Time range where the highlight is located. (Format: HH:MM:SS-HH:MM:SS)",
			type: ApplicationCommandOptionType.String,
			required: false,
		})),
	],

	async onCommandExecuted(interaction) {
		await interaction.deferReply();

		const url = interaction.options.get("url");
		const hightlights: {
            start: string;
            end: string;
        }[] = [];

        for (let i = 1; i <= 10; i++) {
            const start = interaction.options.get(`range${i}`);
            if (!start) break;

            const [startStr, endStr] = (start.value as string).split("-");
            hightlights.push({
                start: startStr,
                end: endStr,
            });
        }

		if (!url) return;

		console.log("Start downloading");

        const payload:DownloadManyVideoRequest = {
			videos: [
				{
					url: url.value as string,
					highlight: hightlights,
				},
			],
		}
        
        console.log(payload)
		const response = await download(payload);

		console.log("Done downloading");
		console.log(response);

        const sendFile = [];
        for (let i=0;i<response.videos[0].trimmedVideos.length;i++) {
            
            let file;
            file = response.videos[0].trimmedVideos[i].editedVideo.filename;
            // if (hightlights.length === 0) {
            //     file = response.videos[0].video.filename;
            // } else {
            //     file = response.videos[0].trimmedVideos[0].editedVideo.filename;
            // }

            file = `./../Streaming-Content-Manager/src/dumps/${file}`;
            console.log(file);

            if (isFileTooLarge(file)) {
                continue;
                // new ffmpeg(file, async function (err, video) {
                //     if (!err) {
                //         const compressedFilePath = "./src/temp/compressed.mp4";
                //         await video.save(compressedFilePath);
    
                //         if (isFileTooLarge(compressedFilePath)) {
                //             // await interaction.editReply({
                //             //     content: "File is too large to send (> 8MB).",
                //             // });
                //         } else {
                //             await interaction.editReply({
                //                 files: [compressedFilePath],
                //             });
                //         }
                //         return;
                //     }
                // });
            }
            else {
                sendFile.push(file);
            }
        }

        if (sendFile.length === 0) {
            await interaction.editReply({
                content: "File is too large to send (> 8MB).",
            });
        }
        else {
            await interaction.editReply({
                files: sendFile,
            });
        
        }
	},
};
