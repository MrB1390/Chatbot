# VoiceBot Simba

A React-based voice bot application that uses speech recognition to convert speech to text, integrates with OpenAI for natural language processing, and uses HeyGen avatars to provide a dynamic video response.

## Project Overview

This project implements a voice bot named **"Simba"** using:
- **React** and **Tailwind CSS** for the frontend.
- **React Speech Recognition** for speech-to-text functionality.
- **AWS Polly** for text-to-speech conversion.
- **HeyGen** for generating avatar videos.
- **OpenAI API** for generating responses to user queries.

## Installation and Setup

### 1. Install Dependencies

To set up the project, ensure you have Node.js installed. Then, clone the repository and run the following command to install the necessary dependencies:

```bash
npm install
```
## 2. Install and Configure Tailwind CSS

Tailwind CSS is used for styling the application. To configure Tailwind CSS, follow these steps:

### Install Tailwind CSS via npm:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```
## Interacting with the VoiceBot

1. **Click the microphone button** to start/stop listening.
2. **Speak into your microphone**; the speech will be transcribed in real-time.
3. **Click "Send Message"** to send the transcribed text to the backend.
4. The bot responds with an **avatar video** or **text message**.

## Error Handling

The application manages various errors effectively:

- **HTTP 400, 404, 429 Errors:** Displays specific messages to the user based on the type of error.
- **Speech Recognition Support Check:** Notifies the user if their browser does not support speech recognition.

## Future Improvements

- **Enhance error handling** to cover more edge cases.
- **Add more dynamic avatars** and **voice options**.
- **Improve speech recognition accuracy** and handling of diverse user accents.

## Conclusion

This project demonstrates how to combine modern front-end technologies like **React** and **Tailwind CSS** with powerful APIs from **HeyGen**, **AWS**, and **OpenAI** to create a fully functional, interactive voice bot application.
