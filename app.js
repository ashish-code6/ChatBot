const apiKey = 'AIzaSyAlpZ_o1PT86KTMnU0LO2oi5PN7bENHtbA'; // Replace with your actual API key
const apiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

let sendButton = document.getElementById('send-btn'); 
let inputText = document.querySelector('#input-text');
let searchBox=document.querySelector('.search');
let loadingIndicator=document.querySelector('.loading');
let botQuest = document.querySelector('.bot-quest p'); 
let botAns = document.querySelector('.bot-ans p'); 
let copyBtn = document.querySelector('.copy-btn');
let heading=document.querySelector('.heading');
botQuest.style.display = 'none';
botAns.style.display = 'none';
copyBtn.style.display = 'none';

sendButton.addEventListener('click', async () => {
  if (inputText.value !== '') {
    heading.style.display='none';
    botQuest.style.display = 'block';
   
    botQuest.textContent = inputText.value;

    searchBox.style.backgroundColor = 'lightgrey';
    loadingIndicator.style.display = 'flex';
    loadingIndicator.innerHTML = `
      <div class="load">
        <h6></h6><h6></h6><h6></h6>
      </div>`;
    sendButton.style.cursor = 'not-allowed';

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: inputText.value, // The user input sent to the API
                },
              ],
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: Status ${response.status}`);
      }

      const rawResponse = await response.text();
      console.log('Raw API Response:', rawResponse);

      let data;
      try {
        data = JSON.parse(rawResponse);
      } catch (e) {
        console.error('Error parsing JSON:', e);
        botAns.textContent = 'Error: Received an invalid response format from the API.';
        return;
      }

      console.log('Parsed API Response:', data);

      if (data && data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts.length > 0) {
        const botMessage = data.candidates[0].content.parts[0].text.trim();
        botAns.textContent = botMessage;
        botAns.style.display = 'block';
        copyBtn.style.display = 'block';
      } else {
        botAns.textContent = 'I don’t have an answer for that right now.';
        console.error('Unexpected response format:', data);
      }
    } catch (error) {
      console.error('Error:', error);
      botAns.textContent = 'Error: Something went wrong. Please try again.';
    } finally {
      searchBox.style.backgroundColor = '';
      loadingIndicator.style.display = 'none';
      sendButton.style.cursor = 'default';
      inputText.value = ''; 
    }
  } else {
    inputText.placeholder = 'Ask Something...'; 
  }
});

// Functionality to copy bot answer 
copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(botAns.textContent)
    .then(() => {
      console.log('Bot answer copied to clipboard!');
    })
    .catch((err) => {
      console.error('Error copying bot answer:', err);
    });
});