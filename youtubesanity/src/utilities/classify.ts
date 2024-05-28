import { Video } from './interfaces';

const classify = async (videoList: Video[]) : Promise<Video[]> => {
	// console.log("classify", videoList);
	await chrome.storage.local.get(['prompt', 'model', 'apiKey'], (result) => {
		console.log(result);
	});
	return videoList;
};

export default classify;