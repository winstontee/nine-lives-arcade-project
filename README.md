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

Netlify is linked to this repository. Every push to `main` deploys the live site automatically (about 15 Netlify credits each on the free plan), so batch changes into one push.

```bash
git pull
npm install
# make and test changes locally, then:
git push origin main
```

Nothing else should deploy the site. If the newest deploy in Netlify isn't from a commit in `main`, merge its files into `main` before pushing.
