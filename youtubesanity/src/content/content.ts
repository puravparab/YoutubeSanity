interface Video {
	title: string; // video title
	image: string; // url to video thumbnail image
	link: string; // url to video
	creator: string; // creator name
	creatorLink: string; // url to creator profile
	element: HTMLElement; // video HTML element
	classified: boolean; // Is the video classified?
}

let videoList: Video[] = [];

const scrapeVideos = () : void => {
	document.querySelectorAll('ytd-rich-grid-media').forEach(video => {
		const thumbnail = video.querySelector('ytd-thumbnail');
		if (thumbnail){
			const videoLinkElement = thumbnail.querySelector('a');
			const imageLinkElement = thumbnail.querySelector('img');
			const videoTitleElement = video.querySelector('h3');
			const creatorElement = video.querySelector('ytd-channel-name');
			const creatorLinkElement = creatorElement ? creatorElement.querySelector('a') : null;
			
			const title = videoTitleElement?.textContent?.trim();
			const image = imageLinkElement?.src || "";
			const link = videoLinkElement?.href || "";
			const creator = creatorLinkElement?.textContent?.trim() || "";
			const creatorLink = creatorLinkElement?.href || "";

			// If title is not null add to list
			if (title) {
				videoList.push({ 
					title, 
					image, 
					link, 
					creator, 
					creatorLink,
					element: video as HTMLElement,
					classified: false
				});
			}
		}
  });

	console.log(videoList);
}

scrapeVideos();