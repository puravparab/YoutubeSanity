document.addEventListener('DOMContentLoaded', () => {
	const promptInput = document.getElementById('prompt') as HTMLInputElement;
	const modelInput = document.getElementById('model') as HTMLInputElement;
	const apiKeyInput = document.getElementById('apiKey') as HTMLInputElement;
	const runButton = document.getElementById('RunBtn') as HTMLInputElement;
	console.log(promptInput, modelInput, apiKeyInput, runButton);

	// Load stored values from localStorage
	chrome.storage.local.get(['prompt', 'model', 'apiKey'], (result) => {
  	if (result.prompt) {
			promptInput.value = result.prompt;
		} else {
			promptInput.value = "Machine learning, Gen AI, LLMS and Computer science related videos";
		}
    if (result.model) {
			modelInput.value = result.model;
		} else {
			modelInput.value = "gpt-4o-2024-05-13";
		}
    if (result.apiKey) {apiKeyInput.value = result.apiKey;}
  });

	// Store inputs to local storage
	const storeInputs = () => {
		const data = {
      prompt: promptInput.value,
      model: modelInput.value,
      apiKey: apiKeyInput.value
    };
		
		// check if configurations are updated. remove classified videos if true
		chrome.storage.local.get(['prompt', 'model'], (result) => {
			if (result.prompt !== data.prompt || result.model !== data.model) {
				chrome.storage.local.remove('videoList', () => {console.log("video cache reset.")})
			}
			// update local storage with new configuration
			chrome.storage.local.set(data, () => {});
		})
    
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