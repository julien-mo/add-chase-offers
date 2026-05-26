(async () => {
  if (!window.__chaseOffersDedupe) {
    window.__chaseOffersDedupe = 1;
    const sent = new Map();
    const isDup = key => {
      const now = Date.now();
      const last = sent.get(key);
      sent.set(key, now);
      return last && now - last < 8000;
    };

    const origFetch = window.fetch;
    window.fetch = function (url, opts) {
      const method = opts?.method || '';
      if (/^(POST|PUT|PATCH)$/i.test(method)) {
        const key = (typeof url === 'string' ? url : url.url) + '|' + (opts.body || '');
        if (isDup(key)) return Promise.resolve(new Response('{}', { status: 200 }));
      }
      return origFetch.apply(this, arguments);
    };

    const origOpen = XMLHttpRequest.prototype.open;
    const origSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function (method, url) {
      this._method = method;
      this._url = url;
      return origOpen.apply(this, arguments);
    };
    XMLHttpRequest.prototype.send = function (body) {
      if (/^(POST|PUT|PATCH)$/i.test(this._method || '')) {
        const key = this._url + '|' + (typeof body === 'string' ? body : '');
        if (isDup(key)) return;
      }
      return origSend.apply(this, arguments);
    };
  }

  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const rand = (min, max) => Math.random() * (max - min) + min;
  const TILE_SELECTOR = '.offerTileGridItemContainer';
  const done = new Set();
  const keyOf = el => el.querySelector('img')?.src || el.textContent.trim().slice(0, 80);

  while (true) {
    let tiles = [];
    for (let i = 0; i < 40 && !tiles.length; i++) {
      tiles = [...document.querySelectorAll(TILE_SELECTOR)].filter(el => !done.has(keyOf(el)));
      if (!tiles.length) await sleep(250);
    }
    if (!tiles.length) return;
    const tile = tiles[0];
    done.add(keyOf(tile));
    tile.childNodes[0].click();
    await sleep(rand(700, 1200));
    window.history.back();
    await sleep(rand(400, 800));
  }
})();
