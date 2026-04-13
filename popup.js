document.addEventListener('DOMContentLoaded', () => {
  const nameInput = document.getElementById('candidateName');
  const saveBtn = document.getElementById('saveBtn');
  const statusDiv = document.getElementById('status');
  const candidateList = document.getElementById('candidateList');
  const countSpan = document.getElementById('count');
  const light = document.getElementById('light');

  // Check if current tab is a LinkedIn profile of a saved candidate
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = tabs[0]?.url || '';
    if (url.includes('linkedin.com/in/')) {
      // Get the profile name from the page
      chrome.tabs.sendMessage(tabs[0].id, { action: 'getProfileName' }, (response) => {
        if (response && response.name) {
          chrome.storage.local.get({ candidates: [] }, (data) => {
            const match = data.candidates.some(c =>
              normalize(c.name) === normalize(response.name)
            );
            if (match) {
              light.className = 'light red';
              statusDiv.textContent = 'Already contacted: ' + response.name;
              statusDiv.className = 'status error';
            }
          });
        }
      });
    }
  });

  function normalize(name) {
    return name.toLowerCase().replace(/[^a-z]/g, '');
  }

  function loadCandidates() {
    chrome.storage.local.get({ candidates: [] }, (data) => {
      const candidates = data.candidates;
      countSpan.textContent = candidates.length;
      candidateList.innerHTML = '';
      candidates.forEach((c, i) => {
        const li = document.createElement('li');
        const nameSpan = document.createElement('span');
        nameSpan.className = 'name';
        nameSpan.textContent = c.name;
        const delBtn = document.createElement('button');
        delBtn.className = 'delete-btn';
        delBtn.textContent = 'x';
        delBtn.addEventListener('click', () => deleteCandidate(i));
        li.appendChild(nameSpan);
        li.appendChild(delBtn);
        candidateList.appendChild(li);
      });
    });
  }

  function deleteCandidate(index) {
    chrome.storage.local.get({ candidates: [] }, (data) => {
      const candidates = data.candidates;
      candidates.splice(index, 1);
      chrome.storage.local.set({ candidates }, () => {
        loadCandidates();
        statusDiv.textContent = 'Candidate removed.';
        statusDiv.className = 'status';
      });
    });
  }

  saveBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (!name) {
      statusDiv.textContent = 'Please enter a name.';
      statusDiv.className = 'status error';
      return;
    }
    chrome.storage.local.get({ candidates: [] }, (data) => {
      const candidates = data.candidates;
      const exists = candidates.some(c => normalize(c.name) === normalize(name));
      if (exists) {
        statusDiv.textContent = 'Name already saved!';
        statusDiv.className = 'status error';
        return;
      }
      candidates.push({ name, date: new Date().toISOString() });
      chrome.storage.local.set({ candidates }, () => {
        nameInput.value = '';
        statusDiv.textContent = 'Saved: ' + name;
        statusDiv.className = 'status';
        loadCandidates();
      });
    });
  });

  nameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') saveBtn.click();
  });

  loadCandidates();
});
