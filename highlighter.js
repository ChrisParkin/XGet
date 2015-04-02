loglevel = 0; // loglevel can be set to zero to disable console logging.

function get_local_xpath(node){
  var node = node;
  var xpath = "";
  while(node.tagName !== 'HTML' && node.getAttribute('id') === null){
    if(twins_exist(node)){
      var twin_count = 1;
      sib = Object.create(node);
      
      // determine how many 'twins' exist
      while(sib.previousElementSibling !== null){
        sib = sib.previousElementSibling;
        if(sib.tagName === node.tagName){
          twin_count = twin_count + 1;
        }
      }
      xpath = "/" + node.tagName.toLowerCase() + "[" + (twin_count) + "]" + xpath;
    }else{
      xpath = "/" + node.tagName.toLowerCase() + xpath;
    }
    node = node.parentNode;
  }
  if(node.tagName === 'HTML'){
    xpath = "//html" + xpath;
  }else{
    xpath = "//*[@id='" + node.getAttribute('id') + "']" + xpath;
  }
  return xpath;
}

function twins_exist(node){
  tag = node.tagName;
  var siblings = node.parentNode.children;
  var retVal = false;
  for(i=0; i<siblings.length; i++){
    if(siblings[i].tagName === tag && siblings[i] !== node){
      retVal = true;
      break;
    }
  }
  return retVal;
}

function get_repetetive_element(path){
  var max_count = 0;
  var max_element = 0;
  var elementString = path.substr(2,path.length)
  p("elementString: "+elementString);
  var elementArray = elementString.split("/");
  for(var i = 0; i < elementArray.length; i++){
    p("starting i: " + i);
    if(elementArray[i].search(/\[\d+\]/) > -1){
      var search_path = "//";
      for(j = 0; j < i; j++){
        search_path += elementArray[j] + "/"
      }
      search_path += elementArray[i].replace(/\[\d+\]/,'');
      var xpathResult = document.evaluate(search_path, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);
      p("found an index. search path is " + search_path + " for " + xpathResult.snapshotLength + " hits.");
      if(xpathResult.snapshotLength > max_count){
        if(retrieves_elements(path, i, xpathResult.snapshotLength)){
          max_count = xpathResult.snapshotLength;   
          max_element = i;
          p("result length: " + xpathResult.snapshotLength + ". max_element: " + max_element);
        }
      }
    }
  }
  return max_element;
}

function retrieves_elements(path, gindex, num_matches){
  p("retrieves elements?: " + path + " | " + gindex + " | " + num_matches);
  var hit_count = 0;
  for(var i = 1; i < num_matches; i++){
    var new_path = path_at_index(path, gindex, i);
    p("TRYING PATH: " + new_path);
    var xresult = document.evaluate(new_path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    if(xresult.singleNodeValue !== null){
      hit_count = hit_count + 1;
    }
  }
  p("found " + hit_count + " matches for gindex " + gindex);
  return hit_count > (num_matches/10);
}

function path_at_index(path, gindex, desired_index){
  var elementString = path.substr(2,path.length);
  var elementArray = elementString.split("/");
  if(desired_index === 0){
    elementArray[gindex] = elementArray[gindex].replace(/\[\d+\]/,'');
  }else{
    elementArray[gindex] = elementArray[gindex].replace(/\[\d+\]/,'['+desired_index.toString()+']');
  }
  return '//' + elementArray.join('/');
}

function p(msg){
  if(loglevel === 1){
    console.log(msg);
  }
}

function get_scraper_xpath(path){
  var theOne = get_repetetive_element(path);
  var elementArray = path.substr(2,path.length).split("/");
  var retVal = "//";
  if(theOne === 0){
    firstnumber = elementArray[0].indexOf(/\d/);
    startswith = elementArray[0].substr(0,firstnumber);
    retVal += "[starts-with(@id,'startswith')]"
    if(elementArray.length > 1){
      retVal += "/"
    }
    elementsArray.pop();
    retVal += elementsArray.join("/");
  }else{
    for(i = 0; i < elementArray.length; i++){
      if(i === theOne){
        retVal = retVal + elementArray[i].replace(/\[\d+\]/,'');
      }else{
        retVal = retVal + elementArray[i];
      }
      if(i < elementArray.length - 1){
        retVal = retVal + "/";
      }
    }
  }
  return retVal;
}

function get_absolute_xpath(node){
  var node = node;
  var xpath = "";

  while(node.tagName !== 'HTML'){

    if(twins_exist(node)){
      var twin_count = 1;
      var sib = Object.create(node);
      
      // determine how many 'twins' exist
      while(sib.previousElementSibling !== null){
        sib = sib.previousElementSibling;
        if(sib.tagName === node.tagName){
          twin_count = twin_count + 1;
        }
      }
      xpath = "/" + node.tagName.toLowerCase() + "[" + (twin_count) + "]" + xpath;
    }else{
      xpath = "/" + node.tagName.toLowerCase() + xpath;
    }
    node = node.parentNode;
  }
  xpath = "//html"+xpath;
  return xpath;
}

prevElement = null;
document.addEventListener('mousemove', function(e){
  var elem = e.target || e.srcElement;
  if (prevElement!= null) {prevElement.classList.remove("mouseOn");}
  elem.classList.add("mouseOn");
  prevElement = elem;
},true);

var selection = window.getSelection().toString();
var range = window.getSelection().getRangeAt(0);
var container = range.commonAncestorContainer;
var parent = null;

if(typeof container.tagName === 'undefined'){
  parent = container.parentNode
}else{
  parent = container;
}

p("Selection: " + selection);
p("Parent: " + parent + " (" + parent.tagName + ")");
var localpath = get_local_xpath(parent);
p("localpath is " + localpath);
var absolutepath = get_absolute_xpath(parent);
var g_index = get_repetetive_element(absolutepath);
var scraperpath = path_at_index(absolutepath, g_index, 0);

chrome.runtime.sendMessage({
  'local_xpath': localpath,
  'absolute_xpath': absolutepath,
  'g_index': g_index,
  'scraper_xpath': scraperpath 
});
