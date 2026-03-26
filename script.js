const grid = document.getElementById('grid');
const counter = document.getElementById('project-count');

async function getTitleFromIframe(iframe, fallbackTitle) {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => resolve(fallbackTitle), 2000);

    iframe.addEventListener('load', () => {
      clearTimeout(timeout);
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!doc) return resolve(fallbackTitle);

        const title = doc.querySelector('title')?.textContent?.trim()
          || doc.querySelector('h1')?.textContent?.trim()
          || fallbackTitle;

        resolve(title);
      } catch {
        resolve(fallbackTitle);
      }
    }, { once: true });
  });
}

function slugToTitle(filename) {
  return filename
    .replace(/\.html$/i, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function createCard(file, index) {
  const path = `Projects/${file}`;
  const fallback = slugToTitle(file);

  const card = document.createElement('article');
  card.className = 'card';

  // Preview
  const previewWrap = document.createElement('div');
  previewWrap.className = 'card-preview';

  const iframe = document.createElement('iframe');
  iframe.loading = 'lazy';
  iframe.title = fallback;
  iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
  previewWrap.appendChild(iframe);

  // Info
  const info = document.createElement('div');
  info.className = 'card-info';

  const idx = document.createElement('span');
  idx.className = 'card-index';
  idx.textContent = String(index + 1).padStart(2, '0');

  const titleEl = document.createElement('span');
  titleEl.className = 'card-title';
  titleEl.textContent = fallback;

  const link = document.createElement('a');
  link.className = 'card-link';
  link.href = path;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = 'Open';

  info.appendChild(idx);
  info.appendChild(titleEl);
  info.appendChild(link);

  card.appendChild(previewWrap);
  card.appendChild(info);

  // Set iframe src and resolve real title after load
  iframe.src = path;
  getTitleFromIframe(iframe, fallback).then(title => {
    titleEl.textContent = title;
    iframe.title = title;
    link.setAttribute('aria-label', `Open ${title}`);
  });

  return card;
}

async function init() {
  try {
    const res = await fetch('Projects/index.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const files = await res.json();

    if (!Array.isArray(files) || files.length === 0) {
      grid.innerHTML = '<p class="empty">No projects found.</p>';
      counter.textContent = '0';
      return;
    }

    counter.textContent = files.length;

    files.forEach((file, i) => {
      grid.appendChild(createCard(file, i));
    });

  } catch (err) {
    console.error('Failed to load projects:', err);
    grid.innerHTML = '<p class="empty">Could not load Projects/index.json</p>';
  }
}

init();
