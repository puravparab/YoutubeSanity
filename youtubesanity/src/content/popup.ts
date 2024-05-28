document.addEventListener('DOMContentLoaded', () => {
	const promptInput = document.getElementById('prompt') as HTMLInputElement;
	const modelInput = document.getElementById('model') as HTMLInputElement;
	const apiKeyInput = document.getElementById('apiKey') as HTMLInputElement;
	const runButton = document.getElementById('RunBtn') as HTMLInputElement;
	console.log(promptInput, modelInput, apiKeyInput, runButton);

	// Load stored values from localStorage
	chrome.storage.local.get(['prompt', 'model', 'apiKey'], (result) => {
  	if (result.prompt) {promptInput.value = result.prompt;}
    if (result.model) {modelInput.value = result.model;}
    if (result.apiKey) {apiKeyInput.value = result.apiKey;}
  });

	// Store inputs to local storage
	const storeInputs = () => {
		const data = {
      prompt: promptInput.value,
      model: modelInput.value,
      apiKey: apiKeyInput.value
    };
		console.log(data);
    chrome.storage.local.set(data, () => {});
	};

	document.getElementById('RunBtn')?.addEventListener('click', () => {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			const tabId = tabs[0]?.id;
			if (tabId !== undefined) {
				chrome.scripting.executeScript({
					target: { tabId: tabId },
					files: ["content.js"]
				}, () => {
					storeInputs();
					chrome.tabs.sendMessage(tabId, { action: "runScraper" }, (response) => {});
				});
			} else {
				console.error('Tab Id not found.');
			}
		});
	});
})