# Crop Disease & Pest Scout

A complete, mobile-friendly, multilingual website for small farmers to detect crop problems early using AI-powered diagnosis, expert consultation, and comprehensive crop knowledge.

## 🌾 Overview

Crop Disease & Pest Scout is an agricultural diagnostic platform designed to help small farmers identify and manage crop diseases and pests early. The platform combines AI-powered image analysis with expert knowledge to provide reliable, safe, and actionable recommendations based on FAO/ICAR guidelines.

## ✨ Features

- **📸 AI-Powered Diagnosis**: Upload leaf photos for instant disease/pest identification
- **📚 Comprehensive Crop Library**: Detailed information on diseases and pests for various crops
- **🧠 AI Chat Assistant**: Conversational AI for farming questions and advice
- **📊 Farmer Dashboard**: Track diagnoses history and crop health metrics
- **🏢 Expert Network**: Connect with verified agricultural extension officers
- **🌐 Multilingual Support**: Available in multiple languages for global accessibility
- **📰 Alerts & Updates**: Real-time pest outbreak alerts and weather-based disease predictions
- **📱 Mobile-First Design**: Optimized for farmers using smartphones in the field
- **🌍 Offline Capability**: Core features available without internet connection

## 🛠️ Tech Stack

### Frontend
- **React** with TypeScript
- **Vite** for fast builds and development
- **TailwindCSS** for responsive styling
- **wouter** for routing
- **Radix UI** and **shadcn/ui** for accessible components
- **@tanstack/react-query** for data fetching

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **OpenAI API** for AI capabilities
- **Google Generative AI** for additional AI features
- **Firebase** for authentication and storage
- **Drizzle ORM** with PostgreSQL/Neon database
- **Multer** for file uploads

### AI & ML
- **RAG (Retrieval-Augmented Generation)** for document-based Q&A
- **Vector embeddings** for semantic search
- **Multi-document ingestion** for knowledge base

## 🏗️ Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   └── pages/          # Page components
├── server/                 # Backend Express application
│   ├── lib/                # Backend utilities
│   ├── pages/api/          # API routes
│   ├── scripts/            # Build/deployment scripts
│   └── utils/              # Utility functions
├── shared/                 # Shared types and schemas
├── data/                   # Sample data and vector stores
└── attached_assets/        # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm package manager
- PostgreSQL database (or Neon for cloud)
- OpenAI API key (for AI features)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd CropDiseasePest
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=your_database_url
FIREBASE_CONFIG=your_firebase_config
```

5. Start the development server:
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

## 📋 API Endpoints

### Crops
- `GET /api/crops` - Get all crops
- `GET /api/crops/:id` - Get specific crop

### Diagnoses
- `GET /api/diagnoses` - Get diagnoses (with optional userId filter)
- `POST /api/diagnoses` - Create new diagnosis

### Diseases
- `GET /api/diseases` - Get all diseases
- `GET /api/diseases/:id` - Get specific disease
- `GET /api/diseases?cropId=:id` - Get diseases for specific crop

### Experts
- `GET /api/experts` - Get all experts
- `GET /api/experts?district=:district&specialization=:specialization` - Filter experts

### Chat
- `GET /api/chat/:userId` - Get chat history
- `POST /api/chat` - Send message and get response

### RAG (Retrieval-Augmented Generation)
- `POST /api/rag/ingest` - Ingest documents
- `POST /api/rag/qa` - Ask questions about ingested documents
- `GET /api/rag/health` - Health check

### File Upload
- `POST /api/upload` - Upload and extract content from PDF, DOCX, or TXT files

### Weather
- `GET /api/weather?location=:location` - Get weather data for location

## 🎨 UI Components

The application uses a comprehensive component library based on shadcn/ui and Radix UI primitives:

- Navigation and layout components
- Form elements with validation
- Data display components (tables, cards, charts)
- Feedback components (toasts, alerts, dialogs)
- Interactive elements (accordions, tabs, dropdowns)

## 🌐 Multilingual Support

The application includes a language context system supporting multiple languages with the ability to add new languages easily. The UI is designed to be RTL-compatible for languages like Arabic.

## 📱 Mobile-First Design

Built with mobile farmers in mind:
- Touch-optimized interfaces with large tap targets
- Responsive layouts that work on all screen sizes
- Offline-first approach for areas with limited connectivity
- Camera integration for easy photo capture

## 🔐 Authentication & Authorization

- Firebase authentication integration
- User role management (farmer, expert, admin)
- Secure API endpoints with proper validation

## 🤖 AI Features

### Image Analysis
- AI-powered crop disease identification from photos
- Confidence scoring for predictions
- Risk level assessment
- Actionable recommendations based on FAO/ICAR guidelines

### Conversational AI
- Context-aware chat assistant
- Memory persistence for ongoing conversations
- Document-based Q&A using RAG

## 📊 Data Management

- Drizzle ORM for database operations
- PostgreSQL/Neon database for structured data
- Vector database for document embeddings
- File storage for uploaded images and documents

## 🧪 Testing

The project includes various test files for different components:
- RAG flow tests
- Server environment tests
- Vector store tests

## 🚢 Deployment

The application is configured for deployment with:
- Production build scripts
- Environment variable management
- Database migration support
- Health check endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support, please contact the development team or open an issue in the repository.

---

Crop Disease & Pest Scout - Empowering farmers with AI-powered crop diagnostics