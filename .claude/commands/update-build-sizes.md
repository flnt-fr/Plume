Update the "Build output sizes" table in `README.md` to reflect the current build.

## Steps

### 1. Run the build and capture sizes

```sh
npm run build:sizes 2>&1
```

The output looks like:
```
  /_astro/BaseLayout.CDCKx9od.css: 75067B → 74974B (-0%)
  /legal/index.html: 4536B → 4306B (-5%)
  /index.html: 10267B → 9850B (-4%)
  /favicon.svg: 1404B → 835B (-41%)
  ...
```

### 2. Parse the output

For each line, extract:
- **Label** — map the raw path to a display name using this convention:
  - `/index.html` → `` `/` ``
  - `/about/index.html` → `` `/about` ``
  - `/watch/index.html` → `` `/watch` ``
  - `/watch/2/index.html` → `` `/watch/2` ``
  - (same pattern for any other `/page/index.html`)
  - `/_astro/BaseLayout.*.css` → `` `CSS bundle` ``
  - `/favicon.svg` → `` `favicon.svg` ``
- **Before** — raw bytes before compression, formatted with a space as thousands separator (e.g. `10 267 B`)
- **After** — raw bytes after compression, same format
- **Saving** — the percentage from the output (e.g. `-4%`)

Sort the rows: HTML pages first (alphabetical by route), then CSS bundle, then other static assets.

### 3. Replace the table in README.md

Find the block in `README.md` between the markers:

```
| Page | Before | After | Saving |
|---|---|---|---|
```

and the closing `</details>` of that block (lines 76–89 roughly).

Replace **only the table rows** (from the header row to the last data row, inclusive) with the newly generated table. Do not touch anything outside the table.

The target block looks like:
```markdown
| Page | Before | After | Saving |
|---|---|---|---|
| `/` | 9 191 B | 8 848 B | -4% |
...
```

### 4. Report

Print a one-line summary: how many rows were updated and whether any sizes changed from the previous values.
