$(document).ready(function(){
    // Bind onclick event
    $("#choose_confirm_btn").on('click', function() {
        doConfirm();
    });
    
    // Bind onchange event to radio buttons
    $('input[type=radio][name=server_type]').change(function() {
    
        if (this.value == "Official") {
            hidePersonalSettings();
    
        }
        else if (this.value == "Personal") {
            showPersonalSettings();
        }
    });

    // Set current settings to page
    chrome.storage.local.get(["server_type", "personal_addr"], function (result) {

        var $radios = $('input:radio[name=server_type]');
        if(result.server_type === "Personal"){
            $radios.filter('[value=Personal]').prop('checked', true);
            showPersonalSettings();
            $("#personal_addr").val(result.personal_addr);
        }

    });
});

function hidePersonalSettings(){
    $("#personal_addr").css({"display":"none"});
    $("#personal_addr_lbl").css({"display":"none"});
    
}

function showPersonalSettings(){
    $("#personal_addr").css({"display":"block"});
    $("#personal_addr_lbl").css({"display":"block"});
}

function doConfirm(){

    // Action when user choose a server type
    var server_type;
    var setting_changed = true;
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
        chrome.storage.local.get(["server_type", "personal_addr"], function (result) {
            if(result.server_type === server_type){
                setting_changed = false;
            }

            chrome.storage.local.set({'server_type': server_type,
                                    'setting_changed': setting_changed}, function() {
                alert("设置已保存");
            });
        });
        

    }
    else{
        // Personal server
        var personal_addr = $('#personal_addr').val();
        if(!personal_addr){
            $("#personal_addr_msg").text("无效的服务器地址!")
            return;
        }
        // Clear error message
        $("#personal_addr_msg").text("");
        // Save setting
        chrome.storage.local.get(["server_type", "personal_addr"], function (result) {
            if(result.server_type === server_type &&
                result.personal_addr === personal_addr){
                setting_changed = false;
            }

            chrome.storage.local.set({'server_type': server_type, 
                                    'personal_addr': personal_addr,
                                    'setting_changed': setting_changed}, 
                                    function() {
                                        alert("设置已保存");
                                    });
        });
        
    }

}
