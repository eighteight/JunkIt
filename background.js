function setEnabled(enabled) {
    let status = enabled ? 'Disable' : 'Enable';
    let title = status + ' JunkIt Pause'
    chrome.browserAction.setBadgeText({text: enabled ? '' : 'Off'});
    chrome.storage.local.set({'enabled': enabled});
}

// first run: if we're not already enabled, set enabled to true
chrome.storage.local.get(['enabled'], function(result) {
    if (typeof(result.enabled) == "undefined") {
        setEnabled(true);
    }
})

chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.storage.local.get(['enabled'], function(result) {
        setEnabled(!result.enabled);
    });
});

chrome.omnibox.onInputEntered.addListener(function(text) {

    chrome.storage.local.get(['JunkIt'], function(data) {

        let userList = data.JunkIt;
        if (Array.isArray(userList)) {
            if (userList.indexOf(text) !== -1) {
                alert(text + ' is already junked!');
                return;
            } else {
                userList.push(text);
            }
        } else {
            userList = [text];
        }

        alert(text + ' will be junked!');

        chrome.storage.local.set({"JunkIt": userList}, function(){
            alert('here we go');
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {what: "JunkIt"}, function(response) {
                    console.log(response.farewell);
                });
            });
        });
    });
});