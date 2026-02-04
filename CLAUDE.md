# US Federal Courts Interactive Map

An Observable Framework project for visualizing US federal judicial districts and circuit courts with D3.js.

## Project Goals

Build an interactive map that allows users to:
- Click on federal judicial districts (94 total) to see detailed information
- View circuit court boundaries (13 circuits)
- Explore judge information (who appointed them, when confirmed, senior status)
- See caseload statistics by district
- Track where SCOTUS cases originate (which circuit/district)
- Browse ongoing federal cases, appeals, and decisions

## Project Directory Notes

### `judicial-boundaries/` (Ignored, Not Part of Project)

This directory may exist if cloned locally for contributing pull requests to the upstream data source repository. It is **NOT** part of this project and should be **disregarded** during development.

**Purpose**: The `cbupp/judicial-boundaries` repository contains the GeoJSON boundary data we use. If a data quality issue is found (e.g., typos in circuit names), we clone that repository here temporarily to fix issues upstream via pull requests.

**Status**:
- Gitignored (not tracked in this project's version control)
- Temporary - can be deleted after PRs are submitted
- Located here for convenience only

**Do not**:
- Include it in project builds
- Reference it in code (use `src/data/*.json` instead)
- Commit it to this repository

## Architecture

### Framework: Observable Framework

Chosen to learn Observable Framework and leverage its strengths:
- Native D3.js integration
- Data loaders that run at build time
- Reactive JavaScript in markdown files
- Static site generation
- Built specifically for data visualization projects

### Data Sources (To Be Implemented)

#### 1. GeoJSON Boundaries ✅ Sources Identified
- **cbupp/judicial-boundaries** (GitHub):
  - `us-district-courts.geojson` (94 districts)
  - `us-court-of-appeals.geojson` (13 circuits)
  - MIT licensed, created 2014
  - Based on fedstats.gov data (now defunct) + Wikipedia map references
- **Alternative**: HIFLD (Homeland Infrastructure Foundation-Level Data)
- **Alternative**: US Census TIGER files (requires conversion to GeoJSON)

#### 2. Judge Data
- **Federal Judicial Center (fjc.gov)**: Biographical Directory
- Format: Likely CSV download
- Contains: Judge names, appointing president, confirmation dates, senior status

#### 3. Caseload Statistics
- **FJC Integrated Database (IDB)**: District-level caseload data
- **uscourts.gov**: Statistical tables
- Format: CSV or Excel downloads

#### 4. SCOTUS Case Origins
- **Supreme Court Database (scdb.wustl.edu)**
- Free download, CSV format
- Variables track which circuit/district cases originated from

#### 5. Dynamic Case Data ✅ IMPLEMENTED
- **CourtListener API** (Free Law Project) - https://www.courtlistener.com/
- REST API for opinions, dockets, judges, PACER data
- Free tier: 5,000 queries/hour to authenticated users
- **Authentication**: Token-based (stored in `.env` file)
- **Registration**: https://www.courtlistener.com/register/
- **API Docs**: https://www.courtlistener.com/help/api/rest/
- **Current Usage**: Fetching 20 most recent cases per circuit (260 total)
- **Data Included**: Case names, docket numbers, filing dates, status, URLs
- **Rate Limiting**: ~1 second between requests to be respectful
- **Alternative**: Caselaw Access Project (Harvard) - not currently used

### Project Structure (Current)

```
judicial-map/
  src/
    index.md                         # Landing page with interactive map

    districts/
      index.md                       # District listing page
      alabama-middle.md              # Individual district pages (94 total)
      alabama-northern.md
      ... (91 more)

    circuits/
      index.md                       # Circuit listing page
      first-circuit.md               # Individual circuit pages (12 total)
      second-circuit.md
      ... (10 more)

    data/
      districts.json                 # GeoJSON boundaries (28 MB)
      circuits.json                  # GeoJSON boundaries (10 MB)
      circuit-cases.json.js          # Data loader: fetches cases from CourtListener
      circuits.json.js               # Data loader: transforms circuit data
      districts.json.js              # Data loader: transforms district data

    style.css                        # Custom styles

  scripts/
    generate-circuit-pages-simple.js   # Generates all 12 circuit pages
    generate-district-pages-simple.js  # Generates all 94 district pages

  .env                              # API keys (gitignored, local only)
  .env.example                      # Template for environment variables

  observablehq.config.js            # Framework configuration
  package.json                      # Dependencies and scripts

  judicial-boundaries/              # Temporary (gitignored) - for upstream PRs
```

### Data Loaders (Build-Time Processing)

Observable Framework's data loaders run at build time, not in the browser. They:
- Fetch/read source data files
- Transform and clean data
- Aggregate and compute statistics
- Output JSON for the site to consume

Example loader (`src/data/judges.json.js`):
```javascript
import * as d3 from "d3";

const judges = await d3.csv("../../source/fjc-judges.csv");
const activeJudges = judges.filter(d => d.status === "active");

process.stdout.write(JSON.stringify(activeJudges));
```

### D3 Map Features

- **TopoJSON** format for compressed GeoJSON (faster loading)
- **Zoom/pan** with `d3.zoom()`
- **Click handlers** on district paths to navigate to detail pages
- **Choropleth coloring** based on metrics (caseload, judge count, etc.)
- **Layer toggle** between district view and circuit view
- **Tooltips** on hover showing basic stats
- **Projection**: `d3.geoAlbersUsa()` for proper US map display

### Development Workflow

1. **Setup**: `npm install`
2. **Environment**: Copy `.env.example` to `.env` and add API keys
3. **Generate pages**: Run page generation scripts when data changes
   ```bash
   node scripts/generate-circuit-pages-simple.js
   node scripts/generate-district-pages-simple.js
   ```
4. **Dev server**: `npm run dev` (auto-reloads on changes)
   - Main map at http://localhost:3000
   - Hot reload for markdown/JS changes
   - Data loaders re-run when referenced files change
5. **Build**: `npm run build` (generates static site in `dist/`)
   - Executes data loaders (fetches fresh case data)
   - Processes all markdown files
   - Bundles dependencies
   - Outputs ~109 static HTML pages
6. **Deploy**: `npm run deploy` (Cloudflare Pages)

### Page Generation Scripts

**Why needed?** Observable Framework doesn't have true dynamic routing like Next.js, so we generate static pages for each circuit and district.

**How they work:**
1. Read GeoJSON data to get list of circuits/districts
2. Generate slug from name (e.g., "First Circuit" → "first-circuit")
3. Create markdown file for each with template
4. Template includes: map visualization, case data, metadata

**When to regenerate:**
- When template changes (update display/styling)
- When adding new data fields
- One-time generation (pages are static once created)

**Scripts:**
- `scripts/generate-circuit-pages-simple.js` - Creates 12 circuit pages
- `scripts/generate-district-pages-simple.js` - Creates 94 district pages

### Deployment Strategy

Static site to be deployed to Cloudflare Pages with automated data updates.

**Deployment Options:**
- **courts.abekatz.com** (subdomain) - Recommended
- **abekatz.com/courts** (subdirectory routing)
- **Separate Cloudflare Pages project**

#### Manual Deploy
```bash
npm run build && npx wrangler pages deploy dist
```

#### Automated Data Updates (PLANNED)

**Challenge**: Case data is fetched at build time, so it becomes stale unless rebuilt.

**Solution**: GitHub Actions scheduled workflow

**Setup Plan:**
1. Create `.github/workflows/update-data.yml`
2. Schedule: Daily or weekly at midnight UTC
3. Actions: Install deps → Fetch fresh data → Build → Deploy
4. Store CourtListener API key in GitHub Secrets
5. Configure Cloudflare Pages GitHub integration
6. Add manual trigger option (workflow_dispatch)

**Sample Workflow:**
```yaml
name: Update Case Data
on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly on Sunday
  workflow_dispatch:      # Manual trigger
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run build
        env:
          COURTLISTENER_API_KEY: ${{ secrets.COURTLISTENER_API_KEY }}
      - run: npx wrangler pages deploy dist
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

**Benefits:**
- Automatic fresh data without manual intervention
- Scheduled updates (set frequency as needed)
- Manual trigger available when needed
- Free on GitHub Actions (2,000 minutes/month)
- Timestamp on pages shows data freshness

## Commands

```bash
# Install dependencies
npm install

# Start dev server (hot reload)
npm run dev

# Build static site
npm run build

# Deploy to Cloudflare Pages
npm run deploy

# Clean build artifacts
npm run clean
```

## Session Rules

### Git Workflow (ALWAYS FOLLOW)
**Commit and push work regularly without being prompted:**
1. **After completing a logical unit of work** (feature, fix, refactor), create a commit
2. **After 3-5 commits**, push to GitHub automatically
3. **At the end of each session** or when user says "done" or similar, commit and push any uncommitted work
4. **Use descriptive commit messages** following conventional commit format when appropriate
5. **Include Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>** in all commits

**When to commit:**
- After adding a new feature
- After fixing a bug
- After completing a refactor
- After updating documentation
- Before risky operations (to create a restore point)

**Commit message format:**
```
Brief description in imperative mood

Detailed explanation if needed:
- What changed
- Why it changed
- Any important notes

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

**Never commit:**
- `.env` files (should be gitignored)
- Large binary files without discussion
- `node_modules/` or build artifacts
- Personal credentials or secrets

### General Rules
- You are always allowed to run: `git`, `gh`, `ls`, `cat`, `head`, `tail`, `npm` commands
- **Do NOT attempt to download datasets automatically** - user will handle data retrieval separately
- Focus on framework setup, data loader scaffolding, and D3 visualization code

## Project Status & Completed Work

### ✅ Phase 1: Core Framework & Visualization (COMPLETE)
1. ✅ Observable Framework project structure
2. ✅ CLAUDE.md documentation
3. ✅ Dependencies installed
4. ✅ Starter `index.md` with interactive map
5. ✅ GeoJSON downloaded from cbupp/judicial-boundaries
   - Fixed upstream typo ("Eigth" → "Eighth Circuit") via PR #1
6. ✅ D3 map with district boundaries (94 districts)
7. ✅ Circuit layer toggle (switch between districts/circuits view)
8. ✅ Click interactivity with hover effects
9. ✅ Professional styling and responsive design

### ✅ Phase 2: Detail Pages (COMPLETE)
10. ✅ Created 12 circuit detail pages
    - Individual focused maps for each circuit
    - Template-based generation via scripts
    - Navigation from main map clicks
11. ✅ Created 94 district detail pages
    - Individual focused maps for each district
    - Automated generation from GeoJSON data
    - Full navigation system

### ✅ Phase 3: Live Case Data Integration (COMPLETE)
12. ✅ CourtListener API integration
    - Free API with 5,000 queries/hour limit
    - Authenticated access via token
    - Data loader: `src/data/circuit-cases.json.js`
13. ✅ Circuit court case data - DUAL LISTS
    - **Most Recent Cases**: 20 per circuit (260 total) filed after 2024-01-01
    - **Most Cited Cases**: 20 per circuit (260 total) sorted by citation count
    - Case names, docket numbers, filing dates
    - Links to full opinions on CourtListener
    - Publication status tracking
    - Citation counts for ranking influential cases
14. ✅ Case display on circuit pages
    - Two sections: "Most Recent Cases" and "Most Cited Cases"
    - Formatted case cards with distinct styling (blue for recent, purple for cited)
    - Citation badges on most cited cases
    - Last updated timestamps
    - Clear indication of data freshness
15. ✅ Case snippets (PARTIAL - needs improvement)
    - Added snippet field extraction from CourtListener API
    - Shows first ~500 characters of opinion text
    - **LIMITATION**: Snippets often show court headers/metadata rather than substantive content
    - **TO-DO**: Implement better snippet extraction (see Phase 4 below)

## Current Roadmap

### 🔧 Phase 4: Improve Case Snippets (NEXT UP)
**Priority: High**
**Status**: Paused - ready to test when resumed

**Problem**: Current snippets show court headers and judge names instead of substantive case content.
- Example unwanted: "SELYA, Circuit Judge. In 1983..."
- Example wanted: "Defendant Ramona Flores appeals after her guilty plea conviction for being found illegally in the United States after having been previously deported"

**Option 1 - Fetch Full Text and Extract (TO TEST)**
- Make additional API call per case to fetch `plain_text` or `html_with_citations` field
- Skip header/boilerplate text (judge names, court headers, procedural info)
- Extract first few meaningful sentences that describe what the case is about
- **Trade-offs**:
  - ✅ Will work for all cases with full text
  - ✅ Provides substantive, meaningful content
  - ❌ 260 additional API calls per build (slow, ~4-5 minutes with rate limiting)
  - ❌ May hit CourtListener rate limits (5,000/hour, so should be OK)
  - ❌ Extraction logic needed to skip boilerplate

**Option 2 - Fetch Syllabus/Headnotes (INVESTIGATED)**
- Use CourtListener Cluster endpoint to get `syllabus` or `headnotes` fields
- **Status**: Fields exist but are empty in most search results
- **Conclusion**: Not viable for consistent results

**Option 3 - Accept Current Limitations (FALLBACK)**
- Keep case metadata without snippets
- Users click through to read full opinions
- ✅ Fast, reliable, no extra API calls
- ❌ Less informative browsing experience

**Implementation Plan for Option 1** (when ready to test):
1. Test on small sample (e.g., 5 cases from one circuit)
2. Verify quality of extracted snippets
3. Measure API call overhead and build time impact
4. If quality is good, implement for all cases
5. Add extraction logic to skip common headers:
   - "Circuit Judge"
   - "United States Court of Appeals"
   - Case docket headers
   - Find first sentence describing the case facts/issue

### 🔄 Phase 5: Data Freshness & Automation (PLANNED)
**Priority: High**
- [ ] Set up GitHub Actions for automated data updates
  - Schedule: Daily or weekly rebuilds
  - Fetch fresh cases from CourtListener API
  - Auto-deploy to Cloudflare Pages
  - Manual trigger option via workflow_dispatch
- [ ] Add workflow file: `.github/workflows/update-data.yml`
- [ ] Store CourtListener API key in GitHub Secrets
- [ ] Configure Cloudflare Pages integration

### 📊 Phase 6: Enhanced Case Data (FUTURE)
**Priority: Medium**

**A. Originating District Court Information**
- [ ] Add originating district court for circuit court appeals
  - Show which district court the appeal originated from
  - Creates link between circuit cases and district courts
  - Enables "flow" visualization of cases through court system
  - **Implementation**: Fetch docket details via CourtListener API
  - **API calls**: ~520 additional calls (260 recent + 260 cited cases)
  - **Data available**: CourtListener docket endpoint has `court` field for originating court

**B. SCOTUS Appeal Tracking**
- [ ] Indicate which circuit cases were appealed to Supreme Court
  - Show if case was reviewed by SCOTUS
  - Show SCOTUS outcome (granted, denied, decided)
  - Creates complete judicial pathway visualization
  - **Data sources**:
    - CourtListener: `related_clusters` or citation data
    - Supreme Court Database (SCDB): Cross-reference by case name/year
  - **Implementation**: May require case name matching or citation tracking

**C. Additional Metadata**
- [ ] Add judge/panel information to cases
  - Currently missing from search results
  - May need full opinion/docket details
- [ ] Add Nature of Suit (NOS) codes
  - Topic classification for cases
  - Consider supplementing with academic datasets
  - ~~Dryad topic-modeled dataset~~ (covers 1970-2010, not useful for 2024+ cases)

### 🎨 Phase 7: Enhanced Interactivity (FUTURE)
**Priority: Medium**
- [ ] Add zoom/pan controls to main map
  - Implement `d3.zoom()` behavior
  - Reset button to return to full view
  - Smooth zoom transitions
- [ ] Choropleth coloring by metrics
  - Color circuits by case volume
  - Color districts by caseload
  - Add legend and explanatory text
- [ ] Search functionality
  - Search for districts/circuits by name
  - Filter by state or region
  - Quick navigation

### 📚 Phase 8: Additional Data Sources (FUTURE)
**Priority: Low**
- [ ] Judge biographical data (Federal Judicial Center)
  - Who appointed them, confirmation dates
  - Senior status tracking
  - Display on district/circuit pages
- [ ] Caseload statistics (FJC IDB)
  - District-level statistics
  - Cases filed, pending, resolved
  - Historical trends
- [ ] SCOTUS case origins (Supreme Court Database)
  - Track which circuits/districts feed to SCOTUS
  - Visualize appeal pathways

### 🚀 Phase 9: Deployment (FUTURE)
**Priority: High (when ready to launch)**
- [ ] Set up Cloudflare Pages project
- [ ] Configure custom domain (courts.abekatz.com or abekatz.com/courts)
- [ ] Set up automated deployments from GitHub
- [ ] Configure environment variables for API keys
- [ ] Set up monitoring/analytics (optional)

## Technical Notes & Lessons Learned

### Data Quality
- **Upstream typo fixed**: Found "Eigth Circuit" typo in cbupp/judicial-boundaries
- **Contributed fix**: Submitted PR #1 to fix typo for the community
- **Local fix applied**: Updated our local data files with correct spelling

### Observable Framework Specifics
- **FileAttachment references**: Data loaders (`.json.js`) output `.json` files
  - Reference as: `FileAttachment("data/file.json")` not `file.json.js`
- **HTML rendering**: Use `html` template tag from htl to render HTML
  - Regular template literals are escaped by default for security
- **Build-time data**: Data loaders run during build, not in browser
  - Fresh data requires rebuilding the site
  - Timestamps track data freshness

### API Integration
- **CourtListener authentication**: Token-based, stored in `.env`
- **Rate limiting**: Respectful 1-second delays between requests
- **Search results**: Basic case info, full details require docket API
- **Missing fields**: Judge/panel names often empty in search results
- **Originating district**: Requires additional docket API call per case
- **Snippet extraction**:
  - Snippet field is nested: `result.opinions[0].snippet` (not `result.snippet`)
  - Requires search query parameter `q=*` or `q=term` to populate
  - Limited to ~500 characters
  - Often shows court headers instead of substantive content
  - `syllabus`/`headnotes`/`summary` fields exist but are empty in most results
  - Better snippets require fetching full opinion text via Opinion or Cluster endpoints

### Performance
- **GeoJSON sizes**: Districts (28 MB), Circuits (10 MB)
- **Build time**: ~15 seconds with 260 API calls for case data
- **Page count**: 109 static pages (1 home + 2 indexes + 106 detail pages)
- **Future optimization**: Consider TopoJSON for smaller file sizes

## Research Notes

Two background research agents explored data sources and technical approaches:
- Found cbupp/judicial-boundaries repo with ready-to-use GeoJSON
- Confirmed Observable Framework is well-suited for this project
- Identified all major data sources (FJC, SCDB, CourtListener, etc.)
- Research transcripts saved but too large to parse completely
- Key searches covered: judicial districts GeoJSON, D3 mapping techniques, data APIs, framework comparisons

## Observable Framework Learning Resources

- Official docs: https://observablehq.com/framework/
- Getting started: https://observablehq.com/framework/getting-started
- Example projects: https://observablehq.com/framework/examples
- Data loaders: https://observablehq.com/framework/loaders
- GitHub: https://github.com/observablehq/framework
