import { Ping } from "./commands/ping";
import { Spotlight } from "./commands/spotlight";
import { SlashCommand } from "./scripts/types/SlashCommand";

export const slashCommands: SlashCommand[] = [Ping,Spotlight];
