// ── Config ──────────────────────────────────────────────
const GITHUB_USER = "tutoprompt";
const GITHUB_REPO = "labs";
const PROJECTS_PATH = "docs/Projects";
const API_URL = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${PROJECTS_PATH}`;

// ── DOM ─────────────────────────────────────────────────
const grid = document.getElementById("grid");
const counter = document.getElementById("project-count");

// ── Helpers ─────────────────────────────────────────────
function slugToTitle(filename) {
  return filename
    .replace(/\.html$/i, "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}

function createCard(name, index) {
  const baseName = name.replace(/\.html$/i, "");
  const title = slugToTitle(name);
  const htmlPath = `Projects/${name}`;
  const videoExts = ["mp4", "webm", "mov"];

  const card = document.createElement("article");
  card.className = "card";

  // Preview
  const previewWrap = document.createElement("div");
  previewWrap.className = "card-preview";

  const video = document.createElement("video");
  video.className = "card-video";
  video.autoplay = true;
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = "metadata";
  video.controls = false;

  videoExts.forEach(ext => {
    const source = document.createElement("source");
    source.src = `Projects/${baseName}.${ext}`;
    source.type = `video/${ext}`;
    video.appendChild(source);
  });

  previewWrap.appendChild(video);

  // Info
  const info = document.createElement("div");
  info.className = "card-info";

  const idx = document.createElement("span");
  idx.className = "card-index";
  idx.textContent = String(index + 1).padStart(2, "0");

  const titleEl = document.createElement("span");
  titleEl.className = "card-title";
  titleEl.textContent = title;

  const link = document.createElement("a");
  link.className = "card-link";
  link.href = htmlPath;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "Open";

  info.appendChild(idx);
  info.appendChild(titleEl);
  info.appendChild(link);

  card.appendChild(previewWrap);
  card.appendChild(info);

  return card;
}

// ── Init ────────────────────────────────────────────────
async function init() {
  try {
    const res = await fetch(API_URL, {
      headers: { "Accept": "application/vnd.github.v3+json" }
    });

    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

    const files = await res.json();

    // Filtra só arquivos .html, ignora index.html e index.json
    const projects = files
      .filter(f => f.type === "file" && /\.html$/i.test(f.name) && f.name.toLowerCase() !== "index.html")
      .sort((a, b) => a.name.localeCompare(b.name));

    if (projects.length === 0) {
      grid.innerHTML = `<p class="empty">No projects found.</p>`;
      if (counter) counter.textContent = "0";
      return;
    }

    if (counter) counter.textContent = projects.length;
    grid.innerHTML = "";

    projects.forEach((file, i) => {
      grid.appendChild(createCard(file.name, i));
    });

  } catch (err) {
    console.error("Failed to load projects:", err);

    // Fallback: tenta index.json local se a API falhar (ex: offline)
    try {
      const res = await fetch("Projects/index.json");
      if (!res.ok) throw new Error("index.json also unavailable");
      const files = await res.json();
      if (counter) counter.textContent = files.length;
      grid.innerHTML = "";
      files.forEach((item, i) => {
        const name = item.url ? item.url.split("/").pop() : item;
        grid.appendChild(createCard(name, i));
      });
    } catch {
      grid.innerHTML = `<p class="empty">Could not load projects. Check your connection.</p>`;
    }
  }
}

init();
