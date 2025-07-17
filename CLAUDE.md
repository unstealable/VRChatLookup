# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality checks

## Project Architecture

This is a Next.js 15 application using the App Router that serves as a VRChat lookup tool. The application allows users to search for VRChat users, worlds, and groups by name or ID.

### Core Structure

- **Frontend**: Next.js 15 with React 19, TypeScript, and Tailwind CSS
- **API Layer**: Next.js API routes that proxy requests to VRChat Bridge API
- **External API**: Uses VRChat Bridge API at `https://vrchat-bridge.unstealable.cloud`
- **Internationalization**: Custom context-based i18n with French and English support

### Key Components

- **SearchForm**: Main search interface with type and method selection
- **Result Components**: ProfileCard, WorldCard, GroupCard for displaying search results
- **ResultSelector**: Handles multiple search results selection
- **LanguageContext**: Manages language switching and translations

### Data Flow

1. User submits search via SearchForm
2. Frontend calls `/api/search` with query parameters
3. API route proxies to VRChat Bridge API with appropriate endpoint
4. Response is normalized and returned to frontend
5. Results are displayed or user is redirected to individual pages

### API Endpoints

- `/api/search` - Main search endpoint supporting users, worlds, and groups
- `/api/user/[id]` - Individual user lookup
- `/api/world/[id]` - Individual world lookup  
- `/api/group/[id]` - Individual group lookup

### Search Behavior

- **ID Format Detection**: Automatically detects VRChat ID format (usr_, wrld_, grp_)
- **Smart Routing**: Single results redirect directly to detail pages
- **Multiple Results**: Shows ResultSelector for user choice
- **Method Support**: Groups only support ID search, users/worlds support both name and ID

### TypeScript Types

All VRChat data structures are defined in `src/types/vrchat.ts` including:
- VRChatUser, VRChatWorld, VRChatGroup
- SearchResponse, ApiError
- SearchType, SearchMethod enums

### Styling

- Tailwind CSS 4 for styling
- Responsive design with mobile-first approach
- Dark mode support via CSS variables
- Custom animations and transitions

### State Management

- React hooks for local state
- LanguageContext for global language state
- No external state management library used