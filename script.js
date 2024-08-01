const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// Predefined questions and answers
const qaPairs = {
  "What's your name?": "My name is ChatBot.",
  "How are you?": "I'm doing well, thank you for asking!",
  "What's the weather like today?": "I'm sorry, I don't have real-time weather information. You can check a weather website for accurate information.",
  "Who created you?": "I was created by a developer as an advanced chatbot example.",
  "What's the meaning of life?": "That's a profound question! Philosophers have debated this for centuries. You might want to explore different philosophical perspectives on this topic.",
  "How long does a period usually last?":"Typically 3-7 days, but it can vary.",
  "How often will I get my period?":"Usually every 28 days, but cycles can range from 21-35 days.",
  "What products can I use?":"Options include pads, tampons, menstrual cups, and period underwear.",
  "How do I deal with cramps":"Try a heating pad, gentle exercise, or over-the-counter pain relievers.",
  "Is it normal for my flow to be heavy/light?":" Flow can vary, but talk to a doctor if it's extremely heavy or light.",
  "Are mood changes normal?":"Yes, hormone fluctuations can affect mood.",
  "When should I see a doctor?":"If you have severe pain, very heavy bleeding, or other concerns."
};

function sendMessage() {
  const message = userInput.value.trim();
  if (message !== '') {
    addMessage('user', message);
    showTypingIndicator();
    processMessage(message);
    userInput.value = '';
  }
}

function addMessage(sender, message) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', `${sender}-message`);
  messageElement.textContent = message;
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
  const typingIndicator = document.createElement('div');
  typingIndicator.classList.add('typing-indicator');
  typingIndicator.innerHTML = '<span></span><span></span><span></span>';
  chatMessages.appendChild(typingIndicator);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
  const typingIndicator = document.querySelector('.typing-indicator');
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

function processMessage(message) {
  if (qaPairs.hasOwnProperty(message)) {
    setTimeout(() => {
      removeTypingIndicator();
      addMessage('bot', qaPairs[message]);
    }, 1000);
  } else {
    performGoogleSearch(message);
  }
}

function performGoogleSearch(query) {
  const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

  fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(googleSearchUrl)}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(data.contents, 'text/html');

      const firstResult = htmlDoc.querySelector('.g');
      if (firstResult) {
        const title = firstResult.querySelector('h3')?.textContent || 'No title found';
        const snippet = firstResult.querySelector('.VwiC3b')?.textContent || 'No snippet found';
        const link = firstResult.querySelector('a')?.href || googleSearchUrl;

        const resultMessage = `Here's what I found:\n\n"${title}"\n\n${snippet}\n\nRead more: ${link}`;
        removeTypingIndicator();
        addMessage('bot', DOMPurify.sanitize(resultMessage));
      } else {
        throw new Error('No search results found');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      removeTypingIndicator();
      addMessage('bot', `I'm sorry, I encountered an error while searching. Here's a link to search Google yourself: ${googleSearchUrl}`);
    });
}

userInput.addEventListener('keypress', function (event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

sendButton.addEventListener('click', sendMessage);