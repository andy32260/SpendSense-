# SpendSense

A full-stack personal finance tracker built for people who find budgeting apps intimidating, students and financial beginners who want a clear picture of their spending without spreadsheets or jargon.

Built independently as a portfolio project to apply real Django REST Framework and React/TypeScript skills to a problem with genuine technical depth, not just CRUD.

## Why this project

Most tutorial finance trackers are just forms bolted onto a database. SpendSense's actual goal was to build one genuinely non-trivial feature, automatic detection of recurring subscriptions from raw transaction history, and support it with a properly scoped, secure, tested full-stack application around it.

## Tech stack

Backend: Django REST Framework, PostgreSQL, JWT authentication (djangorestframework-simplejwt)
Frontend: React, TypeScript, Vite, React Router, Axios, Tailwind CSS

## The standout feature: recurring transaction detection

Given a user's transaction history, detect_recurring_transactions() identifies likely subscriptions (Netflix, gym memberships, etc.) without any pre-defined list of known merchants. The approach:

1. Group transactions by a cleaned version of their description (lowercased, whitespace-trimmed), a simple first-pass fuzzy match rather than exact string equality.
2. Filter to groups with at least 3 occurrences. Two data points can't establish a consistent pattern, since there's only one gap to measure.
3. Score interval consistency. Calculate the day-gaps between consecutive transactions, then the average deviation from the mean gap. Small deviation (charges land around 30 days apart, consistently) scores close to 1. Large deviation (random, unrelated timing) scores close to 0.
4. Score amount consistency. Same idea, but as a percentage deviation from the average amount, so the scoring works fairly for both a £3.99 subscription and a £45.99 one.
5. Combine into a weighted confidence score: 0.6 x interval_score + 0.4 x amount_score. Interval consistency is weighted higher, since a merchant charging like clockwork is a stronger recurring-subscription signal than amount alone (amounts can vary slightly with plan changes, timing usually doesn't).

The algorithm doesn't hardcode "monthly." It works off whatever interval is actually consistent, so it would just as easily catch a weekly or quarterly charge.

This logic is covered by automated tests (transactions/tests.py), including a case that caught a real floating-point precision issue in PostgreSQL's SUM() over Decimal columns, resolved with assertAlmostEqual rather than exact equality. This was a real bug found and fixed during development, not a hypothetical.

## Savings goal projection

Given a savings goal and a chosen set of categories with hypothetical reduction percentages (e.g. cut Takeaway by 20%, Coffee Shop by 10%), calculate_projection() estimates how many months it would take to cover the remaining goal amount using only the money freed up by those cuts.

This deliberately doesn't claim to know a user's income or true savings rate, since the app has no income model. The result is framed honestly as "at this freed-up rate alone, covering the rest would take approximately X months", not as a claim about someone's actual overall timeline. Covered by automated tests, including the zero-reduction edge case where no valid projection exists.

## Other backend features

- User-scoped everything. Every queryset is filtered by the authenticated user (get_queryset), and every create operation injects the user server-side (perform_create), never trusting a client-supplied user field.
- On-read aggregation, not stored state. Budget progress (spent_so_far) and monthly spending summaries are calculated live from transaction data via Django's aggregate/annotate, deliberately not stored as fields. This avoids a class of stale-data bugs where a stored total silently drifts out of sync with the transactions it's meant to represent.
- JWT auth with full refresh lifecycle. Short-lived access tokens, longer-lived refresh tokens, and a frontend response interceptor that automatically redirects to login on token expiry rather than surfacing a raw error.

## Frontend

- In-memory token storage via React Context, not localStorage. This is a deliberate tradeoff. It means a page refresh logs the user out, but it closes off token theft via XSS. Reasonable for a portfolio project's threat model, and worth naming as a considered decision rather than an oversight.
- Full CRUD (create, read, update, delete) across Transactions, Budgets, and Savings Goals.
- Protected routing. Authenticated pages redirect to /login if no valid session exists.
- A Dashboard surfacing both differentiator features: the monthly category summary and the recurring transaction detector.

## Setup

### Backend

```
cd backend
python -m venv venv
venv\Scripts\activate  (or source venv/bin/activate on macOS/Linux)
pip install -r requirements.txt
```

Create a .env file in backend/:
```
DB_NAME=finance_tracker
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

```
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend

```
cd frontend
npm install
npm run dev
```

Runs at http://localhost:5173, expecting the backend at http://127.0.0.1:8000.

## What's built vs what's next

Done: full backend (models, auth, CRUD, recurring detection, monthly summary, savings goal projection, admin, automated tests), full frontend CRUD across all three resources, protected routing, styled UI.

Not yet built: chart-based visualizations (currently styled lists), a frontend UI for the savings goal projection feature (backend logic and tests are complete), and deployment (currently local-only).

## A note on AI use

Some parts of this project were built with AI assistance, including guided learning while writing the backend and frontend logic, and a later Tailwind styling pass done more directly for speed. The core logic, including the recurring-detection algorithm and the projection calculation was written and understood by me.
