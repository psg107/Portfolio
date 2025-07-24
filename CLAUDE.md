# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Korean portfolio website for 박상곤 (Park Sang-gon), showcasing backend development experience across different technology stacks. The project is a static HTML/CSS/JavaScript website that can be served locally and generated as a PDF.

**Live Site**: https://psg107.github.io/Portfolio/

## Development Commands

### Local Development
```bash
# Serve the project locally (use any static server)
# Example with Python:
python -m http.server 5500
# Or with Node.js http-server:
npx http-server -p 5500
```

### PDF Generation
```bash
# Generate portfolio.pdf from the website
node generate-pdf.js
```
Note: The PDF generation expects the site to be running on `http://127.0.0.1:5500/`

### Dependencies
```bash
# Install PDF generation dependencies
npm install
```

## Architecture

### File Structure
- `index.html` - Main portfolio page with Korean content
- `styles.css` - Main stylesheet
- `js/` - Modular JavaScript components
  - `main.js` - Entry point and initialization
  - `projects.js` - Project data management
  - `tabs.js` - Tab switching functionality
  - `modal.js` - Image modal gallery
  - `gridController.js` - Layout grid controls
  - `mermaid.js` - Architecture diagram rendering
  - `scrollOptimization.js` - Performance optimizations
- `css/` - Component-specific styles
- `projects.json` & `projects2.json` - Project data in JSON format
- `generate-pdf.js` - Puppeteer-based PDF generation script

### Key Features
- **Responsive Design**: Mobile-first approach with grid layout controls (1-3 columns)
- **Project Filtering**: Tab-based filtering by service categories (전체, 신패키지시스템, 구패키지시스템, CRM/CMS, 개인프로젝트)
- **Interactive Architecture Diagrams**: Mermaid.js diagrams showing system architectures
- **Image Gallery**: Modal-based project image viewer
- **PDF Export**: Automated PDF generation for offline viewing
- **Performance Optimized**: Lazy loading, scroll optimization, and caching

### JavaScript Architecture
The project uses ES6 modules with a clean separation of concerns:
- State management through `projectState.js`
- Event-driven tab switching
- Modular component initialization
- Performance-optimized scroll handling

### Content Structure
The portfolio showcases:
- Personal introduction and tech stack
- Career timeline (2018-present)
- Project portfolio with detailed descriptions
- System architecture diagrams (Mermaid.js)
- Contact information

## Development Notes

### Project Data
Projects are stored in JSON files (`projects.json`, `projects2.json`) with structured data including:
- Project metadata (name, status, description)
- Technical challenges and solutions
- Technology stacks
- Implementation details
- Image galleries

### PDF Mode
The site includes a special PDF mode activated by `window.changeToPdfMode()` that optimizes the layout for PDF generation.

### Dependencies
- **Puppeteer**: PDF generation
- **Mermaid.js**: Architecture diagrams
- **Swiper.js**: Image carousels
- **PanZoom**: Image zoom functionality

### Styling Approach
- CSS Grid and Flexbox for layouts
- CSS custom properties for theming
- Component-based CSS organization
- Responsive breakpoints for mobile/tablet/desktop