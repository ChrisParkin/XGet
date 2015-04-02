XGet
=======

Overview
--------
XGet is a Google Chrome extension that can be used to identify the XPath to an element on any webpage. On pages with lists of items, it also attempts to determine the path which can be used to scrape all elements of the same type. 

Usage
-----
1. Install the Chrome extension. See https://developer.chrome.com/extensions/getstarted#unpacked for instructions
2. Load a webpage
3. Highlight data of interest
4. Click the XGet icon

Output
------
+ Local Path: This mimics the value that can be captured by selecting 'Copy Xpath' within the Chrome inspector
+ Absolute Path: A path to the element starting from /html
+ Possible Scrape Index: Attempts to find an index in the path where removal of the index results in scraping all like-elements.
+ Scraping Path: Used to get all like elements

Testing
-------
You may use the $x() function in the Chrome inspector console to try the generated XPaths

Example: 
$x("/html/div/some/path/to/my/highlighted/element")



