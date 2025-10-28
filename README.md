# GAI - Frontend Multilingual Chat Application

A real-time chat application frontend that enables seamless communication between Nigerian languages (English, Yoruba, Igbo, Hausa, and Pidgin) with advanced speech recognition and translation capabilities.

## Features

### 🎤 Speech Recognition & Voice Input
- **Real-time Speech Recognition**: Supports English, Yoruba, Igbo, Hausa, and Nigerian Pidgin using Web Speech API
- **Animated Microphone Interface**: Visual feedback with waveform visualization and ripple effects
- **Voice Activity Detection**: Automatic start/stop based on speech detection
- **Confidence Scoring**: Real-time confidence levels for recognized speech

### 💬 Chat Interface
- **Real-time Messaging**: WebSocket-based instant communication
- **Message History**: Persistent chat storage using localStorage
- **Translation Toggle**: Show/hide translations as needed
- **Voice Synthesis**: Text-to-speech for translated messages

### 🎨 User Experience
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Real-time Captions**: Live captioning with wavy graphics
- **Language Settings**: Customizable source and target languages
- **Error Handling**: Comprehensive error recovery and user guidance

### 🔄 Translation Pipeline
- **Multi-language Support**: Translation between 5 Nigerian languages
- **Real-time Translation**: Instant translation as you speak or type
- **Language Detection**: Automatic language identification
- **Context-aware Translation**: Maintains conversation context

## Frontend Architecture

### Technology Stack
- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Vite**: Fast development and building

### Key Components

#### VoiceInput Component
- Animated microphone button with visual feedback
- Real-time waveform visualization
- Speech recognition integration
- Error handling and retry logic

#### RealTimeCaption Component
- Live caption display with wavy graphics
- Language indicators and confidence scores
- Smooth animations and transitions
- Timestamp display

#### ChatMessage Component
- Message display with translation support
- Voice synthesis integration
- Copy and speak functionality
- User avatar and metadata

#### LanguageSettings Component
- Comprehensive language preference UI
- Voice and display settings
- Settings persistence
- Real-time configuration updates

### Custom Hooks

#### useSpeechRecognition
- Web Speech API integration
- Nigerian language support
- Error handling and recovery
- Real-time transcript processing

#### useWebSocket
- WebSocket connection management
- Automatic reconnection logic
- Message queuing and handling
- Performance monitoring

#### usePerformanceOptimization
- FPS monitoring and optimization
- Memory usage tracking
- Network latency measurement
- Debouncing and throttling utilities

## Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern web browser (Chrome, Firefox, Safari)

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd GAI
```

2. **Install frontend dependencies**
```bash
cd frontend
npm install
```

3. **Start the development server**
```bash
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:5173

## Usage

### Basic Chat
1. Open the application in your browser
2. Allow microphone access when prompted
3. Select your preferred source and target languages
4. Click the microphone button or type to send messages
5. Messages are processed for translation

### Voice Input
1. Click the microphone button to start speaking
2. See real-time captions as you speak
3. Release the button or stop speaking to process the message
4. View the translated response

### Settings
1. Click the Language Settings button
2. Configure your source and target languages
3. Enable/disable voice output and captions
4. Settings are automatically saved locally

## API Integration

The frontend is designed to connect to a backend WebSocket server for:
- Real-time messaging
- Speech processing
- Translation services
- User settings management

### WebSocket Events

#### Client to Server
- `join_room`: Join a chat room
- `leave_room`: Leave a chat room
- `chat_message`: Send a message
- `speech_to_text`: Convert speech to text
- `translate_text`: Translate text
- `update_settings`: Update user settings

#### Server to Client
- `connection`: Connection established
- `room_joined`: Successfully joined room
- `chat_message`: Received message
- `speech_recognition_result`: Speech recognition result
- `translation_result`: Translation result
- `settings_updated`: Settings confirmation

## Supported Languages

| Language | Code | Speech Recognition | Translation |
|-----------|-------|-------------------|-------------|
| English | en | Full Support | Full Support |
| Yoruba | yo | Full Support | Full Support |
| Igbo | ig | Full Support | Full Support |
| Hausa | ha | Full Support | Full Support |
| Nigerian Pidgin | pcm | Full Support | Full Support |

## Performance Features

### Frontend Optimizations
- **Debouncing**: Prevent excessive API calls
- **Throttling**: Limit animation frame updates
- **Memory Management**: Automatic cleanup and garbage collection
- **Lazy Loading**: Components loaded on demand
- **Error Boundaries**: Prevent crashes and provide recovery

### Monitoring
- FPS monitoring for smooth animations
- Memory usage tracking
- Network latency measurement
- Automatic performance optimization

## Error Handling

### Speech Recognition Errors
- **Permission Denied**: Guides user to enable microphone
- **Network Issues**: Automatic retry with exponential backoff
- **Service Unavailable**: Fallback to text input
- **Hardware Issues**: Microphone troubleshooting guidance

### Connection Errors
- **WebSocket Failures**: Automatic reconnection
- **Network Timeouts**: Graceful degradation
- **Server Errors**: User-friendly error messages
- **Recovery Logic**: Automatic state restoration

## Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── VoiceInput.tsx
│   │   ├── RealTimeCaption.tsx
│   │   ├── ChatMessage.tsx
│   │   ├── LanguageSettings.tsx
│   │   └── ErrorBoundary.tsx
│   ├── hooks/              # Custom hooks
│   │   ├── useSpeechRecognition.ts
│   │   ├── useWebSocket.ts
│   │   └── usePerformanceOptimization.ts
│   ├── lib/               # Utilities
│   │   └── utils.ts
│   └── pages/             # Page components
│       ├── Chat.tsx
│       ├── Index.tsx
│       └── NotFound.tsx
├── public/                # Static assets
├── package.json
└── vite.config.ts
```

## Browser Compatibility

### Supported Browsers
- **Chrome**: 25+ (Full support)
- **Firefox**: 44+ (Full support)
- **Safari**: 14.1+ (Full support)
- **Edge**: 79+ (Full support)

### Required Features
- Web Speech API
- WebSocket support
- ES6+ JavaScript support
- CSS Grid and Flexbox

## Development

### Adding New Languages
1. Update language mappings in `src/lib/utils.ts`
2. Add language codes to speech recognition
3. Update UI components for new language
4. Test with sample translations

### Performance Monitoring
- Use React DevTools for component profiling
- Monitor browser console for performance warnings
- Check network tab for WebSocket activity
- Use Performance tab for runtime analysis

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For frontend issues and questions:
- Create an issue on GitHub
- Check browser compatibility
- Review the component documentation

---

**GAI Frontend** - Breaking language barriers with AI-powered communication