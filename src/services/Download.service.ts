export interface DownloadVideoAttribute {
	id: string;
	title: string;
	filename: string;
	platform: string;
	platformId: string;
}

export interface VideoTrimResult {
	originalVideo: DownloadVideoAttribute;
	editedVideo: DownloadVideoAttribute;
	start: number;
	end: number;
}

export interface DownloadManyHighlightRequest {
    url: string;
    highlights: {
        start: string;
        end: string;
    }[]
}

export interface Highlight {
	start: string;
	end: string;
	downloadVideo: DownloadVideoAttribute;
}

export interface DownloadManyHighlightResponse {
    url: string;
    highlights: Highlight[]
}

export async function download(
	body: DownloadManyHighlightRequest
): Promise<DownloadManyHighlightResponse> {
	const res = await fetch("http://localhost:8080/highlights", {
		headers: {
			"Content-Type": "application/json",
		},
		method: "POST",
		body: JSON.stringify(body),
	});

	if (res.ok) {
		return res.json() as Promise<DownloadManyHighlightResponse>;
	}
	throw new Error("Failed to download videos");
}
