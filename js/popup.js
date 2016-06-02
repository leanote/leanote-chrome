var txt = "TEXT";
var req_official = "Official";
var req_personal = "Personal";

 /* 
  * When user click confirm button.
  */
function doConfirm(){
	// Action when user choose a server type
	var selected_server_type = $("input[type='radio'][name='server_type']:checked");
	if (selected_server_type.length > 0) {
	    server_type = selected_server_type.val();
	}

	if(!server_type){
		return;
	}

	if(server_type==="Official"){
		// Official server

		// Save setting
		chrome.storage.local.set({'server_setting': server_type}, function() {});

		// Call content script
		chrome.extension.getBackgroundPage().chrome.tabs.getSelected(null, function(tab) {
			chrome.tabs.sendRequest(tab.id, {'serverType': req_official}, function(response) {}); 
		});
	}
	else{
		// Personal server
		var personal_addr = $('#personal_addr').val();
		if(!checkValidIpAddr(personal_addr)){
			$("#personal_addr_msg").text("Invalid Address!")
			return;
		}

		// Clear error message
		$("#personal_addr_msg").text("");

		// Save setting
		chrome.storage.local.set({'server_setting': server_type, 
								'personal_addr': personal_addr}, function() {});

		// Call content script
		chrome.extension.getBackgroundPage().chrome.tabs.getSelected(null, function(tab) { 
			chrome.tabs.sendRequest(tab.id, {'serverType': req_personal, 
											'personalAddr': personal_addr}, function(response) {}); 
		});
	}
	

};

 /* 
  * IP validation.
  */
function checkValidIpAddr(addr){
	if(!addr){
		return false;
	}
	if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(addr)) {  
    	return true;  
  	}
	return false;
};


 /* 
  * Show the setting panel.
  * Allow user to change their server type.
  */
function showSettingPanel(){

	var setting_panel = ''
    +'<div id="choose_panel">'
    +'  <div id="icon_wrapper">'
    +'    <img id="icon" src="images/icon.png">'
    +'  </div>'
    +'  <h2>Welcome!</h2>'
    +'  <h6>Please Choose Your Server</h6>'
    +'  <div id="radio_block">'
    +'	  <input type="radio" id="radio_official" name="server_type" value="Official" checked="checked"><label for="radio_official">Official</label>'
    +'	  <input type="radio" id="radio_personal" name="server_type" value="Personal"><label for="radio_personal">Personal</label><br>'
    +'	</div>'
    +'	<p id="personal_addr_msg"></p>'
    +'	<input type="text" id="personal_addr" maxlength="15" disabled="disabled">'
    +'	<button id="choose_confirm_btn">Confirm</button>'
    +'</div>';

    document.body.innerHTML = setting_panel;

    // Bind onclick event
    $("#choose_confirm_btn").on('click', function() {
	    doConfirm();
	});
}


 /* 
  * Initialize.
  */
chrome.storage.local.get('server_setting', function (result) {
    
    if(!result.server_setting){
    	
    	// Setting panel pops up for the first time
    	showSettingPanel();
    	return;
    }
    else{
    	// Settings already saved
    	var setting_panel = ''
    	+'<div id="choosen_panel">'
    	+'  <div id="icon_wrapper">'
    	+'    <img id="icon" src="images/icon.png">'
    	+'  </div>'
    	+'  <button id="continue_btn">New Note</button>'
    	+'  <button id="change_server_btn">Change Server</button>'
    	+'</div>';

    	document.body.innerHTML = setting_panel;

    	// Bind onclick event
    	$("#change_server_btn").on('click', function() {
		    showSettingPanel();
		});
    }
    
});


