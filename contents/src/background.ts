console.log('service worker');
/*
chrome.runtime.onInstalled.addListener(() => {
  console.log('add listener');
  chrome.storage.sync.set({ color: '#3aa757' });
  chrome.webNavigation.onCompleted.addListener(
    () => {
      chrome.tabs.query({ active: true, currentWindow: true }, ([{ id }]) => {
        if (id) {
          console.log('found id');
          chrome.action.disable(id);
        }
      });
    },
    { url: [{ hostContains: 'google.com' }] }
  );
});
*/
