// Get current setting and compare
chrome.storage.local.get(["server_type", "personal_addr"], function (result) {
	var server_type = result.server_type ? result.server_type : "Official";
	var personal_addr = result.personal_addr;
	// Call content script
	chrome.extension.getBackgroundPage().chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendRequest(tab.id, {'serverType': server_type, 
										'personalAddr': personal_addr}, function(response) {}); 
		self.close();
	
	});
});