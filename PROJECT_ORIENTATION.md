# Core AI Solutions WebPage Project Orientation

## Project Overview
This is a comprehensive web application for Core AI Solutions that showcases various AI-powered services including text generation, image creation, speech synthesis, and image analysis. The site is built with modern web technologies and follows a component-based architecture.

## Directory Structure

```
Core AI Solutions WebPage/
├── index.html                 # Main entry point
├── package.json               # Project dependencies and scripts
├── tailwind.config.js         # Tailwind CSS configuration
├── assets/                    # Static assets
├── components/                # Reusable UI components
│   ├── header.html            # Navigation header
│   ├── hero.html              # Hero section
│   ├── about.html             # About section
│   ├── services.html          # Services section
│   ├── portfolio.html         # Portfolio section
│   ├── blog.html              # Blog section
│   ├── contact.html           # Contact section
│   └── footer.html            # Footer
├── css/                       # Stylesheets
│   ├── main.css               # Main styles
│   ├── hero-styles.css        # Hero section styles
│   ├── services-styles.css    # Services section styles
│   ├── components.css         # Component styles
│   └── video-background.css   # Video background styles
├── gemini/                    # Gemini API related configurations
│   └── settings.json          # Gemini API settings
├── images/                    # Image assets
├── js/                        # JavaScript files
│   ├── main.js                # Main application logic
│   ├── chat.js                # Chat functionality
│   ├── config.js              # Configuration settings
│   ├── loadComponents.js      # Component loading mechanism
│   ├── navigation.js          # Navigation handling
│   ├── utils.js               # Utility functions
│   └── video-background.js    # Video background functionality
└── pages/                     # Individual service pages
    ├── text-generation.html
    ├── image-generation.html
    ├── text-to-speech.html
    ├── image-analysis.html
    ├── code-assistant.html
    ├── chat-ai.html
    ├── ai-solutions.html
    ├── automation.html
    ├── machine-learning.html
    ├── personalized-chatbot.html
    ├── description-generator.html
    ├── logistics-optimization.html
    ├── blog-ai-healthcare.html
    ├── blog-ai-trends-2025.html
    └── blog-project-x.html
```

## Key Files and Their Purposes

### Main Application Files
- **index.html**: The main landing page that loads all components and initializes the application
- **js/main.js**: Main application logic that handles all user interactions and API calls
- **js/chat.js**: Implements chat functionality
- **js/config.js**: Contains API keys and configuration settings
- **js/loadComponents.js**: Dynamically loads HTML components into the page
- **js/utils.js**: Utility functions used throughout the application

### Components
- **components/header.html**: Navigation bar with site links
- **components/hero.html**: Hero section with main call-to-action
- **components/about.html**: About section describing the company
- **components/services.html**: Services offered by the company
- **components/portfolio.html**: Portfolio showcasing completed projects
- **components/blog.html**: Blog section with articles
- **components/contact.html**: Contact information and form
- **components/footer.html**: Footer with additional links and copyright

### Service Pages
The pages directory contains individual pages for each AI service:
- Text Generation
- Image Generation
- Text-to-Speech
- Image Analysis
- Code Assistant
- Chat AI
- AI Solutions
- Automation
- Machine Learning
- Personalized Chatbot
- Description Generator
- Logistics Optimization
- Blog articles

## API Integration

### Gemini API
The application primarily uses Google's Gemini API for all AI services:
- Text generation and analysis
- Image generation (Imagen 3.0)
- Text-to-Speech (Gemini 2.5 Flash TTS)
- Image analysis (Gemini 2.5 Flash Preview)

### Configuration
- API keys are stored in `js/config.js`
- Gemini settings are configured in `gemini/settings.json`

## Key Features and Functionality

1. **Text Generation**: Create content using Gemini AI
2. **Image Generation**: Generate images from text prompts
3. **Text-to-Speech**: Convert text to speech using Gemini TTS
4. **Image Analysis**: Analyze uploaded images with Gemini Vision
5. **Chat Interface**: Interactive chat with AI assistant
6. **Service Showcase**: Dedicated pages for each AI service

## Development Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev` or `npm start`
4. Access the site at `http://localhost:3000`

## Code Structure Notes

- All JavaScript files are modular and imported as needed
- Components are loaded dynamically to improve performance
- The main.js file contains all event listeners and API interaction logic
- Tailwind CSS is used for styling with custom configurations
- The project follows a component-based architecture for reusability

## Quick Reference

### Common Tasks
- Add new service: Create a new HTML file in `/pages/` and add to navigation
- Modify header: Edit `/components/header.html`
- Update styling: Modify `/css/` files
- Change API behavior: Update logic in `/js/main.js`
- Add new component: Create HTML file in `/components/`

### API Endpoints
All API calls are directed to Gemini services:
- Text Generation: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent`
- Image Generation: `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict`
- TTS: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent`
- Image Analysis: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent`

This orientation guide should help you quickly understand the project structure and find your way around the codebase.
