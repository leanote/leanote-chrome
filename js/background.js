// var bookMarkData = null;
// chrome.bookmarks.getTree(function (aBookMark) {
//     bookMarkData = aBookMark;
// });

// chrome.extension.onRequest.addListener(function (request, sender, sendResponse) {
    
//     setTimeout(function() { 
//         sendResponse('life3ddd33 --- ' + request.query);
//     });

//     chrome.bookmarks.search(request.query, function (ret) {
//       sendResponse(ret);
//     });
// });

/*

var showed = false;
window.onload = function() {
    var i = 0;
    // setInterval(function() {
      if (!showed) {
        chrome.browserAction.setBadgeText({text: 'new'});
        showed = true;
      }
    // i+=1;
    // },5000);
}

*/

chrome.browserAction.onClicked.addListener(function(activeTab) {
  // chrome.browserAction.setIcon('images/icon-gray.png');
  chrome.browserAction.setBadgeText({text: ''});
  chrome.tabs.sendRequest(activeTab.id, {a: 'life'}, function(response) {});
    /*
  // var newURL = "http://www.baidu.com";
  // chrome.tabs.create({url: newURL});
  chrome.tabs.getSelected(null, function(tab) { 
    console.log(tab);
    chrome.tabs.sendRequest(tab.id, {a: 'life'}, function(response) {
    });
  });
  */


});