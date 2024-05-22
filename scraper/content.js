let videoData = [];

function scrapeVideos() {
  document.querySelectorAll('ytd-rich-grid-media').forEach(video => {
		const thumbnail = video.querySelector('ytd-thumbnail');
		const videoLinkElement = thumbnail.querySelector('a');
		const imageLinkElement = thumbnail.querySelector('img');
		const videoTitleElement = video.querySelector('h3');
		const creatorElement = video.querySelector('ytd-channel-name');
		const creatorLinkElement = creatorElement ? creatorElement.querySelector('a') : null;

		const title = videoTitleElement?.textContent.trim();
		const image = imageLinkElement?.src;
		const link = videoLinkElement?.href;
		const creator = creatorLinkElement?.textContent.trim();
		const creatorLink = creatorLinkElement?.href;

		if (title && image && link && creator && creatorLink) {
			videoData.push({ title, image, link, creator, creatorLink });
		}
  });
	console.log(videoData)
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'scrape') {
		scrapeVideos();
    sendResponse(videoData);
  }
});
