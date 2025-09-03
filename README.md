# ✨ Soamnia - Dream Interpretation & Micro-Goals App

Transform your dreams into actionable real-world goals with AI-powered interpretation.

## 🌟 Features

- **Dream Input**: Type or use voice-to-text to record your dreams
- **AI Interpretation**: Get insights into themes, emotions, and symbols
- **Micro-Goals**: Receive 3 actionable steps inspired by your dream
- **Dream Journal**: Save and revisit your dreams and interpretations
- **Mobile-First**: Responsive design optimized for all devices
- **Voice Recording**: Built-in speech recognition for quick dream capture

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- OpenAI API key

### Installation

1. **Clone and setup**
   ```bash
   git clone <your-repo>
   cd soamnia
   npm install
   cd client && npm install && cd ..
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   Add your OpenAI API key to `.env`:
   ```
   OPENAI_API_KEY=your_api_key_here
   PORT=5000
   ```

3. **Run the app**
   ```bash
   npm run dev
   ```
   
   This starts both the server (port 5000) and client (port 3000).

## 🎯 How It Works

1. **Record Your Dream**: Type or speak your dream into the app
2. **AI Analysis**: The app analyzes themes, emotions, and symbols
3. **Get Micro-Goals**: Receive 3 actionable steps for your daily life
4. **Save & Track**: Build your personal dream journal over time

## 🛠 Tech Stack

- **Frontend**: React, CSS3 with modern gradients and animations
- **Backend**: Node.js, Express
- **AI**: OpenAI GPT-3.5-turbo for dream interpretation
- **Voice**: Web Speech API for voice input
- **Storage**: Local storage (expandable to database)

## 📱 Demo Examples

**Dream**: "I was flying over mountains with friends"
- **Themes**: Freedom, Adventure, Friendship
- **Micro-Goals**: 
  1. Plan a weekend trip with friends
  2. Try a new outdoor activity this week
  3. Reach out to a friend you haven't spoken to recently

## 🎨 UI/UX Features

- Dreamy gradient backgrounds
- Smooth animations and transitions
- Mobile-responsive design
- Intuitive voice recording
- Clean, modern interface
- Accessibility-friendly

## 🔧 Development

```bash
# Run server only
npm run server

# Run client only
npm run client

# Build for production
npm run build

# Start production server
npm start
```

## 📦 Deployment

The app is ready for deployment on platforms like:
- Heroku
- Vercel
- Netlify
- Railway

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - feel free to use this project for your hackathons and personal projects!

---

**Built for dreamers who want to turn their subconscious insights into conscious action.** ✨