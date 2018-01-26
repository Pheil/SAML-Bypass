"use strict";

var enable;

function rewriteUserAgentHeader(details) {
    var headers = details.requestHeaders;
    const wordHeader = {name: "X-OfApp",value: "WINWORD"};
    headers.push(wordHeader);
    return {requestHeaders: details.requestHeaders};
}

//Set state previously used
chrome.storage.sync.get('state', function(data) {
    if (data.state === 'on') {
        enable = true;
        chrome.browserAction.setIcon({ path: 'images/icon-16.png' });
        chrome.browserAction.setTitle({title: "Enabled"});
        chrome.browserAction.setBadgeText({ text: '' });
        
        //Add header to bypass SAML
        chrome.webRequest.onBeforeSendHeaders.addListener(rewriteUserAgentHeader,
                                                  {urls: ["<all_urls>"]},
                                                  ["blocking", "requestHeaders"]);
                                                  
        // chrome.webRequest.onBeforeSendHeaders.addListener(
        // function(details) {
            // var headers = details.requestHeaders;
            // const wordHeader = {name: "X-OfApp",value: "WINWORD"};
            // headers.push(wordHeader);
            // return {requestHeaders: details.requestHeaders};
        // },
        // {urls: ["<all_urls>"]},
        // ["blocking", "requestHeaders"]);
        
    } else {
        enable = false;
        chrome.browserAction.setIcon({ path: 'images/iconOff-16.png'});
        chrome.browserAction.setTitle({title: "SAML is enforced"});
        chrome.browserAction.setBadgeText({ text: 'OFF' });
        
        //Remove header to bypass SAML
        chrome.webRequest.onBeforeSendHeaders.removeListener(rewriteUserAgentHeader,
                                                  {urls: ["<all_urls>"]},
                                                  ["blocking", "requestHeaders"]);
    }
});

chrome.browserAction.onClicked.addListener(function (tab) {
    enable = enable ? false : true;
    if (enable) {
        //turn on...
        chrome.storage.sync.set({state: 'on'});
        chrome.browserAction.setIcon({ path: 'images/icon-16.png' });
        chrome.browserAction.setTitle({title: "Enabled"});
        chrome.browserAction.setBadgeText({ text: '' });
        chrome.webRequest.onBeforeSendHeaders.addListener(rewriteUserAgentHeader,
                                                  {urls: ["<all_urls>"]},
                                                  ["blocking", "requestHeaders"]);
        
    } else {
        //turn off...
        chrome.storage.sync.set({state: 'off'});
        chrome.browserAction.setIcon({ path: 'images/iconOff-16.png'});
        chrome.browserAction.setTitle({title: "SAML is enforced"});
        chrome.browserAction.setBadgeText({ text: 'OFF' });
        chrome.webRequest.onBeforeSendHeaders.removeListener(rewriteUserAgentHeader,
                                                  {urls: ["<all_urls>"]},
                                                  ["blocking", "requestHeaders"]);
    }
});

