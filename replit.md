# Civicavita AB - Global Health & Humanitarian Science

## Overview
A React + TypeScript + Vite application for global health and humanitarian science initiatives. The app includes features for:
- Report generation
- Grant finding and analysis
- Video generation
- Blog generation
- Content hub with trend analysis
- AI-powered chatbot (using Google Gemini API)

## Project Structure
- `/components` - React components for the application
- `/services` - Service modules (Gemini AI, IndexedDB caching)
- `App.tsx` - Main application component with state management
- `types.ts` - TypeScript type definitions
- `constants.ts` - Application constants
- `vite.config.ts` - Vite configuration

## Tech Stack
- React 19
- TypeScript
- Vite 6
- Tailwind CSS (via CDN)
- Google Gemini AI SDK (@google/genai)
- marked (Markdown parsing)
- html-to-docx (Document export)

## Environment Variables
- `GEMINI_API_KEY` - Required for AI features

## Development
Run `npm run dev` to start the development server on port 5000.

## Deployment
- Build: `npm run build`
- Output directory: `dist`
- Deployment type: Static site
