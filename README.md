# Optiq

Marketing attribution and ROI optimization platform. Track ad spend, measure conversions, and optimize ROAS across Google Ads, Meta Ads, and TikTok Ads.

## Quick Start

### Prerequisites

- **Node.js 20+**
- **Docker** (for PostgreSQL)
- **npm** (comes with Node.js)

### One-Command Setup

```bash
# 1. Clone and install
git clone https://github.com/ExportedSA/Optiq.git
cd Optiq

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env
# Edit .env with your values (see .env.example for guidance)

# 4. Start everything (DB + Backend + Frontend)
npm run dev
```

This single command:
- Starts PostgreSQL via Docker
- Builds shared packages
- Runs database migrations
- Starts the backend API (port 3001)
- Starts the frontend (port 3000)

### Access the App

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **API Health**: http://localhost:3001/health

## Project Structure

```
optiq/
├── apps/
│   ├── frontend/     # Next.js 16 web application
│   └── backend/      # Fastify API server
├── packages/
│   └── shared/       # Shared types, utilities, logger
├── docs/             # Documentation
├── docker/           # Docker configurations
└── scripts/          # Development utilities
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start all services (DB + API + Web) |
| `npm run dev:frontend` | Start frontend only |
| `npm run dev:backend` | Start backend only |
| `npm run dev:db:start` | Start PostgreSQL in background |
| `npm run dev:db:stop` | Stop PostgreSQL |
| `npm run build` | Build all packages |
| `npm run typecheck` | Run TypeScript checks |
| `npm run lint` | Lint all packages |
| `npm run test` | Run unit tests |
| `npm run prisma:studio` | Open Prisma database UI |

## Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Yes | Session encryption key (32+ chars) |
| `DATA_ENCRYPTION_KEY` | Yes | Data encryption key (32+ chars) |
| `GOOGLE_OAUTH_*` | Yes | Google OAuth credentials |
| `META_*` | Yes | Meta/Facebook API credentials |
| `TIKTOK_*` | Yes | TikTok API credentials |
| `STRIPE_*` | For billing | Stripe API keys |

See `.env.example` for the complete list with documentation.

## Tech Stack

- **Frontend**: Next.js 16, React 19, TailwindCSS, NextAuth
- **Backend**: Fastify, Prisma, PostgreSQL
- **Shared**: TypeScript, Zod, Pino logging
- **Testing**: Vitest, Playwright
- **CI/CD**: GitHub Actions, Vercel

## Documentation

- [Deployment Guide](docs/DEPLOY.md) - Production deployment blueprint
- [Observability](docs/OBSERVABILITY.md) - Logging, monitoring, error tracking
- [Environment Setup](ENV_SETUP.md) - Detailed env configuration

## Development

### Database

```bash
# Start database
npm run dev:db:start

# Open Prisma Studio
npm run prisma:studio

# Run migrations
npm run prisma:migrate -w @optiq/backend
```

### Testing

```bash
# Unit tests
npm run test

# E2E tests (requires app running)
cd apps/frontend
npm run test:e2e
```

### Code Quality

```bash
# Type check
npm run typecheck

# Lint
npm run lint

# Format
npm run format
```

## License

Private - All rights reserved.
