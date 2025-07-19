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

## Changelog Generation

When completing work sessions, Claude must create a changelog entry following the established format:

### Changelog Requirements

1. **File Location**: Create new markdown files in `/changelogs/` directory
2. **Naming Convention**: Use descriptive kebab-case names (e.g., `disclaimer-and-url-redirects.md`)
3. **Date Format**: Use current date in YYYY-MM-DD format
4. **Daily Organization**: Group related changes by day under a single changelog with comprehensive title
5. **Same-Day Updates**: If a changelog already exists for the current day, modify the existing file by:
   - Updating the title to reflect the major new feature/change
   - Adding new changes to the `changes` array in frontmatter
   - Expanding the content sections to include new implementations
   - Maintaining logical coherence in the overall narrative

### Changelog Template Structure

```markdown
---
title: "[Descriptive Title of Main Feature/Update]"
date: "YYYY-MM-DD"
version: "[Semantic Version]"
author: "unstealable with Claude"
category: "[Category - see guidelines below]"
changes:
  - type: "added"
    description: "[Brief description]"
  - type: "changed" 
    description: "[Brief description]"
  - type: "fixed"
    description: "[Brief description]"
  - type: "removed"
    description: "[Brief description]"
---

# [Same as title]

[1-2 sentence overview of the update and its business impact]

## 🎯 [Main Feature Category]

### [Subcategory]
- **[Feature Name]**: [Description with business value]
- **[Technical Detail]**: [Implementation specifics]

## 🛠️ Technical Implementation Details

### [Component/System Name]
```[language]
// Code examples showing key implementations
```

### [Another System]
- **[Implementation Point]**: [Technical explanation]
- **[Architecture Change]**: [System design details]

## 🎯 Business Impact

1. **[Benefit Category]**: [User/business value]
2. **[Another Benefit]**: [Impact description]

[Concluding paragraph about overall improvement to platform]
```

### Category Guidelines

- **feature**: Major new features or functionality additions
- **improvement**: Enhancements to existing features or performance
- **bugfix**: Bug fixes and error corrections
- **technical**: Backend changes, architecture improvements, or technical debt
- **ui**: User interface updates, design changes, or UX improvements
- **seo**: Search engine optimization and metadata improvements
- **general**: Miscellaneous changes that don't fit other categories

### Change Type Guidelines

- **added**: New features, components, or functionality
- **changed**: Modifications to existing features or improvements  
- **fixed**: Bug fixes and error corrections
- **removed**: Deprecated or deleted functionality

### Date Handling

- **File Creation Date**: Primary sorting is based on file system creation date
- **Frontmatter Date**: Used only as fallback if not in future (prevents accidental future dating)
- **Current Date**: Always use today's date when creating changelog entries

### Content Requirements

- **Technical Depth**: Include code examples, file structures, and implementation details
- **Business Value**: Explain user benefits and business impact
- **Comprehensive Coverage**: Document all significant changes in a single daily changelog
- **Professional Tone**: Maintain consistency with existing changelog style
- **Category Assignment**: Always assign appropriate category for filtering functionality

## Claude Memory Management

- Prends en compte qu'à chaque rendu de résumé de ton code si cela est dans le même jour qu'un .md existant, tu modifie ce dernier avec les nouvelles updates, et tien à jour son titre avec l'élément majeur & une logique cohérente