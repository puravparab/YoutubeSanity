import { Video } from '../utilities/interfaces';
import classify from '../utilities/classify';

// check if video exists in local storage
const getVideoVisibility = async (videoTitle: string): Promise<boolean | null> => {
	return new Promise((resolve) => {
		chrome.storage.local.get(['videoList'], (result) => {
			const videoList = result.videoList || {};
			const video = videoList[videoTitle];
			if (video){
				resolve(video["visible"]);
			} else {
				resolve(null);
			}
		});
	})
};

// store new videos in local storage
const storeVideo = async (videos: Video[]): Promise<void> => {
	return new Promise((resolve) => {
		chrome.storage.local.get(['videoList'], (result) => {
			const videoList = result.videoList || {};
			for (const video of videos){
				videoList[video.title] = video;
				videoList[video.title].element = null;
			}
			chrome.storage.local.set({ videoList }, () => {
				resolve();
			})
		});
	});
};

// listen for the content script
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === 'processVideos') {
		console.log("Processing videos: ");
    const videoList: Video[] = request.data;
    const unclassifiedVideos: Video[] = [];
    const classifiedVideos: Video[] = [];

		// Iterate through every video and check if it exists in local storage
		for (const video of videoList){
			const isVisible = await getVideoVisibility(video.title);
			if (isVisible !== null){
				video.visible = isVisible;
				classifiedVideos.push(video);
			} else {
				unclassifiedVideos.push(video);
			}
		}
		
		// send classified videos back to content.js
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			chrome.tabs.sendMessage(tabs[0].id!, { action: 'classificationResult', data: classifiedVideos });
		});

		// classify unclassified videos
		if (unclassifiedVideos.length > 0){
			const result = await classify(unclassifiedVideos);
			await storeVideo(result);

			console.log("classified: " + classifiedVideos.length + ", unclassified: ", unclassifiedVideos.length);

			// send classified videos back to content.js
			chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id!, { action: 'classificationResult', data: result });
      });
		}
  }
});