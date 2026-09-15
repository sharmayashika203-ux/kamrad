# KadamFind - Production Monorepo Architecture

KadamFind is structured into two clean, standalone subfolders inside the main directory:

```
kadamfind/
├── frontend/             # React + Vite Frontend Web Application
│   ├── src/              # React components, pages, context, hooks, tests, styles
│   ├── public/           # Static assets, logos, and images
│   ├── package.json      # Frontend dependencies & scripts
│   └── README.md         # Frontend technical guide
│
├── backend/              # Supabase PostgreSQL & Edge Functions Infrastructure
│   ├── supabase/
│   │   ├── schema.sql    # 12 database tables, RLS policies, views, triggers
│   │   ├── seed.sql      # Master seed data for destinations and interests
│   │   └── functions/    # Razorpay Webhook & Payment Verification Edge Functions
│   ├── package.json      # Backend deployment scripts
│   └── README.md         # Database migration & backend deployment guide
│
└── package.json          # Monorepo root management scripts
```

---

## 🚦 Getting Started

### Run Frontend Development Server
```bash
npm run dev:frontend
# OR navigate to frontend/
cd frontend && npm run dev
```

### Run Full Test Suite (36/36 Tests Passing)
```bash
npm run test:frontend
```

### Build Production Bundle
```bash
npm run build:frontend
```
