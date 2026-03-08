# 💣 Minesweeper

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://github.com/facebook/react)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://github.com/vitejs/vite)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://github.com/microsoft/TypeScript)
[![CSS Modules](https://img.shields.io/badge/CSS_Modules-scoped-1572B6?logo=cssmodules&logoColor=white)](https://github.com/css-modules/css-modules)
[![Electron](https://img.shields.io/badge/Electron-40-47848F?logo=electron&logoColor=white)](https://github.com/electron/electron)
[![Capacitor](https://img.shields.io/badge/Capacitor-8-119EFF?logo=capacitor&logoColor=white)](https://github.com/ionic-team/capacitor)
[![Node.js](https://img.shields.io/badge/Node.js-24-5FA04E?logo=nodedotjs&logoColor=white)](https://github.com/nodejs/node)
[![pnpm](https://img.shields.io/badge/pnpm-10-F69220?logo=pnpm&logoColor=white)](https://github.com/pnpm/pnpm)
[![ESLint](https://img.shields.io/badge/ESLint-10-4B32C3?logo=eslint&logoColor=white)](https://github.com/eslint/eslint)
[![Prettier](https://img.shields.io/badge/Prettier-3-F7B93E?logo=prettier&logoColor=black)](https://github.com/prettier/prettier)
[![All Rights Reserved](https://img.shields.io/badge/License-All%20Rights%20Reserved-red.svg)](LICENSE)
[![GitHub](https://img.shields.io/badge/GitHub-scottdreinhart%2Fminesweeper-181717?logo=github&logoColor=white)](https://github.com/scottdreinhart/minesweeper)

A cross-platform Minesweeper game with multiple difficulty levels, 7 color themes, timer, flag counter, and native desktop + mobile builds — powered by React, Vite, Electron, and Capacitor.

**⚠️ PROPRIETARY SOFTWARE — All Rights Reserved**

© 2026 Scott Reinhart. This software is proprietary and confidential.
Unauthorized reproduction, distribution, or use is strictly prohibited.
See [LICENSE](LICENSE) file for complete terms and conditions.

> [!CAUTION]
> **LICENSE TRANSITION PLANNED** — This project is currently proprietary. The license will change to open source once the project has reached a suitable state to allow for it.

[Project Structure](#project-structure) · [Getting Started](#getting-started) · [Tech Stack](#tech-stack) · [Contributing](#contributing) · [Future Improvements](#future-improvements) · [Future Game Ideas](#future-game-ideas)

## Project Structure

```
src/
├── domain/                           # Pure, framework-agnostic logic
│   ├── types.ts                      # Central type definitions (Cell, Board, GameState, Difficulty, etc.)
│   ├── constants.ts                  # DIFFICULTY_PRESETS, DIRECTIONS, board dimensions
│   ├── board.ts                      # Board operations (create, place mines, compute adjacency)
│   ├── rules.ts                      # Reveal, flag, win/loss detection
│   ├── ai.ts                         # Hint system (safe cell finder)
│   ├── themes.ts                     # Color theme, mode & colorblind definitions + DEFAULT_SETTINGS
│   └── index.ts                      # Barrel export — re-exports all domain modules
├── app/
│   ├── haptics.ts                    # Vibration API wrapper (tick, tap, heavy)
│   ├── sounds.ts                     # Web Audio API synthesized SFX (click, reveal, explosion, win)
│   ├── storageService.ts             # localStorage JSON wrapper (load<T>/save/remove)
│   ├── ThemeContext.tsx              # React Context provider for theme/mode/colorblind settings
│   ├── SoundContext.tsx              # React Context provider for sound state + guarded playback
│   ├── useTheme.ts                   # Theme / mode / colorblind persistence + DOM sync
│   ├── useSoundEffects.ts            # Sound toggle + play functions (respects reduced-motion)
│   ├── use*.ts                       # Additional React hooks for state & effects
│   └── index.ts                      # Barrel export — re-exports all app hooks and services
├── ui/
│   ├── atoms/
│   │   ├── ErrorBoundary.tsx         # React Error Boundary — crash isolation with fallback + retry
│   │   └── index.ts                  # Barrel export — re-exports all atoms
│   ├── molecules/
│   │   └── index.ts                  # Barrel export — re-exports all molecules
│   ├── organisms/
│   │   ├── App.tsx                   # Top-level game component (pure composition)
│   │   └── index.ts                  # Barrel export — re-exports all organisms
│   ├── index.ts                      # Barrel export — re-exports all UI sub-layers
│   ├── ui-constants.ts               # UI layout constants (sizes, breakpoints)
│   └── utils/
│       ├── cssModules.ts             # cx() conditional class binding utility
│       └── index.ts                  # Barrel export — re-exports utilities
├── themes/                           # Lazy-loaded theme CSS chunks
│   ├── highcontrast.css              # High-contrast theme (default)
│   ├── ocean.css / sunset.css        # Additional color themes
│   ├── forest.css / rose.css
│   └── midnight.css
├── workers/
│   └── ai.worker.ts                  # Off-main-thread hint computation
├── index.tsx                         # React entry point (ThemeProvider > SoundProvider > ErrorBoundary > App)
└── styles.css                        # Global styles & CSS custom properties

public/
├── manifest.json                     # PWA manifest
├── sw.js                             # Service worker for offline play
└── offline.html                      # Offline fallback page

index.html                            # HTML entry point
package.json                          # Dependencies & scripts
pnpm-lock.yaml                        # pnpm lockfile
pnpm-workspace.yaml                   # pnpm workspace config
LICENSE                               # Proprietary license terms
capacitor.config.ts                   # Capacitor native app configuration
electron/
├── main.js                           # Electron main process
└── preload.js                        # Sandboxed context bridge

tsconfig.json                         # TypeScript config (strict mode + @/ path aliases)
vite.config.js                        # Vite config + rollup-plugin-visualizer + @/ resolve aliases
eslint.config.js                      # ESLint flat config (React + hooks + Prettier + boundary enforcement)
.prettierrc                           # Prettier formatting rules
.gitignore                            # Git ignore rules
.nvmrc                                # Node.js version pin (v24)
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v24+ (pin via [nvm](https://github.com/nvm-sh/nvm) — see `.nvmrc`)
- [pnpm](https://pnpm.io/) v10+

### Install & Run

```bash
# Install dependencies
pnpm install

# Start development server (accessible on LAN via 0.0.0.0)
pnpm start          # quick alias — vite --host
pnpm dev            # same + kills stale port 5173 first

# Build for production
pnpm build

# Preview production build locally
pnpm preview
```

### Code Quality

```bash
pnpm lint            # ESLint check
pnpm lint:fix        # ESLint auto-fix
pnpm format          # Prettier write
pnpm format:check    # Prettier verify
pnpm typecheck       # tsc --noEmit
pnpm check           # lint + format:check + typecheck
pnpm validate        # check + build (CI gate)
```

### Electron Desktop App

```bash
pnpm electron:dev           # dev with hot-reload
pnpm electron:build:win     # Windows installer (.exe)
pnpm electron:build:linux   # Linux AppImage
pnpm electron:build:mac     # macOS .dmg
```

### Capacitor Mobile App

```bash
pnpm cap:init:android    # add Android platform (first time)
pnpm cap:sync            # build + sync web assets to native
pnpm cap:open:android    # open in Android Studio
pnpm cap:run:android     # build + run on connected device
```

## Tech Stack

| Layer        | Technology                                          |
| ------------ | --------------------------------------------------- |
| UI           | React 19 + CSS Modules (scoped styles)              |
| Bundler      | Vite 7 (ESBuild + Rollup)                           |
| Language     | TypeScript 5.9 (strict mode)                        |
| Desktop      | Electron 40 + electron-builder                      |
| Mobile       | Capacitor 8 (Android / iOS)                         |
| Lint         | ESLint 10 (flat config) + eslint-plugin-boundaries  |
| Format       | Prettier 3                                          |
| Runtime      | Node.js 24, pnpm 10                                 |
| Audio        | Web Audio API (synthesized SFX)                     |
| Offline      | Service Worker + Cache API                          |

## Architecture

#### Design Principles (Enforced)

1. **CLEAN Layer Separation** — Code is organized into `domain/`, `app/`, and `ui/` layers with strict unidirectional dependency flow: `domain ← app ← ui`. The `domain` layer contains zero framework imports; `app` bridges domain logic with React hooks; `ui` handles rendering only. This separation means game logic can be tested, reused, or ported to another framework without touching UI code.

2. **Barrel Exports** — Every directory exposes a single `index.ts` that re-exports its public API. Consumer modules import from `@/domain` instead of `@/domain/board`, reducing import fragility and enabling internal refactors (rename, split, merge files) without propagating changes to every import site.

3. **Path Aliases (`@/`)** — TypeScript `paths` and Vite `resolve.alias` map `@/domain`, `@/app`, and `@/ui` to their source directories. Imports read as `import { revealCell } from '@/domain'` instead of brittle relative paths like `../../../domain/rules`, improving readability and eliminating path breakage when files move.

4. **Import Boundary Enforcement** — `eslint-plugin-boundaries` enforces the CLEAN dependency graph at lint time: `domain` may only import from `domain`; `app` from `domain` + `app`; `ui` from all three; `workers` from `domain` only; `themes` from nothing. Violations fail CI, preventing architectural drift before code reaches review.

5. **React Error Boundaries** — A class-based `ErrorBoundary` wraps the entire component tree, catching render-time exceptions and displaying a styled fallback with a retry button instead of a white screen. This isolates crashes to the boundary scope and lets users recover without a full page reload.

6. **React Context for Dependency Injection** — `ThemeProvider` and `SoundProvider` expose application-wide state (theme settings, sound toggle) via React Context, replacing prop-drilling chains. Components anywhere in the tree call `useThemeContext()` or `useSoundContext()` to read or update shared state without intermediate component coupling.

7. **CSS Modules** — Component styles are scoped via CSS Modules (`.module.css`), eliminating global class name collisions. Each component's styles are co-located and automatically hashed at build time, ensuring zero style leakage between components.

8. **Atomic Design (atoms → molecules → organisms)** — UI components follow the Atomic Design hierarchy: `atoms/` (buttons, icons, overlays), `molecules/` (composite widgets), `organisms/` (full page sections). This taxonomy scales predictably — new components slot into the correct level without ambiguity.

9. **Off-Main-Thread AI** — Hint computation runs in a Web Worker (`ai.worker.ts`), keeping the UI thread responsive during analysis. The worker imports only from `@/domain`, enforced by boundary rules, ensuring it remains a pure computation unit with no DOM or React dependencies.

#### Supporting Patterns

- **Service Worker** — `public/sw.js` caches `offline.html` for offline fallback
- **PWA Manifest** — `public/manifest.json` enables Add-to-Home-Screen on mobile
- **Haptic Feedback** — `haptics.ts` wraps the Vibration API for native-feel touch responses
- **Web Audio SFX** — `sounds.ts` synthesizes click, reveal, explosion, and win sounds entirely in code (zero audio file downloads)

## Device Compatibility

| Platform     | Method                                      | Status    |
| ------------ | ------------------------------------------- | --------- |
| Web (modern) | Chrome, Edge, Firefox, Safari 16+           | ✅ Supported |
| Desktop      | Electron (Windows / macOS / Linux)          | ✅ Supported |
| Android      | Capacitor → WebView                         | ✅ Supported |
| iOS          | Capacitor → WKWebView                       | 🔜 Planned  |
| PWA          | Service Worker + manifest.json              | ✅ Supported |

## Remaining Work

### Visual & UX

- [ ] **Game UI implementation** — build the complete game interface with minefield grid, timer, flag counter, and difficulty selector
- [ ] **Theme system** — multiple color themes with light/dark/system mode + colorblind presets
- [ ] **Sound effects** — Web Audio API synthesized SFX + background music

### Code Quality & Testing

- [ ] **Unit tests** — domain functions are pure and test-ready; add Vitest or Jest suite
- [ ] **Component tests** — React Testing Library tests for UI components
- [ ] **Integration / E2E tests** — Playwright or Cypress for full game-flow verification

### DevOps & Deployment

- [ ] **CI/CD pipeline** — GitHub Actions workflow for lint → test → build → deploy
- [ ] **GitHub Pages / Vercel deploy** — auto-deploy `dist/` on push to `main`
- [ ] **Custom app icons** — generate PNG icons from SVG for Electron builds and mobile

## Future Improvements

The following monetization and sustainability strategies are under consideration. Each model is designed to preserve the free-to-play core experience while introducing optional revenue streams that fund ongoing development, server infrastructure, and cross-platform maintenance.

### Ad Network Participation

- [ ] **Rewarded video ads** — opt-in ad placements (e.g., Google AdMob, Unity Ads) that grant in-game rewards such as bonus theme previews, temporary cosmetic unlocks, or series score multipliers. Users are never forced to watch — ads are triggered only by explicit interaction ("Watch to unlock").
- [ ] **Interstitial placement** — non-intrusive full-screen ads shown at natural breakpoints (between matches, after a game-over screen) with frequency capping to prevent fatigue. Configurable via remote config so cadence can be tuned post-launch without a client update.
- [ ] **Banner integration** — reserved layout slot for lightweight banner ads on non-gameplay screens (settings, stats dashboard). The game board itself remains permanently ad-free to protect the core UX.

> **Justification:** Ad networks provide a zero-barrier revenue floor — every user contributes regardless of purchase intent. Rewarded ads in particular have shown 2–4× higher eCPMs than banners while maintaining positive user sentiment because the value exchange is transparent and voluntary.

### Monthly Subscription

- [ ] **Premium tier** — a low-cost monthly subscription (~$1.99–$3.99/month) that removes all ads, unlocks the full theme catalog, grants early access to new game modes, and provides subscriber-exclusive cosmetics (animated marks, board skins, victory effects).
- [ ] **Cross-project entitlement** — a single subscription covers all games in the portfolio (Tic-Tac-Toe, Connect Four, Mancala, etc.), increasing perceived value and reducing churn as new titles launch.
- [ ] **Family sharing** — support platform family-sharing mechanisms (Google Play Family Library, Apple Family Sharing) to extend a single subscription across household devices.

> **Justification:** Subscriptions generate predictable, recurring revenue that smooths the volatility of ad markets and one-time purchases. Bundling across the full game portfolio transforms each new title from a separate acquisition cost into a retention tool — subscribers stay engaged as long as fresh content ships.

### Tiered Purchase Model

- [ ] **Free tier** — the complete game with default theme, all difficulty levels, and standard game modes. No gameplay is gated behind a paywall.
- [ ] **Starter pack** (~$0.99) — a one-time purchase that permanently removes banner ads and unlocks 3 additional themes.
- [ ] **Pro pack** (~$2.99) — includes everything in Starter plus all current and future themes, animated marks, custom board textures, and detailed lifetime statistics.
- [ ] **Collector's edition** (~$4.99) — includes everything in Pro plus exclusive seasonal themes, priority access to beta features, and a supporter badge displayed in online multiplayer.

> **Justification:** Tiered pricing captures value across the entire willingness-to-pay spectrum. The free tier maximizes install base and ad impressions; the Starter pack converts casual players at an impulse-buy price point; Pro and Collector's editions extract premium value from engaged users who want completionism and exclusivity. No tier restricts core gameplay — every purchase is cosmetic or convenience-oriented.

### eGoods Purchasing (Themes & Cosmetics)

- [ ] **Individual theme packs** (~$0.49–$0.99 each) — purchase single themes à la carte without committing to a bundle. Ideal for users who want one specific aesthetic without buying a full pack.
- [ ] **Seasonal / limited-edition themes** — time-limited theme drops (holiday palettes, collaborations, community-voted designs) that create urgency and collectibility. Retired themes may return in future rotations.
- [ ] **Mark customization** — purchasable game piece variants: neon glow, hand-drawn sketch, pixel art, emoji, or animated SVG styles. Applied per-player, visible to opponents in online multiplayer.
- [ ] **Board skins** — alternative board grid styles (chalk on slate, wooden inlay, sci-fi hologram, retro arcade) that overlay the default grid lines and cell backgrounds.
- [ ] **Victory effects** — premium win-line and celebration animations (fireworks, sparkle cascade, lightning strike) triggered on game-winning moves.
- [ ] **Sound packs** — alternative synthesized SFX suites (retro 8-bit, orchestral, lo-fi) that replace the default Web Audio API sound set.

> **Justification:** Microtransaction-based eGoods leverage the existing theme architecture — the CSS variable system, lazy-loaded theme chunks, and `useTheme` context already support hot-swapping visual styles at runtime. This makes the marginal engineering cost of each new theme near zero while the perceived user value remains high. Cosmetic-only purchases avoid pay-to-win dynamics and align with platform store guidelines (Apple App Store, Google Play) that discourage gameplay-gating IAPs.

---

## Future Game Ideas

All games in this portfolio share the same React + Vite + TypeScript + CLEAN architecture stack:

| Game | Description | Complexity |
| ---- | ----------- | ---------- |
| **[Tic-Tac-Toe](https://github.com/scottdreinhart/tictactoe)** | Classic 3×3 grid game with 4 AI difficulty levels and series mode | Baseline — the reference architecture |
| **[Shut the Box](https://github.com/scottdreinhart/shut-the-box)** | Roll dice, flip numbered tiles to match the total; lowest remaining sum wins | Similar — grid UI + dice logic |
| **[Mancala (Kalah)](https://github.com/scottdreinhart/mancala)** | Two-row pit-and-stones capture game; simple rules, satisfying chain moves | Slightly higher — seed-sowing animation |
| **[Connect Four](https://github.com/scottdreinhart/connect-four)** | Drop discs into a 7×6 grid; first to four in a row wins | Similar — larger grid, same win-check pattern |
| **[Simon Says](https://github.com/scottdreinhart/simon-says)** | Repeat a growing sequence of colors/sounds; memory challenge | Similar — leverages existing Web Audio API |
| **[Lights Out](https://github.com/scottdreinhart/lights-out)** | Toggle a 5×5 grid of lights; goal is to turn them all off | Similar — grid + toggle logic |
| **[Nim](https://github.com/scottdreinhart/nim)** | Players take turns removing objects from piles; last to take loses | Simpler — minimal UI, pure strategy |
| **[Hangman](https://github.com/scottdreinhart/hangman)** | Guess letters to reveal a hidden word before the stick figure completes | Similar — alphabet grid + SVG drawing |
| **[Memory / Concentration](https://github.com/scottdreinhart/memory-game)** | Flip cards to find matching pairs on a grid | Similar — grid + flip animation |
| **[2048](https://github.com/scottdreinhart/2048)** | Slide numbered tiles on a 4×4 grid; merge matching tiles to reach 2048 | Slightly higher — swipe input + merge logic |
| **[Reversi (Othello)](https://github.com/scottdreinhart/reversi)** | Place discs to flip opponent's pieces; most discs wins | Moderately higher — flip-chain logic + AI |
| **[Checkers](https://github.com/scottdreinhart/checkers)** | Classic diagonal-move capture board game | Higher — move validation + multi-jump |
| **[Battleship](https://github.com/scottdreinhart/battleship)** | Place ships on a grid, take turns guessing opponent locations | Moderately higher — two-board UI + ship placement |
| **[Snake](https://github.com/scottdreinhart/snake)** | Steer a growing snake to eat food without hitting walls or itself | Different — real-time game loop instead of turn-based |
| **[Monchola](https://github.com/scottdreinhart/monchola)** | Traditional dice/board race game with capture mechanics | Similar — dice roll + board path + capture rules |
| **[Rock Paper Scissors](https://github.com/scottdreinhart/rock-paper-scissors)** | Best-of-N rounds against the CPU with hand animations | Simpler — minimal state, animation-focused |

## Contributing

This is proprietary software. Contributions are accepted by invitation only.

If you have been granted contributor access:

1. Create a feature branch from `main`
2. Make focused, single-purpose commits with clear messages
3. Run `pnpm validate` before pushing (lint + format + build gate)
4. Submit a pull request with a description of the change

See the [LICENSE](LICENSE) file for usage restrictions.

## License

Copyright © 2026 Scott Reinhart. All Rights Reserved.

This project is proprietary software. No permission is granted to use, copy, modify, or distribute this software without the prior written consent of the owner. See the [LICENSE](LICENSE) file for full terms.

---

[⬆ Back to top](#-minesweeper)
