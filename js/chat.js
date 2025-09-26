import { API_KEY } from './config.js';
import { toggleLoading, fileToBase64 } from './utils.js';

export function initChat() {
    const elements = {
        chatMessages: document.getElementById('chatMessages'),
        chatInput: document.getElementById('chatInput'),
        chatSendBtn: document.getElementById('chatSendBtn'),
        chatImageInput: document.getElementById('chatImageInput')
    };

    const createChatMessage = (text, sender, imageUrl = null) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ${sender}-message`;
        if (imageUrl) {
            msgDiv.innerHTML += `<img src="${imageUrl}" class="image-preview" alt="User upload">`;
        }
        msgDiv.appendChild(document.createTextNode(text));
        elements.chatMessages.appendChild(msgDiv);
        elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
    };

    // Initial greeting message
    createChatMessage("Здравейте! Аз съм AI асистентът на Core AI Solutions. Как мога да ви помогна?", "bot");

    const handleChatSubmit = async () => {
        const userInput = elements.chatInput.value.trim();
        const file = elements.chatImageInput.files[0];
        if (!userInput && !file) return;

        if (file) {
            const reader = new FileReader();
            reader.onload = e => createChatMessage(userInput, 'user', e.target.result);
            reader.readAsDataURL(file);
        } else {
            createChatMessage(userInput, 'user');
        }

        elements.chatInput.value = '';
        elements.chatImageInput.value = '';

        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;
            const parts = [{ text: `Ти си AI асистент на Core AI Solutions. Отговори на български. Запитване: ${userInput}` }];
            
            if (file) {
                const base64Image = await fileToBase64(file);
                parts.push({ inlineData: { mimeType: file.type, data: base64Image } });
            }

            const payload = { contents: [{ parts }] };
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error(`HTTP грешка! статус: ${response.status}`);
            const result = await response.json();
            createChatMessage(result.candidates[0].content.parts[0].text, 'bot');
        } catch (error) {
            console.error('Грешка в чата:', error);
            createChatMessage("Възникна грешка. Моля, опитайте отново.", 'bot');
        }
    };

    elements.chatSendBtn.addEventListener('click', handleChatSubmit);
    elements.chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleChatSubmit();
    });
}