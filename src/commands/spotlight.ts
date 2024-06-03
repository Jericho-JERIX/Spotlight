import {
    ApplicationCommandOptionType
} from "discord.js";
import * as dotenv from "dotenv";
import { statSync } from "fs";
import { SlashCommand } from "../scripts/types/SlashCommand";
import { DownloadManyHighlightRequest, Highlight, download } from "../services/Download.service";
import { formatTimeRange } from "../utilities/TimeRange";

dotenv.config();

function isFileTooLarge(filePath: string): boolean {
	return statSync(filePath).size > 8 * 1024 * 1024;
}

function bigFileMessageLog(highlights: Highlight[]) {
    const list = highlights.map((highlight) => (`[${highlight.start} - ${highlight.end}] ${highlight.downloadVideo.filename}`)).join("\n");
    return `\`\`\`\n${list}\`\`\``
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
            const timeRange = interaction.options.get(`range${i}`);
            if (!timeRange) break;
            hightlights.push(formatTimeRange(timeRange.value as string));
        }

		if (!url) return;

		console.log("Start downloading");

        const payload:DownloadManyHighlightRequest = {
            url: url.value as string,
			highlights: hightlights
		}
        
        console.log(payload)
		const response = await download(payload);

		console.log("Done downloading");
		console.log(response);

        const sendFile = [];
        const bigHighlights:Highlight[] = [];

        for (let i=0;i<response.highlights.length;i++) {
            
            let file;
            file = response.highlights[i].downloadVideo.filename;

            file = `${process.env.BASE_VAULT_PATH}/${file}`;
            console.log(file);

            if (isFileTooLarge(file)) {
                // continue;
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
                bigHighlights.push(response.highlights[i]);
            }
            else {
                sendFile.push(file);
            }
        }
        
        const replyResult = await interaction.editReply(sendFile.length > 0 ? {
            files: sendFile
        } : {
            content: "All files are too large to send. (Please check your DM)",
        });
        
        // Get message link
        const messageLink = `https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${replyResult.id}`;

        if (bigHighlights.length > 0) {
            const dmChannel = await interaction.user.createDM();
            await dmChannel.send({
                content: `From your requested on ${messageLink}, some of the files were too large to send.\n${bigFileMessageLog(bigHighlights)}`,
            });
        }
       
	},
};
