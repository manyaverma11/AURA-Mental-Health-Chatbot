# AURA: Artificial Intelligence for Understanding and Reflecting Affect

## Project Overview
**AURA** is an AI-driven **Mental Health Chatbot** designed to provide emotional support through text-based conversations. The chatbot uses **sentiment analysis** to assess the user's emotional state and offers personalized feedback. It aims to create a **safe, anonymous** space for individuals to express their feelings, while also helping users track their mental well-being journey over time.

By leveraging **Natural Language Processing (NLP)** and **Sentiment Analysis**, AURA encourages better emotional awareness and offers supportive and empathetic responses based on the user's emotional state.

## Features
- **User Authentication**: Secure login system using **JWT tokens** for session management.
- **Sentiment Analysis**: Real-time analysis of user messages to determine emotions (positive, neutral, or negative).
- **Personalized Feedback**: The chatbot provides emotionally intelligent feedback tailored to the user's mood.
- **Message History**: Store and review previous interactions for tracking emotional trends over time.
- **Real-time Conversations**: Engage with users in meaningful, supportive conversations to help them manage mental well-being.

## Tech Stack
- **Frontend**: 
  - React.js / Next.js for the user interface
  - TailwindCSS for styling
- **Backend**:
  - Express.js for the server and API routes
  - MongoDB for database management (user data, chat logs)
  - JWT for secure user authentication
- **Machine Learning**:
  - Sentiment analysis using **TextBlob** or **HuggingFace Transformers**