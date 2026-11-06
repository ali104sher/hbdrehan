// CHANGE THIS if your real shared code word is different.
const CODE_WORD = "gujarat";

const lockScreen = document.getElementById("lockScreen");
const mainSite = document.getElementById("mainSite");
const unlockForm = document.getElementById("unlockForm");
const codeInput = document.getElementById("codeInput");
const lockMessage = document.getElementById("lockMessage");

unlockForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (codeInput.value.trim().toLowerCase() === CODE_WORD.toLowerCase()) {
    lockMessage.textContent = "";
    lockScreen.classList.add("unlocking");
    lockScreen.style.transition = "opacity .8s ease, transform .8s ease";
    lockScreen.style.opacity = "0";
    lockScreen.style.transform = "scale(1.04)";
    setTimeout(() => {
      lockScreen.remove();
      mainSite.classList.remove("hidden");
      document.body.classList.remove("locked");
      startRevealObserver();
      sprinkleConfetti();
    }, 750);
  } else {
    lockMessage.textContent = "Not quite, brother. Think Gujarat 😉";
    codeInput.value = "";
    codeInput.focus();
  }
});

document.body.classList.add("locked");

// Build the 15-photo album. Add photos/1.jpg through photos/15.jpg.
const photoGrid = document.getElementById("photoGrid");
const captions = [
  "The good old days", "Partners in crime", "A proper classic",
  "School-time legends", "One for the memories", "The smiles say it all",
  "Brotherhood archive", "A moment to keep", "Pure nostalgia",
  "The usual suspects", "Another favourite", "No caption needed",
  "Forever in the album", "The memories stay", "To many more"
];
for (let i = 1; i <= 12; i++) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "photo-card reveal";
  card.setAttribute("aria-label", `Open memory ${i}`);
  const img = document.createElement("img");
  img.src = `photos/${i}.jpg`;
  img.alt = `Memory ${i}`;
  img.loading = "lazy";
  img.onerror = () => {
    img.remove();
    const placeholder = document.createElement("div");
    placeholder.className = "photo-placeholder";
    placeholder.innerHTML = `YOUR PHOTO ${String(i).padStart(2, "0")}<br><small>photos/${i}.jpg</small>`;
    card.insertBefore(placeholder, card.firstChild);
  };
  const label = document.createElement("span");
  label.className = "photo-label";
  label.textContent = captions[i - 1];
  card.append(img, label);
  card.addEventListener("click", () => openLightbox(i));
  photoGrid.appendChild(card);
}

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
let currentPhoto = 1;
function openLightbox(index) {
  currentPhoto = index;
  showPhoto();
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
}
function showPhoto() {
  lightboxImage.src = `photos/${currentPhoto}.jpg`;
  lightboxCaption.textContent = `${String(currentPhoto).padStart(2, "0")} / 15  ·  ${captions[currentPhoto - 1]}`;
}
function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
}
function movePhoto(direction) {
  currentPhoto = ((currentPhoto - 1 + direction + 15) % 15) + 1;
  showPhoto();
}
document.getElementById("closeLightbox").addEventListener("click", closeLightbox);
document.getElementById("prevPhoto").addEventListener("click", () => movePhoto(-1));
document.getElementById("nextPhoto").addEventListener("click", () => movePhoto(1));
lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", e => {
  if (!lightbox.classList.contains("open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") movePhoto(-1);
  if (e.key === "ArrowRight") movePhoto(1);
});

// Browsers require a user gesture before music can start.
const music = document.getElementById("backgroundMusic");
const musicToggle = document.getElementById("musicToggle");
const musicLabel = document.getElementById("musicLabel");
musicToggle.addEventListener("click", async () => {
  if (music.paused) {
    try {
      await music.play();
      musicToggle.classList.add("playing");
      musicLabel.textContent = "Pause soundtrack";
    } catch {
      musicLabel.textContent = "Tap to try music";
    }
  } else {
    music.pause();
    musicToggle.classList.remove("playing");
    musicLabel.textContent = "Play our soundtrack";
  }
});

function startRevealObserver() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
}
function sprinkleConfetti() {
  const symbols = ["✦", "✧", "✳", "·"];
  for (let i = 0; i < 32; i++) {
    const bit = document.createElement("span");
    bit.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    Object.assign(bit.style, {
      position: "fixed", zIndex: "15", top: "-30px",
      left: `${Math.random() * 100}%`,
      color: ["#ff8db6", "#ffd58a", "#b9a3ff"][i % 3],
      fontSize: `${10 + Math.random() * 16}px`,
      pointerEvents: "none",
      transition: `transform ${2.5 + Math.random() * 2}s linear, opacity 3.5s ease`
    });
    document.body.appendChild(bit);
    requestAnimationFrame(() => {
      bit.style.transform = `translateY(${window.innerHeight + 80}px) rotate(${Math.random() * 600}deg)`;
      bit.style.opacity = "0";
    });
    setTimeout(() => bit.remove(), 5000);
  }
}
