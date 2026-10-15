# StockPulse — Minimalist Market Dashboard

StockPulse is a calm, data-first stock and cryptocurrency dashboard tailored for retail investors and students. It highlights **rising prices first**, maintains strict typographic hierarchy with Inter and JetBrains Mono, and is built on a token-driven design system.

> **Disclaimer:** Demo project with simulated mock data. Not financial advice.

---

## Tech Stack

- **Framework**: React 19 + TypeScript (via Vite)
- **Routing**: React Router (`react-router-dom` v7)
- **Styling**: Tailwind CSS with custom CSS variable design tokens
- **Icons**: Lucide React
- **Fonts**: `@fontsource/inter` (UI) and `@fontsource/jetbrains-mono` (metrics, tickers, and prices)
- **Charts**: Recharts (installed, ready for Stage 2)

---

## Design System Tokens

The application defaults to Dark Mode with a flicker-free toggle to Light Mode. All colors are defined in `src/styles/tokens.css` and mapped through `tailwind.config.js`:

| Token | Dark Mode (Default) | Light Mode | Description |
| :--- | :--- | :--- | :--- |
| `--bg-primary` | `#0B0D10` | `#F8FAFC` | Main canvas background |
| `--bg-surface` | `#12151A` | `#FFFFFF` | Cards & container surfaces |
| `--border-color` | `#1E232B` | `#E2E8F0` | Subtle hairline borders |
| `--text-primary` | `#E6E8EB` | `#0F172A` | High-contrast body text |
| `--text-muted` | `#8A919E` | `#64748B` | Secondary details & labels |
| `--color-profit` | `#22C55E` | `#16A34A` | Rising assets & gains |
| `--color-loss` | `#EF4444` | `#DC2626` | Falling assets & losses |
| `--color-accent-gold` | `#F5C542` | `#D97706` | Expert Picks border glow & badge |

### Layout & Geometry
- **Cards**: `12px` border radius (`rounded-card`)
- **Buttons / Inputs**: `8px` border radius (`rounded-btn`)
- **Grid & Max Width**: 8px baseline grid, `1200px` maximum page constraint (`max-w-page`)
- **Transitions**: 150ms–200ms ease animations; no flashy or distracting effects

---

## Route Architecture (Stage 0)

| Route | View | Description |
| :--- | :--- | :--- |
| `/` | `Home` | Displays top gainers / rising stocks first |
| `/stocks` | `Stocks` | Comprehensive market scanner placeholder |
| `/portfolio` | `Portfolio` | Simulated asset distribution and holdings |
| `/expert-picks` | `ExpertPicks` | Curated top coins with gold border glow |
| `/expected-profits` | `ExpectedProfits` | Multi-asset projection and scenario calculator |
| `/future` | `Future` | Coming soon card with 3 planned features |
| `/appearance` | `Appearance` | Working Dark/Light theme switcher with persistence |
| `/login` | `Login` | Minimalist authentication placeholder |
| `/signup` | `Signup` | Account registration placeholder |
| `*` | `NotFound` | 404 error page with return to home navigation |

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```
