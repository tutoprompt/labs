const grid = document.getElementById("grid");
const counter = document.getElementById("project-count");

console.log("Script initialized. Grid:", grid, "Counter:", counter);

function slugToTitle(filename) {
  if (typeof filename === "object" && filename !== null) {
    if (filename.title) return filename.title;
    if (filename.url) {
      const parts = filename.url.split("/");
      return slugToTitle(parts[parts.length - 1]);
    }
    return "Untitled Project";
  }

  return filename
    .replace(/\.html$/i, "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}

function createCard(item, index) {
  let path, title, htmlFilename;
  
  if (typeof item === "object" && item !== null) {
    path = item.url;
    if (!path.startsWith("Projects/")) {
        path = `Projects/${path}`;
    }
    htmlFilename = item.url.split("/").pop();
    title = item.title || slugToTitle(item.url);
  } else {
    path = `Projects/${item}`;
    htmlFilename = item;
    title = slugToTitle(item);
  }

  console.log(`Creating card ${index}:`, { title, path, htmlFilename });

  const card = document.createElement("article");
  card.className = "card";

  const previewWrap = document.createElement("div");
  previewWrap.className = "card-preview";
  
  // Criar elemento de vídeo
  const video = document.createElement("video");
  video.className = "card-video";
  video.autoplay = true;
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = "metadata";
  video.controls = false;
  
  // Extrair nome base do arquivo (sem extensão)
  const baseName = htmlFilename.replace(/\.html$/i, "");
  
  // Extensões de vídeo suportadas
  const videoExtensions = ["mp4", "webm", "mov", "avi", "mkv"];
  
  // Criar sources para cada extensão
  videoExtensions.forEach(ext => {
    const source = document.createElement("source");
    source.src = `Projects/${baseName}.${ext}`;
    source.type = `video/${ext === "mkv" ? "x-matroska" : ext}`;
    video.appendChild(source);
  });
  
  previewWrap.appendChild(video);

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
  link.href = path;
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

async function init() {
  console.log("Fetching Projects/index.json...");
  try {
    const res = await fetch("Projects/index.json");
    console.log("Response status:", res.status);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const files = await res.json();
    console.log("Files loaded:", files);
    
    if (!Array.isArray(files) || files.length === 0) {
      grid.innerHTML = "<p class=\"empty\">No projects found.</p>";
      counter.textContent = "0";
      return;
    }

    counter.textContent = files.length;
    grid.innerHTML = "";
    
    files.forEach((file, i) => {
      grid.appendChild(createCard(file, i));
    });
    console.log("Grid populated with video previews.");
  } catch (err) {
    console.error("Failed to load projects:", err);
    grid.innerHTML = `<p class=\"empty\">Error: ${err.message}</p>`;
  }
}

init();
