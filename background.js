var colors = ["black", "white", "red", "blue", "green", "yellow"];
var color = "black";
var format24 = true;

chrome.storage.sync.get(['color'], function(result) {
    color = result.color || 'black';
    update();
  });

  chrome.storage.sync.get(['format24'], function(result) {
    var stringFormat = result.format24 || "twentyfour";
    format24 = (stringFormat == "twentyfour");
    update();
  });
  
  function update() {
    var date = new Date();
    var hours = date.getHours();
  
    if(format24 != true) {
      hours = hours % 12
      if(hours == 0){
        hours = 12;
      }
    }
  
    var minutes=  date.getMinutes();
  
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    context.fillStyle = color;
    context.font = "80px sans-serif";
    context.fillText(hours, 1, 58);
    context.font = "62px sans-serif";
    context.fillText((minutes<10 ? "0": "") + minutes, 60, 110);
  
    var imageData = context.getImageData(0, 0, 128, 128);
  
    chrome.browserAction.setIcon({imageData: imageData});
    chrome.browserAction.setTitle({title: date.toString()});
  
    setTimeout(update, (60-date.getSeconds())*1000);
  }
  
  chrome.browserAction.onClicked.addListener(function() {
    var currentIndex = colors.indexOf(color);
    var newIndex = (currentIndex + 1) % colors.length;
    if(newIndex == 0) {
      format24 = !format24;
    }
    chrome.storage.sync.set({
      color: colors[newIndex],
      format24: (format24 ? "twentyfour" : "twelve")
    });
  });
  
  function logStorageChange(changes, area) {
    if(changes['color']) {
      color = changes['color'].newValue
    }
    if(changes['format24']) {
      format24 = (changes['format24'].newValue == "twentyfour");
    }
    update();
  }
  
  chrome.storage.onChanged.addListener(logStorageChange);
  
  