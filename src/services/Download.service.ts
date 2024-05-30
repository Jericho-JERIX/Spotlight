export interface DownloadVideoAttribute {
	id: string;
	title: string;
	filename: string;
	platform: string;
	platformId: string;
}

export interface DownloadManyVideoRequest {
	videos: {
		url: string;
		highlight: {
			start: string;
			end: string;
		}[];
	}[];
}

export interface VideoTrimResult {
	originalVideo: DownloadVideoAttribute;
	editedVideo: DownloadVideoAttribute;
	start: number;
	end: number;
}

export interface DownloadManyVideoResponse {
	videos: {
		video: DownloadVideoAttribute;
		trimmedVideos: VideoTrimResult[];
	}[];
}

export async function download(
	body: DownloadManyVideoRequest
): Promise<DownloadManyVideoResponse> {
	const res = await fetch("http://localhost:8080/downloads", {
		headers: {
			"Content-Type": "application/json",
		},
		method: "POST",
		body: JSON.stringify(body),
	});

	if (res.ok) {
		return res.json() as Promise<DownloadManyVideoResponse>;
	}
	throw new Error("Failed to download videos");
}
