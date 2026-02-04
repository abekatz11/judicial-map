# US Federal Courts Interactive Map

Interactive visualization of US federal judicial districts and circuit courts built with Observable Framework and D3.js.

## Quick Start

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## Commands

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build static site to `dist/`
- `npm run deploy` - Build and deploy to Cloudflare Pages
- `npm run clean` - Remove build artifacts

## Project Documentation

See [CLAUDE.md](./CLAUDE.md) for complete architecture, data sources, and development workflow.

## Features (Planned)

- Interactive map of 94 federal judicial districts
- Circuit court boundaries (13 circuits)
- Click districts to view detailed information
- Judge biographical data (appointing president, confirmation dates)
- Caseload statistics by district
- SCOTUS case origins tracking
- Federal case listings and status

## Tech Stack

- **Observable Framework** - Static site generator for data apps
- **D3.js** - Data visualization and mapping
- **GeoJSON** - Geographic boundary data
- **Cloudflare Pages** - Deployment

## Data Sources

- **Boundaries**: cbupp/judicial-boundaries (GitHub)
- **Judges**: Federal Judicial Center
- **Caseload**: FJC Integrated Database
- **SCOTUS**: Supreme Court Database
- **Cases**: CourtListener API (Free Law Project)
