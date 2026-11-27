# Release notes

## 0.1.0: the first release

Released 28 November 2026, tagged `v0.1.0`.

**MeterVanta — AI Cost Intelligence & Usage-Based Billing Platform.** MeterVanta is a self-hosted ledger of what your AI API calls cost, by project, customer, feature and agent run, with no prompt data stored. It records token counts from OpenAI, Anthropic and Gemini, prices them exactly with dated, sourced prices, and checks the result against the providers' bills. On top of that sit budgets that can stop an agent before it overspends, and an optional ledger for billing your own customers for their AI usage.

The milestones below are in [docs/ROADMAP.md](ROADMAP.md), with an issue or PR for each item.

### Recording usage

- **`POST /api/usage`** with per-project API keys, stored as SHA-256 hashes. Retries with the provider's request ID are stored once.
- **TypeScript and Python clients**, one dependency-free file each. They read usage from OpenAI (Chat Completions, Responses, Realtime, Images), Anthropic and Gemini responses, including streams, and report it in the background. Delivery uses a bounded queue with backoff, and counts what was dropped.
- **OpenTelemetry intake** for apps instrumented with the GenAI conventions. A call reported both by a client and by a span is counted once.
- **Usage with no price is kept**, marked unpriced, and priced later with `npm run reprice`; it's never guessed.
- **Ingestion health** (`/ingestion`): stored, unpriced, replayed, conflicting and invalid reports per project and day.

### Pricing

- **Exact integer arithmetic**, rounded once per request to the micro-dollar; see [docs/COST-ACCOUNTING.md](COST-ACCOUNTING.md).
- **Dated prices with their source and check date**, managed at `/prices`. A request is priced at the rate in effect when it happened.
- **Rates for each kind of token:** cache reads, cache writes by lifetime (Anthropic's 5-minute and 1-hour, OpenAI's 30-minute and 12-hour), long-prompt tiers, batch, flex and fast tiers, audio and image tokens, and web searches.
- **Seed prices** for current OpenAI, Anthropic and Gemini models, including announced changes such as Gemini 2.5 Pro's move to Gemini 3.8 Flash rates on 2026-12-01.
- **Reconciliation** (`npm run reconcile`) against Anthropic's cost report, OpenAI's costs API and Google Cloud's BigQuery billing export.

### Dashboard and reports

- **A sidebar layout** on every dashboard page, in light and dark mode, that folds into a menu on small screens, and a public landing page that says what MeterVanta does.
- The overview with month-end forecasts and spike detection, spend over time, usage events with filters, and cost by customer, user, feature, run, tag and outcome (cost per resolved ticket, for example).
- **Why spend changed:** volume, model mix, tokens per request and cost per token, adding up to the change exactly.
- **Savings estimates** from caching, batching and model choice, labelled as estimates.
- **Exports and APIs:** a CSV export, a FOCUS 1.4 export, and a reporting API with read-only keys.

### Budgets

- Monthly and per-run budgets per project, with alerts at 80% and 100% by webhook (signed), Slack or email (`npm run budget-alerts`).
- **A budget check** an app calls before spending, and **reservations**, so concurrent agent steps can't overspend together. Both are in the clients.

### Teams

- Accounts with admin, member and viewer roles, password sign-in and optional single sign-on (OpenID Connect).
- Organizations that keep tenants apart, and an audit log of changes.
- Onboarding in the dashboard: projects, API keys (shown once), roles, and single-use invitation links.

### Billing your customers (optional)

- An append-only billing ledger kept apart from provider cost: customers, plans with a fee, included usage and a usage multiplier, monthly charges, adjustments and prepaid credit. See [docs/BILLING.md](BILLING.md).
- Plan usage limits checked before spending.
- `/revenue`: each customer's revenue next to their AI API cost, as "revenue minus AI API cost", never called profit.
- Draft Stripe invoices, in test mode by default, and invoice status (finalized, paid, failed, void, uncollectible) reported back through Stripe's signed webhooks. Each customer has an email for their invoices (`customer-email`), which Stripe requires.
- Invoice lines are written for the customer: a usage charge reads "Usage, 2026-10" and applied credit "Prepaid credit applied", never your AI API cost or markup.
- A read-only customer portal reached by a secret link, showing a customer their statement and never your costs.

### Demos and documents

- Three runnable demos that need no provider keys: [a support SaaS](../examples/support-agent/README.md), [multi-model agents under a run budget](../examples/multi-model-agent/README.md), and [usage-based billing](BILLING.md#the-billing-demo). See [docs/DEMOS.md](DEMOS.md).
- A short [README](../README.md) for business readers, and for developers the [quickstart](QUICKSTART.md), [integration guide](INTEGRATION.md), [technical reference](REFERENCE.md), [architecture](ARCHITECTURE.md), [cost accounting](COST-ACCOUNTING.md), [deployment](DEPLOYMENT.md) and [OpenTelemetry](OPENTELEMETRY.md) guides.

### Requirements

- Node.js 20.9 or later; the Docker image uses Node 24.
- PostgreSQL. Docker Compose runs Postgres 17, and CI tests against real Postgres.
- HTTPS in production: the session cookie is `Secure`, so signing in only works over HTTPS or on `localhost`.

### Installing

Follow [docs/DEPLOYMENT.md](DEPLOYMENT.md): Docker Compose on one server, or Vercel with hosted Postgres. `npm run db:migrate` applies the migrations (`drizzle/0000` to `0043`), and `npm run db:seed` loads the seed prices. As the first release, there's nothing to upgrade from.

### Known limitations

- **Usage must be reported by your code**, through a client, OpenTelemetry or the API. Provider bills are compared with it, not imported as usage.
- **Budgets only hold for calls that ask first.** A provider call made without a check or reservation isn't stopped.
- **Costs are at list price.** Negotiated discounts and credits show up only as differences when reconciling. Only USD is supported.
- **Charges other than tokens and web searches**, such as code execution, storage and fine-tuning, aren't recorded; reconciliation lists them.
- **Already-priced usage is never re-costed.** A wrong price is corrected for later usage by adding a new price.
- **Stripe has been used in test mode only.** Draft invoices and webhooks were run end to end against a Stripe sandbox, but never in live mode. Live keys are refused unless `STRIPE_ALLOW_LIVE=true` is set; try your own setup in test mode first.
- **Organizations are created from the command line**, and an account belongs to one organization. Prices are shared across the install.
- **Monthly charges and budget alerts are commands you schedule.** Nothing runs in the background inside the app.
- **Days are UTC days.**

See [docs/PRODUCT_UPGRADE_AUDIT.md](PRODUCT_UPGRADE_AUDIT.md) for a verified list of what works and what doesn't.
