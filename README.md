# Nine Lives Arcade

Five quick browser games about cats, with a nickname leaderboard.
Live at https://nine-lives-arcade.netlify.app

| Game | Link |
| --- | --- |
| Knock It Off | `/#knock` |
| Laser Pounce | `/#laser` |
| If It Fits, I Sits | `/#box` |
| Catch the Sun | `/#sun` |
| Dry Paws | `/#river` |

## Layout

- `site/index.html` is the whole front end: all five games, the page, and the leaderboard panel.
- `netlify/functions/scores.mjs` is the leaderboard API (`/api/scores`, also answers on `/api/board`). It stores the top 50 per game in Netlify Blobs (store `leaderboard`) and rate-limits submissions per hashed IP (store `leaderboard-limits`).
- `promo/` holds the 22-second square promo video and its cover image.

## Deploying

This repository is the only source of truth for the site. Deploy from an up-to-date `main`, never from a copy that hasn't been pulled.

```bash
git pull
npm install
npx netlify-cli deploy --prod --no-build --dir site --functions netlify/functions --message "<what changed>"
```

Before deploying, check that the newest deploy in Netlify was made from this repository's current `main`. If someone deployed something that isn't in `main`, merge it in first.
