import { Video } from '../utilities/interfaces';

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
					visible: true
				});
			}
		}
  });
	// Send the video list to the background script for processing
  chrome.runtime.sendMessage({ action: 'processVideos', data: videoList });
};

// listen for classification results
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'classificationResult') {
    const classifiedVideos: Video[] = request.data;
    classifiedVideos.forEach(classifiedVideo => {
			const video = videoList.find(v => v.title === classifiedVideo.title);
      if (video && !classifiedVideo.visible) {
				// Check if the "Unhide" button already exists
        const existingUnhideButton = video.element.parentElement?.querySelector('.unhide-button');
        if (!existingUnhideButton) {
          // Create a styled "Unhide" button
          const unhideButton = document.createElement('button');
          unhideButton.textContent = 'Unhide';
          unhideButton.classList.add('unhide-button');
          unhideButton.style.display = 'flex';
          unhideButton.style.margin = 'auto';
          unhideButton.style.padding = '5px 10px';
          unhideButton.style.borderRadius = '4px';
          unhideButton.style.backgroundColor = '#784ff1';
          unhideButton.style.color = 'white';
          unhideButton.style.border = 'none';
          unhideButton.style.cursor = 'pointer';
          unhideButton.addEventListener('click', () => {
						unhideButton.remove();
						video.element.hidden = false;
          });
          video.element.parentElement?.insertBefore(unhideButton, video.element.nextSibling);
        }
        video.element.hidden = true;
      }
    });
  }
});

// start scraping if user clicks the run button in the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'runScraper') {
    scrapeVideos();
  }
});