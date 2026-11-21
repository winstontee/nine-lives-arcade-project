# Instructions for Claude sessions working on Nine Lives Arcade

- This GitHub repository is the single source of truth. Never deploy the site from files that are not committed and pushed to `main`.
- Before any deploy: `git pull`, then list the latest Netlify deploy (site id `1c81f834-3929-4c65-becb-ac9e7a9139e1`). If it was not made from the current `main` (compare the deploy title with the latest commit), stop, recover that deploy's files, and merge them into `main` first. An earlier session's deploy was overwritten this way once.
- Commit and push every change before deploying it, and use the commit subject as the deploy `--message`.
- Leaderboard scores live in Netlify Blobs, not in this repository. Never write test scores to the production store; test the function locally with `BlobsServer` from `@netlify/blobs/server`.
- When adding a game, also add its key and a score ceiling to `MAX_SCORE` in `netlify/functions/scores.mjs`.
