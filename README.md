# MindSpace AI - Gen Z Mental Health Support

A modern AI-powered therapy platform designed specifically for Gen Z, providing 24/7 mental health support through empathetic conversations.

## Features

- **Empathetic AI**: Trained to understand Gen Z communication styles and challenges
- **24/7 Availability**: Instant support whenever you need it
- **Private & Secure**: End-to-end encrypted conversations
- **Evidence-Based**: Built on proven therapeutic techniques (CBT, DBT, mindfulness)
- **Gen Z Focused**: Understands social media pressure, climate anxiety, and financial stress

## Tech Stack

This project is built with:

- **Frontend**: React + TypeScript + Vite
- **UI Components**: shadcn-ui
- **Styling**: Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: SQLite
- **AI**: Groq API integration

## Getting Started

### Prerequisites

- Node.js (v18 or higher) - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- npm or yarn

### Installation

1. Clone the repository:
```sh
git clone <YOUR_GIT_URL>
cd chill-sessions-bot-main
```

2. Install dependencies:
```sh
npm install
```

3. Set up environment variables:
```sh
cp backend/env.example backend/.env
# Edit backend/.env with your configuration
```

4. Start the development server:
```sh
npm run dev
```

The application will be available at `http://localhost:8080`

## Project Structure

```
├── backend/          # Backend API server
│   ├── src/
│   │   ├── routes/   # API routes
│   │   ├── services/ # Business logic
│   │   └── database/ # Database setup
│   └── data/         # SQLite database
├── src/              # Frontend React application
│   ├── components/   # React components
│   ├── pages/        # Page components
│   ├── services/     # API client
│   └── contexts/     # React contexts
└── public/           # Static assets
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Deployment

**Important:** GitHub stores your code but doesn't host/run your app. To make it accessible to users, you need to deploy it to a hosting platform.

### Quick Deploy Options:

1. **Vercel** (Recommended - Easiest)
   ```bash
   npm install -g vercel
   vercel login
   vercel  # Deploy frontend
   cd backend && vercel  # Deploy backend
   ```

2. **Render** - Connect GitHub repo, auto-deploys
3. **Railway** - One-click deployment from GitHub

📖 **See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions**

### Build for Production:

```sh
npm run build
```

The built files will be in the `dist/` directory, ready to be deployed to your hosting provider.

## License

This project is private and proprietary.
