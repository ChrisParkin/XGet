var response = null;
var json_obj = null;
var recording = false;

// This callback function is called when the content script has been 
// injected and returned its results
function onPageDetailsReceived(pageDetails)  { 
    $("#local-xpath").html(pageDetails.local_xpath);
    $("#absolute-xpath").html(pageDetails.absolute_xpath);
    if(pageDetails.g_index > 0){
        $("#g-index").html(pageDetails.g_index + ": " + pageDetails.absolute_xpath.split('/')[pageDetails.g_index + 2]);
    }else{
        $("#g-index").html("Not a repetetive element.");
    }
    if(pageDetails.g_index > 0){
        $("#scraper-xpath").html(pageDetails.scraper_xpath);
    }
} 

// When the popup HTML has loaded
window.addEventListener('load', function(evt) {
    chrome.runtime.getBackgroundPage(function(eventPage) {
        // Call the getPageInfo function in the event page, passing in 
        // our onPageDetailsReceived function as the callback. This injects 
        // highlighter.js into the current tab's HTML
        eventPage.getPageDetails(onPageDetailsReceived);
    });
});
