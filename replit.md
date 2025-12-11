# Civicavita AB - Global Health & Humanitarian Science

## Overview
A React + TypeScript + Vite application for global health and humanitarian science initiatives. The app includes features for:
- Report generation
- Grant finding and analysis
- Video generation
- Blog generation
- Content hub with trend analysis
- AI-powered chatbot (using Google Gemini API)
- **AI Dashboard** - Admin panel for managing multiple AI providers with fallback support

## Project Structure
- `/components` - React components for the application
- `/services` - Service modules (Gemini AI, IndexedDB caching)
- `/server` - Backend Express server for AI provider management
- `/shared` - Shared schema definitions (Drizzle ORM)
- `App.tsx` - Main application component with state management
- `types.ts` - TypeScript type definitions
- `constants.ts` - Application constants
- `vite.config.ts` - Vite configuration

## Tech Stack
- React 19
- TypeScript
- Vite 6
- Express.js (backend)
- Drizzle ORM with PostgreSQL
- Tailwind CSS (via CDN)
- Google Gemini AI SDK (@google/genai)
- OpenAI SDK
- marked (Markdown parsing)
- html-to-docx (Document export)

## AI Fallback System
The application includes a multi-provider AI fallback system that automatically switches between providers when one fails:

1. **Google Gemini** (Primary) - `gemini-2.5-flash-preview-05-20`
2. **OpenRouter** - `google/gemini-2.0-flash-001`
3. **Cloudflare Workers AI** - `@cf/meta/llama-3.2-3b-instruct`
4. **OpenAI** - `gpt-4o-mini`

### AI Dashboard Features
Access via Dashboard > AI Dashboard:
- **Provider Management** - Enable/disable providers, reorder priority
- **Usage Stats** - View requests, tokens, and errors per provider
- **Debug Console** - Real-time logs with filtering
- **Test Functions** - Test AI providers directly

## Environment Variables
- `GEMINI_API_KEY` - Required for Gemini AI features
- `OPENROUTER_API_KEY` - Optional, for OpenRouter fallback
- `CLOUDFLARE_ACCOUNT_ID` - Optional, for Cloudflare AI fallback
- `CLOUDFLARE_API_TOKEN` - Optional, for Cloudflare AI fallback
- `OPENAI_API_KEY` - Optional, for OpenAI fallback
- `DATABASE_URL` - PostgreSQL connection string

## Development
- Frontend: `npm run dev` - Starts Vite dev server on port 5000
- Backend: `npm run server` - Starts Express server on port 3001
- Both: Frontend and Backend workflows run simultaneously

## Database
- Run `npm run db:push` to sync the database schema
- Tables: `grants`, `post_images`, `project_images`, `ai_providers`, `ai_usage`, `ai_logs`

## Deployment
- Build: `npm run build`
- Output directory: `dist`
- Deployment type: Static site (frontend) + Node.js (backend)
