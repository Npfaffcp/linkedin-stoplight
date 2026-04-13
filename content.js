(function() {
  function normalize(name) {
    return name.toLowerCase().replace(/[^a-z]/g, '');
  }

  function getProfileName() {
    const h1 = document.querySelector('h1.text-heading-xlarge');
    if (h1) return h1.innerText.trim();
    const altH1 = document.querySelector('.pv-top-card--list li');
    if (altH1) return altH1.innerText.trim();
    return null;
  }

  function createBanner(isMatch, profileName) {
    const existing = document.getElementById('li-stoplight-banner');
    if (existing) existing.remove();

    const banner = document.createElement('div');
    banner.id = 'li-stoplight-banner';

    if (isMatch) {
      banner.className = 'li-stoplight-banner red';
      banner.innerHTML = '<span class="li-stoplight-dot red"></span> ALREADY CONTACTED: ' + profileName;
    } else {
      banner.className = 'li-stoplight-banner green';
      banner.innerHTML = '<span class="li-stoplight-dot green"></span> New candidate';
    }

    document.body.prepend(banner);
  }

  function checkCandidate() {
    const profileName = getProfileName();
    if (!profileName) {
      setTimeout(checkCandidate, 1000);
      return;
    }

    chrome.storage.local.get({ candidates: [] }, (data) => {
      const normalizedProfile = normalize(profileName);
      const match = data.candidates.some(c => normalizedProfile === normalize(c.name));
      createBanner(match, profileName);

      // Also update the extension icon badge
      if (match) {
        chrome.runtime.sendMessage({ action: 'setRedBadge', name: profileName });
      } else {
        chrome.runtime.sendMessage({ action: 'clearBadge' });
      }
    });
  }

  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getProfileName') {
      const name = getProfileName();
      sendResponse({ name: name });
    }
        if (request.action === 'recheckCandidate') {
      checkCandidate();
    }
    return true;
  });

  // Run check on load
  checkCandidate();

  // Also watch for SPA navigation (LinkedIn is a SPA)
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      if (url.includes('/in/')) {
        setTimeout(checkCandidate, 1500);
      }
    }
  }).observe(document.body, { subtree: true, childList: true });
})();
