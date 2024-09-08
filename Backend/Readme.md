# Express TypeScript Backend for VoiceBot

This backend service is built with TypeScript, Express, OpenAI, AWS Polly, and S3. It processes user speech input, generates a response using the OpenAI API, synthesizes the response into speech using AWS Polly, and stores the audio on AWS S3 for retrieval.

## Project Overview

This project provides an API endpoint that:

1. Accepts user input.
2. Uses the OpenAI API to generate a text response.
3. Converts the generated text response into speech using AWS Polly.
4. Uploads the synthesized speech to AWS S3 and returns the audio file URL to the client.

## Getting Started

### 1. Prerequisites

- **Node.js and npm**: Make sure Node.js (v14 or later) and npm are installed.
- **AWS Account**: Required for AWS Polly and S3 services.
- **OpenAI API Key**: Required for integration with the OpenAI API.
- **YouTube Reference**: Followed [this tutorial](https://www.youtube.com/watch?v=qy8PxD3alWw) to set up TypeScript with Express.

### 2. Installation

Clone the repository and navigate to the project directory.

```bash
git clone <repository-url>
cd <project-directory>
```
### 3.API Endpoints

- **POST `/api/chat`**: Accepts a message from the client, generates a response using OpenAI, synthesizes it using AWS Polly, and returns the URL of the synthesized speech stored in S3.

- **GET `/`**: A simple health check endpoint to verify that the server is running.

## Key Implementations

### TypeScript Integration

The backend is built using TypeScript, which offers strong typing and improved development experience over traditional JavaScript:

- **Type Safety**: Ensures all variables, functions, and parameters are typed, minimizing runtime errors.
- **TypeScript Compiler**: The code is transpiled from TypeScript to JavaScript using the TypeScript compiler (`tsc`), which checks for type correctness.

### OpenAI Integration

OpenAI API is used to generate text responses:

- The API call uses streaming to process responses concurrently, providing a more interactive and real-time experience.

### AWS Polly Integration

AWS Polly is used to synthesize text responses into speech:

- Converts the generated text from OpenAI into an MP3 audio stream.

### AWS S3 Integration

AWS S3 is used to store the generated audio files:

- After generating the audio, it's uploaded to S3 using unique filenames.
- The audio files are made publicly accessible to allow clients to fetch and play them.

### Error Handling

Error handling is implemented to manage common HTTP statuses:

- **401 Unauthorized**: Handles cases where the user is not authorized.
- **404 Not Found**: Handles cases where the resource is not found.
- **429 Too Many Requests**: Handles rate-limiting scenarios.

## Future Improvements

- Enhance error handling for more granular control over different error types.
- Implement more advanced NLP models or fine-tune existing ones for better response quality.
- Add more customization options for AWS Polly voices.

## References

- [YouTube Tutorial on setting up TypeScript with Express](https://www.youtube.com/watch?v=qy8PxD3alWw).

## Conclusion

This project provides a solid foundation for building voice-interactive applications using TypeScript, Express, AWS, and OpenAI, leveraging a variety of cloud services to enhance user experience and provide dynamic, real-time responses.
