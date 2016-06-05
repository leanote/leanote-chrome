var req_official = "Official";
var req_personal = "Personal";

 /* 
  * When user click confirm button.
  */
function doConfirm(){
	// Action when user choose a server type
	var server_type;
	var selected_server_type = $("input[type='radio'][name='server_type']:checked");
	if (selected_server_type.length > 0) {
	    server_type = selected_server_type.val();
	}

	if(!server_type){
		return;
	}
	
	var server_changed = true;
	if(server_type==="Official"){
		// Official server
		// Get current setting and compare
		chrome.storage.local.get('server_type', function (result) {

			if(result.server_type === server_type){
				server_changed = false;
			}

		    // Save setting
			chrome.storage.local.set({'server_type': server_type}, function() {});
	
			// Call content script
			chrome.extension.getBackgroundPage().chrome.tabs.getSelected(null, function(tab) {
				chrome.tabs.sendRequest(tab.id, {'serverType': req_official,
												'serverChanged': server_changed}, function(response) {}); 
				self.close();
			});
		    
		});

		
	}
	else{
		// Personal server
		var personal_addr = $('#personal_addr').val();
		var personal_port = $('#personal_port').val();
		var personal_ssl = false;

		if(!checkValidIpAddr(personal_addr)){
			$("#personal_addr_msg").text("无效的服务器地址!")
			return;
		}
		if(!checkValidPort(personal_port)){
			$("#personal_addr_msg").text("无效的端口号!")
			return;
		}
		if($("#personal_ssl").is(":checked")){
			personal_ssl = true;
		}

		// Clear error message
		$("#personal_addr_msg").text("");

		// Get current setting and compare
		chrome.storage.local.get(["server_type", "personal_addr", "personal_port", "personal_ssl"], function (result) {
			if(result.server_type === server_type && 
				result.personal_addr === personal_addr &&
				result.personal_port === personal_port && 
				result.personal_ssl === personal_ssl){
				server_changed = false;
			}
			// Save setting
			chrome.storage.local.set({'server_type': server_type, 
									'personal_addr': personal_addr,
									'personal_port': personal_port,
									'personal_ssl': personal_ssl}, function() {});
			
			// Call content script
			chrome.extension.getBackgroundPage().chrome.tabs.getSelected(null, function(tab) { 
				chrome.tabs.sendRequest(tab.id, {'serverType': req_personal, 
												'personalAddr': personal_addr,
												'personalPort': personal_port,
												'personalSSL': personal_ssl,
												'serverChanged': server_changed}, function(response) {}); 
			
				self.close();
			});
		});


	}
	
};

 /* 
  * Continue with current settings.
  */
function doContinue(){
	// Get current setting and call content script
	chrome.storage.local.get(["server_type", "personal_addr", "personal_port", "personal_ssl"], function (result) {

		chrome.extension.getBackgroundPage().chrome.tabs.getSelected(null, function(tab) { 
			chrome.tabs.sendRequest(tab.id, {'serverType': result.server_type, 
											'personalAddr': result.personal_addr,
											'personalPort': result.personal_port,
											'personalSSL': result.personal_ssl,
											'serverChanged': false}, function(response) {}); 
		
			self.close();
		});
	});
}

 /* 
  * IP validation.
  */
function checkValidIpAddr(addr){
	if(!addr){
		return false;
	}

	return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(addr);
};

 /* 
  * Port number validation.
  */
function checkValidPort(port){
	var reg = /^\d+$/;
	if(!port){
		// Allow empty port
		return true;
	}

	return reg.test(port);
}

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
    +'  <h2>欢迎使用</h2>'
    +'  <h5>请选择服务器</h5>'
    +'  <div id="radio_block">'
    +'	  <input type="radio" id="radio_official" name="server_type" value="Official" checked="checked"><label for="radio_official">官方</label><br>'
    +'	  <input type="radio" id="radio_personal" name="server_type" value="Personal"><label for="radio_personal">私人</label><br>'
    +'	</div>'
    +'	<p id="personal_addr_msg"></p>'
    +'	<label style="display:none;" id="personal_addr_lbl" for="personal_addr">服务器地址</label><input type="text" id="personal_addr" maxlength="15" style="display: none;">'
    +'	<label style="display:none;" id="personal_port_lbl" for="personal_addr">服务器端口</label><input type="text" id="personal_port" maxlength="5" style="display: none;">'
    +'	<label style="display:none;" id="personal_ssl_lbl" for="personal_addr">使用SSL</label><input type="checkbox" id="personal_ssl" style="display: none;"><br>'
    +'	<button id="choose_confirm_btn" class="button_normal">确认</button>'
    +'</div>';

    document.body.innerHTML = setting_panel;

    // Bind onclick event
    $("#choose_confirm_btn").on('click', function() {
	    doConfirm();
	});

    // Bind onchange event to radio buttons
    $('input[type=radio][name=server_type]').change(function() {
        if (this.value == "Official") {
            $("#personal_addr").css({"display":"none"});
            $("#personal_addr_lbl").css({"display":"none"});

            $("#personal_port").css({"display":"none"});
            $("#personal_port_lbl").css({"display":"none"});

            $("#personal_ssl").css({"display":"none"});
            $("#personal_ssl_lbl").css({"display":"none"});

        }
        else if (this.value == "Personal") {
        	$("#personal_addr").css({"display":"block"});
        	$("#personal_addr_lbl").css({"display":"block"});

            $("#personal_port").css({"display":"block"});
            $("#personal_port_lbl").css({"display":"block"});

            $("#personal_ssl").css({"display":"inline-block"});
            $("#personal_ssl_lbl").css({"display":"inline-block"});

        }
    });

}

 /* 
  * Show continue panel, allow users to coninue with current settings or change settings.
  */
function showContinuePanel(){

	// Settings already saved
    var setting_panel = ''
    +'<div id="choosen_panel">'
    +'  <div id="icon_wrapper">'
    +'    <img id="icon" src="images/icon.png">'
    +'  </div>'
    +'  <h2>欢迎使用</h2>'
    +'  <button id="continue_btn" class="button_normal">添加到笔记</button>'
    +'  <button id="change_server_btn" class="button_normal">更改设置</button>'
    +'</div>';

    document.body.innerHTML = setting_panel;

    // Bind onclick event
    $("#change_server_btn").on('click', function() {
	    showSettingPanel();
	});

	$("#continue_btn").on('click', function() {
	    doContinue();
	});
}


 /* 
  * Initialize.
  */
   
chrome.storage.local.get('server_type', function (result) {
    if(!result.server_type){
    	// Setting panel pops up for the first time
    	showSettingPanel();
    }
    else{
    	// Continue or change settings
    	showContinuePanel();
    }
    
});


