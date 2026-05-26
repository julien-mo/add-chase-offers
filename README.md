# Add Chase Offers

Bookmarklet that walks the Chase Offers grid and adds every available offer to your card.

## Install

**Drag-to-install (recommended):** open `index.html` and drag the green "Add Chase Offers" button onto your bookmarks bar. If you publish this repo via GitHub Pages, the page is hosted at `https://<your-username>.github.io/add-chase-offers/`.

**Manual:**

1. Create a new browser bookmark.
2. Name it "Add Chase Offers".
3. For the URL, paste the entire contents of `bookmarklet.txt`.
4. Save.

## Use

1. Log into Chase, open your card's **Offers** page (the grid of tiles).
2. Click the bookmark.
3. Watch the console (DevTools → Console). When it logs `added all!`, every available offer has been added.

## How it works

- Polls `.offerTileGridItemContainer` for tiles that haven't been clicked yet.
- Tracks tiles by merchant logo URL so the script doesn't reclick a tile after Chase re-renders it with an "Added" state.
- Patches `window.fetch` and `XMLHttpRequest` to dedupe identical POST/PUT/PATCH requests within an 8s window. Chase's detail page fires its add effect twice on mount; this drops the duplicate at the network layer.
- Randomized delays between actions give the SPA time to mount and re-render between clicks.
