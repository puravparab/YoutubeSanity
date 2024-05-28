import { Video } from './interfaces';

const classify = async (videoList: Video[]) : Promise<Video[]> => {
	// console.log("classify", videoList);
	// const model = await chrome.storage.local.get('model');
	// console.log(model);
	return videoList;
};

export default classify;