import { Video } from './interfaces';

const classify = async (videoList: Video[]) : Promise<Video[]> => {
	console.log("classify", videoList);
	return videoList;
};

export default classify;