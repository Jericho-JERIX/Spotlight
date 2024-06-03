import { convertHHMMSSStringToSeconds, convertSecondsToHHMMSSString } from "./Time";

export function formatTimeRange(timeRange: string): {
    start: string;
    end: string;
} {

    /* 
        Time range format:
        1) HH:MM:SS-HH:MM:SS = Best detailed format to specify the time range
        2) HH:MM:SS+N = Start from HH:MM:SS and end N seconds after
        3) HH:MM:SS = Start from HH:MM:SS and end 10 seconds after
    */

    if (timeRange.includes("-")) {
        const [start, end] = timeRange.split("-");
        return { start, end };
    }
    else if (timeRange.includes("+")) {
        const [start, duration] = timeRange.split("+");
        return {
            start: start,
            end: convertSecondsToHHMMSSString(
                convertHHMMSSStringToSeconds(start) + Number(duration)
            )
        }
    }
    else {
        return {
            start: timeRange,
            end: convertSecondsToHHMMSSString(
                convertHHMMSSStringToSeconds(timeRange) + 10
            )
        }
    }
}