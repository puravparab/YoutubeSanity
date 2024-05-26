document.getElementById('RunBtn')?.addEventListener('click', () => {
	chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
		if (tabs[0].id){
			chrome.scripting.executeScript({
				target: { tabId: tabs[0].id},
				files: ["content.js"]
			})
		} else {
			console.error('Tab Id not found.')
		}
	})
})