# Optiq

Marketing attribution and ROI optimization platform. Track ad spend, measure conversions, and optimize ROAS across Google Ads, Meta Ads, and TikTok Ads.

## Quick Start

### Prerequisites

- **Node.js 20+** and npm
- Git
- **Database:** Choose one:
  - **Neon** (Recommended) - Free serverless PostgreSQL, no Docker needed
  - **Docker** - For local PostgreSQL database

### Option 1: With Neon (Recommended - 2 Minutes)

```bash
# 1. Clone the repository
git clone https://github.com/ExportedSA/Optiq.git
cd Optiq

# 2. Install dependencies
npm install

# 3. Set up Neon database (free)
# - Go to https://neon.tech and create account
# - Create a new project
# - Copy the connection string

# 4. Set up environment variables
cp .env.example .env
# Edit .env and add:
# - DATABASE_URL (from Neon)
# - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)
# - DATA_ENCRYPTION_KEY (generate with: openssl rand -base64 32)

# 5. Start the application
npm run dev
```

**See [NEON_DATABASE_SETUP.md](./docs/NEON_DATABASE_SETUP.md) for detailed guide.**

### Option 2: With Docker

```bash
# Follow steps 1-4 above, then:
# Make sure Docker Desktop is running
npm run dev  # This will start PostgreSQL via Docker
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Health: http://localhost:3001/health
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
