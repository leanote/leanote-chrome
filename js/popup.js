// Get current setting
chrome.storage.local.get(["server_type", "personal_addr", "setting_changed"], function (result) {
	var server_type = result.server_type ? result.server_type : "Official";
	var personal_addr = result.personal_addr;
	var setting_changed = result.setting_changed != null ? result.setting_changed : true;

	if(!result.server_type){
		// After first calling, save server type as default(Official)
        chrome.storage.local.set({'server_type': "Official"}, function() {}); 
	}
	// Call content script
	chrome.extension.getBackgroundPage().chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendRequest(tab.id, {'serverType': server_type, 
										'personalAddr': personal_addr,
										'settingChanged': setting_changed}, function(response) {}); 


		self.close();
	
	});
});