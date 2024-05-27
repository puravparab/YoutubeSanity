document.getElementById('RunBtn')?.addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0]?.id;
    if (tabId !== undefined) {
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        files: ["content.js"]
      }, () => {
        chrome.tabs.sendMessage(tabId, { action: "runScraper" }, (response) => {
        });
      });
    } else {
      console.error('Tab Id not found.');
    }
  });
});
