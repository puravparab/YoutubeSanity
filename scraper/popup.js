// Scrape button
// Use after you've scrolled on the youtube recs page to get more videos
document.getElementById('scrapeBtn').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ["content.js"]
    }, () => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "scrape" }, (response) => {
        if (response) {
          chrome.storage.local.set({ videoData: response }, () => {
            console.log('Video data saved.');
          });
        }
      });
    });
  });
});

// Save Button
document.getElementById('saveBtn').addEventListener('click', () => {
  chrome.storage.local.get('videoData', (result) => {
    if (result.videoData) {
      const csvHeader = "Title;Image Link;Video Link;Creator;Creator Link\n";
      const csvContent = csvHeader + result.videoData.map(e => `${e.title};${e.image};${e.link};${e.creator};${e.creatorLink}`).join("\n");

      const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "video_data.csv");
      document.body.appendChild(link);
      link.click();
    }
  });
});