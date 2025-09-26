import { handleApiCall, toggleLoading, fileToBase64, pcmToWav, base64ToArrayBuffer } from './utils.js';
import { initChat } from './chat.js';
import { API_KEY } from './config.js';
// Ensure components (header/footer etc.) are loaded when this file is the module entrypoint
import './loadComponents.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize chat functionality first
    initChat();

    // Get all DOM elements
    const elements = {
        generateTextBtn: document.getElementById('generateTextBtn'),
        textPrompt: document.getElementById('textPrompt'),
        textOutput: document.getElementById('textOutput'),
        textSpinner: document.getElementById('textSpinner'),
        generateSolutionBtn: document.getElementById('generateSolutionBtn'),
        businessProblem: document.getElementById('businessProblem'),
        solutionOutput: document.getElementById('solutionOutput'),
        solutionSpinner: document.getElementById('solutionSpinner'),
        generateDescriptionBtn: document.getElementById('generateDescriptionBtn'),
        productFeatures: document.getElementById('productFeatures'),
        descriptionOutput: document.getElementById('descriptionOutput'),
        descriptionSpinner: document.getElementById('descriptionSpinner'),
        generateCodeBtn: document.getElementById('generateCodeBtn'),
        codePrompt: document.getElementById('codePrompt'),
        codeOutput: document.getElementById('codeOutput'),
        codeSpinner: document.getElementById('codeSpinner'),
        generateImageBtn: document.getElementById('generateImageBtn'),
        imagePrompt: document.getElementById('imagePrompt'),
        imageOutput: document.getElementById('imageOutput'),
        imageSpinner: document.getElementById('imageSpinner'),
        speakBtn: document.getElementById('speakBtn'),
        ttsPrompt: document.getElementById('ttsPrompt'),
        ttsSpinner: document.getElementById('ttsSpinner'),
        imageAnalyzeInput: document.getElementById('imageAnalyzeInput'),
        analyzeImageBtn: document.getElementById('analyzeImageBtn'),
        analyzeImageOutput: document.getElementById('analyzeImageOutput'),
        analyzeImageSpinner: document.getElementById('analyzeImageSpinner')
    };

    // Event Listeners for Text Generation
    if (elements.generateTextBtn && elements.textSpinner && elements.textOutput && elements.textPrompt) {
        elements.generateTextBtn.addEventListener('click', () => 
            handleApiCall(elements.generateTextBtn, elements.textSpinner, elements.textOutput, 
                elements.textPrompt.value, "Ти си полезен асистент, който пише на български език."));
    }

    // Event Listeners for Solution Generation
    if (elements.generateSolutionBtn && elements.solutionSpinner && elements.solutionOutput && elements.businessProblem) {
        elements.generateSolutionBtn.addEventListener('click', () => 
            handleApiCall(elements.generateSolutionBtn, elements.solutionSpinner, elements.solutionOutput,
                `Бизнес проблем: ${elements.businessProblem.value}`,
                "Ти си AI експерт и консултант по решения. Анализирай бизнес проблеми и предлагай иновативни AI решения. Отговори на български език."));
    }

    // Event Listeners for Description Generation
    if (elements.generateDescriptionBtn && elements.descriptionSpinner && elements.descriptionOutput && elements.productFeatures) {
        elements.generateDescriptionBtn.addEventListener('click', () => 
            handleApiCall(elements.generateDescriptionBtn, elements.descriptionSpinner, elements.descriptionOutput,
                `Продукт: ${elements.productFeatures.value}`,
                "Ти си експерт по маркетинг. Напиши завладяващо и кратко продуктово описание на български език."));
    }

    // Event Listeners for Code Generation
    if (elements.generateCodeBtn && elements.codeSpinner && elements.codeOutput && elements.codePrompt) {
        elements.generateCodeBtn.addEventListener('click', () => 
            handleApiCall(elements.generateCodeBtn, elements.codeSpinner, elements.codeOutput,
                elements.codePrompt.value,
                "Ти си експерт програмист. Предостави само кода, без допълнителни обяснения, освен ако не е поискано. Използвай markdown за форматиране на кода."));
    }

    // Image Generation Event Listener
    if (elements.generateImageBtn && elements.imagePrompt && elements.imageOutput && elements.imageSpinner) {
        elements.generateImageBtn.addEventListener('click', async () => {
            const prompt = elements.imagePrompt.value.trim();
            if (!prompt) return;
            elements.imageOutput.innerHTML = '';
            toggleLoading(elements.generateImageBtn, elements.imageSpinner, true);
        });
    }

    // TTS Event Listener
    if (elements.speakBtn && elements.ttsPrompt && elements.ttsSpinner) {
        elements.speakBtn.addEventListener('click', async () => {
            const text = elements.ttsPrompt.value.trim();
            if (!text) return;
            
            toggleLoading(elements.speakBtn, elements.ttsSpinner, true);
            
            try {
                const response = await fetch("https://api.openai.com/v1/audio/speech", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${API_KEY}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        model: "tts-1",
                        voice: "alloy",
                        input: text
                    }),
                });

                if (!response.ok) throw new Error(`HTTP грешка! статус: ${response.status}`);
                
                const audioData = await response.arrayBuffer();
                const audio = new Audio(URL.createObjectURL(new Blob([audioData])));
                audio.play();
            } catch (error) {
                console.error('Грешка при TTS:', error);
            } finally {
                toggleLoading(elements.speakBtn, elements.ttsSpinner, false);
            }
        });
    }

    // Image Analysis Event Listener
    if (elements.analyzeImageBtn && elements.imageAnalyzeInput && elements.analyzeImageOutput && elements.analyzeImageSpinner) {
        elements.analyzeImageBtn.addEventListener('click', async () => {
            const file = elements.imageAnalyzeInput.files[0];
            if (!file) return;

            toggleLoading(elements.analyzeImageBtn, elements.analyzeImageSpinner, true);

            try {
                const base64Image = await fileToBase64(file);
                const url = "https://api.openai.com/v1/chat/completions";
                const payload = {
                    model: "gpt-4-vision-preview",
                    messages: [{
                        role: "user",
                        content: [{
                            type: "text",
                            text: "Анализирай това изображение и опиши какво виждаш. Отговори на български език."
                        }, {
                            type: "image_url",
                            image_url: {
                                url: `data:image/jpeg;base64,${base64Image}`
                            }
                        }]
                    }]
                };
                
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });
                
                if (!response.ok) throw new Error(`HTTP грешка! статус: ${response.status}`);
                const result = await response.json();
                elements.analyzeImageOutput.textContent = result.choices[0].message.content;
            } catch (error) {
                console.error('Грешка при анализ на изображение:', error);
                elements.analyzeImageOutput.textContent = 'Възникна грешка при анализа.';
            } finally {
                toggleLoading(elements.analyzeImageBtn, elements.analyzeImageSpinner, false);
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Initialize chat functionality first
    initChat();

    // Get all DOM elements
    const elements = {
        generateTextBtn: document.getElementById('generateTextBtn'),
        textPrompt: document.getElementById('textPrompt'),
        textOutput: document.getElementById('textOutput'),
        textSpinner: document.getElementById('textSpinner'),
        generateSolutionBtn: document.getElementById('generateSolutionBtn'),
        businessProblem: document.getElementById('businessProblem'),
        solutionOutput: document.getElementById('solutionOutput'),
        solutionSpinner: document.getElementById('solutionSpinner'),
        generateDescriptionBtn: document.getElementById('generateDescriptionBtn'),
        productFeatures: document.getElementById('productFeatures'),
        descriptionOutput: document.getElementById('descriptionOutput'),
        descriptionSpinner: document.getElementById('descriptionSpinner'),
        generateCodeBtn: document.getElementById('generateCodeBtn'),
        codePrompt: document.getElementById('codePrompt'),
        codeOutput: document.getElementById('codeOutput'),
        codeSpinner: document.getElementById('codeSpinner'),
        generateImageBtn: document.getElementById('generateImageBtn'),
        imagePrompt: document.getElementById('imagePrompt'),
        imageOutput: document.getElementById('imageOutput'),
        imageSpinner: document.getElementById('imageSpinner'),
        speakBtn: document.getElementById('speakBtn'),
        ttsPrompt: document.getElementById('ttsPrompt'),
        ttsSpinner: document.getElementById('ttsSpinner'),
        imageAnalyzeInput: document.getElementById('imageAnalyzeInput'),
        analyzeImageBtn: document.getElementById('analyzeImageBtn'),
        analyzeImageOutput: document.getElementById('imageAnalyzeOutput'),
        analyzeImageSpinner: document.getElementById('analyzeImageSpinner')
    };

    // Event Listeners for Text Generation
    if (elements.generateTextBtn && elements.textSpinner && elements.textOutput && elements.textPrompt) {
        elements.generateTextBtn.addEventListener('click', () => 
            handleApiCall(elements.generateTextBtn, elements.textSpinner, elements.textOutput, 
                elements.textPrompt.value, "Ти си полезен асистент, който пише на български език."));
    }

    // Event Listeners for Solution Generation
    if (elements.generateSolutionBtn && elements.solutionSpinner && elements.solutionOutput && elements.businessProblem) {
        elements.generateSolutionBtn.addEventListener('click', () => 
            handleApiCall(elements.generateSolutionBtn, elements.solutionSpinner, elements.solutionOutput,
                `Бизнес проблем: ${elements.businessProblem.value}`,
                "Ти си AI експерт и консултант по решения. Анализирай бизнес проблеми и предлагай иновативни AI решения. Отговори на български език."));
    }

    // Event Listeners for Description Generation
    if (elements.generateDescriptionBtn && elements.descriptionSpinner && elements.descriptionOutput && elements.productFeatures) {
        elements.generateDescriptionBtn.addEventListener('click', () => 
            handleApiCall(elements.generateDescriptionBtn, elements.descriptionSpinner, elements.descriptionOutput,
                `Продукт: ${elements.productFeatures.value}`,
                "Ти си експерт по маркетинг. Напиши завладяващо и кратко продуктово описание на български език."));
    }

    // Event Listeners for Code Generation
    if (elements.generateCodeBtn && elements.codeSpinner && elements.codeOutput && elements.codePrompt) {
        elements.generateCodeBtn.addEventListener('click', () => 
            handleApiCall(elements.generateCodeBtn, elements.codeSpinner, elements.codeOutput,
                elements.codePrompt.value,
                "Ти си експерт програмист. Предостави само кода, без допълнителни обяснения, освен ако не е поискано. Използвай markdown за форматиране на кода."));
    }

    // Image Generation Event Listener
    if (elements.generateImageBtn && elements.imagePrompt && elements.imageOutput && elements.imageSpinner) {
        elements.generateImageBtn.addEventListener('click', async () => {
            const prompt = elements.imagePrompt.value.trim();
            if (!prompt) return;
            
            elements.imageOutput.innerHTML = '';
            toggleLoading(elements.generateImageBtn, elements.imageSpinner, true);
            
            try {
                const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${API_KEY}`;
                const payload = { instances: [{ prompt }], parameters: { sampleCount: 1 } };
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                
                if (!response.ok) throw new Error(`HTTP грешка! статус: ${response.status}`);
                const result = await response.json();
                const b64 = result.predictions[0].bytesBase64Encoded;
                elements.imageOutput.innerHTML = `<img src="data:image/png;base64,${b64}" class="rounded-lg max-h-full" alt="Generated image">`;
            } catch (error) {
                console.error('Грешка при генериране на изображение:', error);
                elements.imageOutput.textContent = 'Грешка.';
            } finally {
                toggleLoading(elements.generateImageBtn, elements.imageSpinner, false);
            }
        });
    }

    // Text-to-Speech Event Listener
    if (elements.speakBtn && elements.ttsPrompt && elements.ttsSpinner) {
        elements.speakBtn.addEventListener('click', async () => {
            const prompt = elements.ttsPrompt.value.trim();
            if (!prompt) return;
            toggleLoading(elements.speakBtn, elements.ttsSpinner, true);
            
            try {
                const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${API_KEY}`;
                const payload = {
                    model: "gemini-2.5-flash-preview-tts",
                    contents: [{ parts: [{ text: `Say clearly: ${prompt}` }] }],
                    generationConfig: { responseModalities: ["AUDIO"] }
                };
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                
                if (!response.ok) throw new Error(`HTTP грешка! статус: ${response.status}`);
            const result = await response.json();
            const audioData = result.candidates[0].content.parts[0].inlineData.data;
            const mimeType = result.candidates[0].content.parts[0].inlineData.mimeType;
            const sampleRate = parseInt(mimeType.match(/rate=(\d+)/)[1], 10);
            const pcmData = new Int16Array(base64ToArrayBuffer(audioData));
            const wavBlob = pcmToWav(pcmData, sampleRate);
            const audioUrl = URL.createObjectURL(wavBlob);
            new Audio(audioUrl).play();
        } catch (error) {
            console.error('Грешка при TTS:', error);
        } finally {
            toggleLoading(elements.speakBtn, elements.ttsSpinner, false);
        }
    });

    // Image Analysis Event Listener
    if (elements.analyzeImageBtn && elements.imageAnalyzeInput && elements.analyzeImageOutput && elements.analyzeImageSpinner) {
        elements.analyzeImageBtn.addEventListener('click', async () => {
            const file = elements.imageAnalyzeInput.files[0];
        if (!file) return;
        elements.analyzeImageOutput.textContent = '';
        toggleLoading(elements.analyzeImageBtn, elements.analyzeImageSpinner, true);
        
        try {
            const base64Image = await fileToBase64(file);
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;
            const payload = {
                contents: [{
                    parts: [
                        { text: "Опиши това изображение на български." },
                        { inlineData: { mimeType: file.type, data: base64Image } }
                    ]
                }]
            };
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            if (!response.ok) throw new Error(`HTTP грешка! статус: ${response.status}`);
            const result = await response.json();
            elements.analyzeImageOutput.textContent = result.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error('Грешка при анализ на изображение:', error);
            elements.analyzeImageOutput.textContent = 'Грешка.';
        } finally {
            toggleLoading(elements.analyzeImageBtn, elements.analyzeImageSpinner, false);
        }
    });
    }

    }
});