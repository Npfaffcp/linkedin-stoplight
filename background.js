// Service worker for LinkedIn Stoplight extension

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'setRedBadge') {
    chrome.action.setBadgeText({ text: '!', tabId: sender.tab.id });
    chrome.action.setBadgeBackgroundColor({ color: '#ff1744', tabId: sender.tab.id });
  } else if (request.action === 'clearBadge') {
    chrome.action.setBadgeText({ text: '', tabId: sender.tab.id });
  }
});

// Check LinkedIn tabs when storage changes (new candidate saved)
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local' && changes.candidates) {
    chrome.tabs.query({ url: 'https://www.linkedin.com/in/*' }, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, { action: 'recheckCandidate' }).catch(() => {});
      });
    });
  }
});
