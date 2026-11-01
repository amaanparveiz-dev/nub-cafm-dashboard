# NUB CAFM – React + TypeScript app

Login + dashboard, ported from a single static HTML file.

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck  # tsc --noEmit (strict)
npm run build      # typecheck, then production build in dist/
```

Demo sign-in: `dev@bits.sa` / `Demo@1234`.

## Structure
- `pages/` – `LoginPage`, `DashboardPage` (lazy-loaded routes)
- `components/login|dashboard|common|routes/` – UI split by feature
- `context/AuthContext.tsx` – session state; `components/routes/RouteGuards.tsx` – route protection
- `services/authService.ts` – **mock** auth API; replace with a real backend (HttpOnly cookie sessions)
- `types/` – shared domain types
- `hooks/`, `utils/`, `constants/`, `data/` – reusable logic, config, and static demo data
