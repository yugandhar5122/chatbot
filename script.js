document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const chatBody = document.getElementById('chat-body');
    const adminPage = document.getElementById('admin-page');
    const keywordInput = document.getElementById('keyword');
    const responseInput = document.getElementById('response');
    const addKeywordButton = document.getElementById('add-keyword');
    const viewDataButton = document.getElementById('view-data');
    const backToChatButton = document.getElementById('back-to-chat');
    const dataView = document.getElementById('data-view');
    const newLockCodeInput = document.getElementById('new-lock-code');
    const setLockCodeButton = document.getElementById('set-lock-code');

    // Initial lock code
    let lockCode = 'iamadmin';
    const responseMap = {};

    function convertUrlsToLinks(text) {
        const urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=_|!:,.;]*[-A-Z0-9+&@#\/%=_|])/ig;
        return text.replace(urlPattern, '<a href="$1" target="_blank">$1</a>');
    }

    function addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = message ${type}-message;
        messageDiv.innerHTML = <p>${convertUrlsToLinks(text)}</p>;
        chatBody.appendChild(messageDiv);
        chatBody.scrollTop = chatBody.scrollHeight; // Scroll to bottom
    }

    function handleUserInput() {
        const inputText = userInput.value.trim().toLowerCase(); // Convert to lower case
        if (!inputText) return;

        addMessage(inputText, 'user');
        userInput.value = '';

        if (inputText === lockCode.toLowerCase()) {
            chatBody.style.display = 'none'; // Hide chat
            adminPage.style.display = 'block'; // Show admin page
            updateDataView(); // Update data view
            return;
        }

        let response = "Sorry, I don't understand that.";
        for (const [responseText, keywords] of Object.entries(responseMap)) {
            // Check if the input text contains any of the keywords
            if (keywords.some(keyword => inputText.includes(keyword.toLowerCase()))) {
                response = responseText;
                break;
            }
        }
        
        addMessage(response, 'bot');
    }

    function updateDataView() {
        dataView.innerHTML = '';
        if (Object.keys(responseMap).length === 0) {
            dataView.innerHTML = '<p>No keywords and responses added yet.</p>';
            return;
        }

        for (const [response, keywords] of Object.entries(responseMap)) {
            const dataDiv = document.createElement('div');
            dataDiv.className = 'data-item';
            dataDiv.innerHTML = `
                <span><strong>${keywords.join(', ')}:</strong> ${convertUrlsToLinks(response)}</span>
                <div>
                    <button onclick="deleteResponse('${response}')">Delete</button>
                    <button onclick="addKeyword('${response}')">Add Keyword</button>
                </div>
            `;
            dataView.appendChild(dataDiv);
        }
    }

    window.deleteResponse = (response) => {
        delete responseMap[response];
        updateDataView();
    };

    window.addKeyword = (response) => {
        const newKeyword = prompt('Enter new keyword to add for the same response:');
        if (newKeyword) {
            const lowerCaseKeyword = newKeyword.trim().toLowerCase();
            // Add new keyword to existing response
            if (responseMap[response]) {
                if (!responseMap[response].includes(lowerCaseKeyword)) {
                    responseMap[response].push(lowerCaseKeyword);
                    updateDataView();
                } else {
                    alert('Keyword already exists for this response.');
                }
            } else {
                alert('Response not found.');
            }
        }
    };

    addKeywordButton.addEventListener('click', () => {
        const keyword = keywordInput.value.trim().toLowerCase();
        const response = responseInput.value.trim();
        if (keyword && response) {
            if (!Object.values(responseMap).some(keywords => keywords.includes(keyword))) {
                if (!responseMap[response]) {
                    responseMap[response] = [];
                }
                if (!responseMap[response].includes(keyword)) {
                    responseMap[response].push(keyword);
                    keywordInput.value = '';
                    responseInput.value = '';
                    updateDataView();
                    alert('Keyword and response added.');
                } else {
                    alert('Keyword already exists for this response.');
                }
            } else {
                alert('Keyword already exists.');
            }
        }
    });

    viewDataButton.addEventListener('click', () => {
        updateDataView();
    });

    backToChatButton.addEventListener('click', () => {
        adminPage.style.display = 'none';
        chatBody.style.display = 'flex'; // Show chat
    });

    setLockCodeButton.addEventListener('click', () => {
        const newLockCode = newLockCodeInput.value.trim();
        if (newLockCode) {
            lockCode = newLockCode;
            newLockCodeInput.value = '';
            alert('Lock code updated successfully.');
        } else {
            alert('Please enter a valid lock code.');
        }
    });

    sendButton.addEventListener('click', handleUserInput);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleUserInput();
    });
});
