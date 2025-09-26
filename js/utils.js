export const toggleLoading = (button, spinner, isLoading) => {
    button.disabled = isLoading;
    if (isLoading) spinner.classList.remove('hidden');
    else spinner.classList.add('hidden');
};

export const fileToBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = error => reject(error);
});

export const pcmToWav = (pcmData, sampleRate) => {
    const numSamples = pcmData.length;
    const numChannels = 1;
    const bytesPerSample = 2; // 16-bit
    const blockAlign = numChannels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;
    const dataSize = numSamples * blockAlign;
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);
    let pos = 0;

    const writeString = (s) => {
        for (let i = 0; i < s.length; i++) {
            view.setUint8(pos++, s.charCodeAt(i));
        }
    };

    writeString('RIFF');
    view.setUint32(pos, 36 + dataSize, true);
    pos += 4;
    writeString('WAVE');
    writeString('fmt ');
    view.setUint32(pos, 16, true);
    pos += 4;
    view.setUint16(pos, 1, true);
    pos += 2;
    view.setUint16(pos, numChannels, true);
    pos += 2;
    view.setUint32(pos, sampleRate, true);
    pos += 4;
    view.setUint32(pos, byteRate, true);
    pos += 4;
    view.setUint16(pos, blockAlign, true);
    pos += 2;
    view.setUint16(pos, bytesPerSample * 8, true);
    pos += 2;
    writeString('data');
    view.setUint32(pos, dataSize, true);
    pos += 4;

    const pcm16 = new Int16Array(pcmData.buffer);
    for (let i = 0; i < pcm16.length; i++, pos += 2) {
        view.setInt16(pos, pcm16[i], true);
    }

    return new Blob([view], { type: 'audio/wav' });
};

export const base64ToArrayBuffer = (base64) => {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
};

export const handleApiCall = async (button, spinner, outputElement, prompt, systemInstruction) => {
    if (!prompt) return;
    outputElement.textContent = '';
    toggleLoading(button, spinner, true);

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;
        const payload = {
            contents: [{
                parts: [{ text: prompt }]
            }],
            systemInstruction: {
                parts: [{ text: systemInstruction }]
            }
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`HTTP грешка! статус: ${response.status}`);
        const result = await response.json();
        outputElement.textContent = result.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('API извикването се провали:', error);
        outputElement.textContent = 'Възникна грешка. Моля, опитайте отново.';
    } finally {
        toggleLoading(button, spinner, false);
    }
};