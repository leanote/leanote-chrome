var txt = "TEXT";
chrome.extension.getBackgroundPage().chrome.tabs.getSelected(null, function(tab) { 
  chrome.tabs.sendRequest(tab.id, {greeting: txt}, function(response) {}); 
});