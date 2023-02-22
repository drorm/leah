console.log('service worker');
/*
console.log('background.ts');
chrome.runtime.onInstalled.addListener((details) => {
  console.log('details', details);
  if (details.reason === 'install') {
    console.log('This is a first install!');
  } else if (details.reason === 'update') {
    console.log('This is an upgrade!');
    // const thisVersion = chrome.runtime.getManifest().version;
  }
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs.length === 0 || tabs[0].id === undefined) {
      return;
    }
    chrome.tabs.sendMessage(
      tabs[0].id,
      {
        installDetails: details,
      },
      function (response) {
        console.log(response.farewell);
      }
    );
  });
});
*/
