Run a Lighthouse audit across all pages and, **only if any score is below 100**, produce a concrete improvement plan.

## Steps

### 1. Build + start preview

```sh
npm run build
npm run preview -- --port 4322 &
sleep 3
```

### 2. Run unlighthouse in CI mode

```sh
npx unlighthouse-ci --site http://localhost:4322 --output-path .unlighthouse
```

This writes `.unlighthouse/ci-result.json` with per-route and aggregated scores for Performance, Accessibility, Best Practices, and SEO.

### 3. Parse results

Read `.unlighthouse/ci-result.json`. Extract the **average scores** across all routes for each of the four categories. Convert raw values (0–1) to integer percentages (× 100).

### 4a. All scores at 100 → done

If every category average is 100, print a short success message listing all four scores and stop. Do **not** produce any plan.

### 4b. At least one score below 100 → produce a plan

For each category that is below 100:

1. List every **individual page** that has a sub-100 score for that category, with its exact score.
2. Read the detailed findings from the JSON (audit IDs, descriptions, impact levels) for those pages.
3. Produce a numbered action list — one action per distinct root cause — ordered by estimated impact (highest first). Each action must be:
   - **Specific** (file path, component name, or CSS property when identifiable)
   - **Actionable** (what to change, not just "improve performance")
   - **Linked to a score gain** ("fixes the LCP issue on /watch, +8 pts")

Do not give generic advice that applies to every website. Every recommendation must be grounded in the actual audit data.

### 5. Kill preview server

```sh
pkill -f "astro preview" 2>/dev/null || true
```

### 6. Clean up

Remove `.unlighthouse/` so it does not pollute git status.

```sh
rm -rf .unlighthouse
```
