# Catalog and Atlas update

- Added 55 reference recipes and 45 reference deals, preserving the original records (85 recipes, 65 deals).
- Added 121 original illustration images to `recipe_images`; images are served through the existing image API.
- Photo update: replaced catalog illustrations with 191 reviewed reference photos covering 85 recipes, 65 deals and all 470 ingredient occurrences. Stored WebP images in Atlas using content-based immutable IDs; old media and order history remain intact. Source links are retained in `scripts/data/catalog-photo-sources.json`, image records and the `/photo-credits` page. Source attribution is not a blanket commercial-use license; verify source permissions before commercial redistribution.
- `node scripts/prepare-catalog-photos.mjs` downloads, validates and previews the selected sources. `node scripts/apply-catalog-photos.mjs` validates database coverage; add `--apply` to update image fields. A local pre-update backup is written to `tmp/catalog-photo-backups/`. Seeding preserves photo-backed catalog records.
- Prices are project reference prices, not verified retailer offers. No live stock or merchant acceptance was fabricated.
- `node scripts/expand-catalog.mjs` prepares and validates the additions. `--apply` inserts missing records only in the explicitly checked `ai_smart_grocery` database. It does not replace existing recipes or orders.
- Daily selection: 20 distinct ingredient IDs, Vietnam calendar date; the same selection covers 11:00–13:00 and 17:00–19:00. Selection prioritizes never-featured items, then least recently featured items using the saved daily history. With an unchanged pool of 65, consecutive days do not overlap.
- `goldenrotations` records each date on its first request. Selection is stable across reloads and instances; no scheduled background worker is necessary. Disabled/unavailable items are removed from that day's selection, not replaced mid-day.
- Selection and time checks apply to deals, product prices and checkout quotes. Outside the window, the original price applies. Promotions excluded by the administrator also use their original price.
- `weeklyplans` stores each authenticated user's manual schedule with budget, servings and revision. Conflicting saves return 409; a stale device cannot silently overwrite the newer revision.
- Pantry and advanced insights show a membership gate before fetching restricted resources.
- When Gemini is not configured, meal generation is explicitly labeled catalog suggestions. Budget and profile exclusions apply; successful generation uses the normal membership quota. No external AI response is claimed.
- PayOS production remains dependent on valid production configuration and explicit activation. Existing keys are not printed or committed in the example environment file.
- Atlas updates take effect immediately. Application changes still require deployment to Vercel to change production behavior.
