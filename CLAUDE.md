# Instructions for Claude sessions working on Nine Lives Arcade

- This GitHub repository is the single source of truth, and Netlify is linked to it: every push to `main` deploys the live site automatically. Do not deploy with the Netlify CLI or API any more.
- Each production deploy costs about 15 Netlify credits on the free plan (300 a month, no rollover). Batch related changes into one push to `main`, and tell the user before pushing. Do work-in-progress on another branch only if branch deploys are confirmed free; otherwise keep it local until it is ready.
- Before pushing: `git pull`, run the page in a browser locally, and check that the latest Netlify deploy came from a commit already in `main`. If one did not, stop and merge that deploy's files into `main` first. An earlier session's deploy was overwritten this way once.
- Leaderboard scores live in Netlify Blobs, not in this repository. Never write test scores to the production store; test the function locally with `BlobsServer` from `@netlify/blobs/server`.
- When adding a game, also add its key and a score ceiling to `MAX_SCORE` in `netlify/functions/scores.mjs`.
