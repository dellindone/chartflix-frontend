# Chartflix – Alert & Analytics Terminal

A React.js trading alert dashboard with dark/light theme, analyst recommendations, and common stock detection.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm start

# 3. Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Demo credentials:** `demo@chartflix.com` / `demo123`

---

## 📁 Folder Structure

```
src/
├── App.jsx                        # Root – routes + providers
├── index.js                       # ReactDOM entry point
│
├── components/
│   ├── alerts/
│   │   ├── AlertCard.jsx          # Single option alert card
│   │   ├── AlertFilters.jsx       # Category / direction / date controls
│   │   ├── CategorySummary.jsx    # Bull/bear summary cards (Index/Commodity/Stock)
│   │   └── SuggestionsBar.jsx     # Smart filter suggestion chips
│   │
│   ├── reco/
│   │   ├── AnalystSection.jsx     # Collapsible analyst section with cards
│   │   ├── RecoCard.jsx           # Individual recommendation card
│   │   └── CommonStocksModal.jsx  # Analyst comparison + common stock finder
│   │
│   ├── layout/
│   │   ├── AppLayout.jsx          # Shell: sidebar + navbar + main
│   │   ├── Sidebar.jsx            # Left navigation panel (collapsible)
│   │   └── Navbar.jsx             # Top bar: toggle, theme, hamburger dropdown
│   │
│   └── common/
│       ├── Avatar.jsx             # Reusable avatar (initials or photo)
│       ├── Button.jsx             # Reusable button with variants
│       ├── Modal.jsx              # Generic modal wrapper
│       └── ProtectedRoute.jsx     # Auth guard for private routes
│
├── pages/
│   ├── LoginPage.jsx              # /login
│   ├── SignupPage.jsx             # /signup
│   ├── AlertsPage.jsx             # /alerts  (main dashboard)
│   ├── RecoPage.jsx               # /reco    (stock recommendations)
│   └── ProfilePage.jsx            # /profile (user settings)
│
├── context/
│   ├── AuthContext.js             # currentUser, login, signup, logout, updateProfile
│   └── ThemeContext.js            # isDark, toggleTheme → sets data-theme on <html>
│
├── hooks/
│   └── useAlertFilters.js         # All alert filtering + summary logic
│
├── data/
│   ├── alerts.js                  # Mock alert data
│   └── analysts.js                # Mock analyst + recommendation data
│
├── utils/
│   └── helpers.js                 # getInitials, toDateStr, formatINR, calcPct, getDateRange
│
└── styles/
    └── globals.css                # CSS variables (dark/light themes), reset, animations
```

---

## 🎨 Theming

All colors are CSS custom properties defined in `src/styles/globals.css`.

- Dark theme is default (`:root`)
- Light theme overrides via `[data-theme="light"]` on `<html>`
- `ThemeContext` toggles this attribute automatically

---

## ➕ Adding a New Feature

| What you want | Where to add it |
|---|---|
| New page | `src/pages/` + new `<Route>` in `App.jsx` |
| New sidebar link | `NAV_ITEMS` array in `Sidebar.jsx` |
| New data source | `src/data/` |
| New shared UI | `src/components/common/` |
| New filter logic | `src/hooks/` |
| New API call | `src/services/` *(create this folder)* |

---

## 🔌 Connecting a Real Backend

Replace mock data in `src/data/` with API calls.
Suggested structure for a backend layer:

```
src/
└── services/
    ├── api.js          # axios/fetch base config
    ├── alertService.js # getAlerts(), createAlert()
    ├── authService.js  # login(), signup(), logout()
    └── recoService.js  # getAnalysts(), getRecommendations()
```

---

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Framework | React 18 |
| Routing | React Router v6 |
| Styling | CSS Modules + CSS Variables |
| State | React Context + useState/useMemo |
| Fonts | Google Fonts (Space Mono + DM Sans) |
