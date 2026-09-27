const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");
const plannerPage = document.getElementById("plannerPage");
const datePage = document.getElementById("datePage");
const hint = document.getElementById("hint");
const buttonRow = document.querySelector(".button-row");
const dateForm = document.getElementById("dateForm");
const laterButton = document.getElementById("laterButton");
const favoriteMessageTrigger = document.getElementById("favoriteMessageTrigger");
const favoriteMessageModal = document.getElementById("favoriteMessageModal");
const closeFavoriteMessage = document.getElementById("closeFavoriteMessage");
const laterMessageModal = document.getElementById("laterMessageModal");
const closeLaterMessage = document.getElementById("closeLaterMessage");
const laterMessageConfirm = document.getElementById("laterMessageConfirm");
const laterMessageImage = document.getElementById("laterMessageImage");
const laterMessageTitle = document.getElementById("laterMessageTitle");
const laterMessageText = document.getElementById("laterMessageText");
const finalDateText = document.getElementById("finalDateText");
const finalTimeText = document.getElementById("finalTimeText");
const finalPlaceText = document.getElementById("finalPlaceText");
const previewSummary = document.getElementById("previewSummary");
const ourDateNote = document.getElementById("ourDateNote");
const downloadDateButton = document.getElementById("downloadDateButton");
const galleryTrigger = document.getElementById("galleryTrigger");
const galleryModal = document.getElementById("galleryModal");
const closeGallery = document.getElementById("closeGallery");
const typingLines = document.querySelectorAll(".typing-line");
const dateInput = document.getElementById("dateInput");
const timeInput = document.getElementById("timeInput");
const placeInput = document.getElementById("placeInput");

let audioContext = null;
let musicIntervalId = null;
let heartRainIntervalId = null;

/*
  ============================================================
  AUDIO SETUP
  ============================================================

  Your actual folder structure is:

  Sheehan/
  ├── music.mp3/
  │   ├── syempre.mp3
  │   └── syempre.wav
  ├── index.html
  ├── script.js
  └── style.css

  Therefore the correct path is:

  music.mp3/syempre.mp3
*/

let galleryAudio = document.getElementById("galleryAudio");

if (!galleryAudio) {
  galleryAudio = document.createElement("audio");
  galleryAudio.id = "galleryAudio";

  // Your actual MP3 file
  galleryAudio.src = "music.mp3/syempre.mp3";

  galleryAudio.preload = "auto";
  galleryAudio.loop = true;
  galleryAudio.volume = 0.35;

  document.body.appendChild(galleryAudio);
} else {
  // If an audio element already exists in your HTML,
  // force it to use the correct file path.
  galleryAudio.src = "music.mp3/syempre.mp3";
  galleryAudio.preload = "auto";
  galleryAudio.loop = true;
  galleryAudio.volume = 0.35;
}

/*
  ============================================================
  MESSAGES
  ============================================================
*/

const messages = [
  "Choose carefully... hehe.",
  "Are you sure? 👀",
  "The button is running away...",
  "Nice try. 😂",
  "You really want to say no?",
  "The NO button does not give up.",
  "I’ll keep asking until you say yes. ♡"
];

const laterMessages = [
  {
    title: "Take your time",
    text: "No rush, I’ll still be here when your heart is ready. ♡",
    image: "image/she2.jpg"
  },
  {
    title: "I’m patient",
    text: "You don’t have to decide right this second. I just wanted you to know I care. ♥",
    image: "image/she3.jpg"
  },
  {
    title: "I’ll wait",
    text: "I can be patient and still be excited about us. We’ve got time.",
    image: "image/she5.jpg"
  },
  {
    title: "A little more time",
    text: "That’s okay. I’ll keep this smile for you until you’re ready to say yes.",
    image: "image/she6.jpg"
  }
];

let noClicks = 0;

/*
  ============================================================
  TYPING EFFECT
  ============================================================
*/

function typeText(element, text, delay = 80) {
  let index = 0;

  element.textContent = "";
  element.classList.remove("finished");

  const timer = setInterval(() => {
    index += 1;
    element.textContent = text.slice(0, index);

    if (index >= text.length) {
      clearInterval(timer);
      element.classList.add("finished");
    }
  }, delay);
}

function animateTyping() {
  if (!typingLines.length) return;

  const lines = [...typingLines].map((line) => line.dataset.text || "");

  lines.forEach((line, index) => {
    setTimeout(() => {
      typeText(typingLines[index], line, 70);
    }, index * 500);
  });
}

/*
  ============================================================
  DATE FORMATTING
  ============================================================
*/

function formatDate(value) {
  if (!value) return "Saturday, October 10, 2026";

  const date = new Date(`${value}T12:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}

function formatTime(value) {
  if (!value) return "6:00 PM";

  const [hours, minutes] = value.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  const twelveHour = ((hours + 11) % 12) + 1;

  return `${twelveHour}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

/*
  ============================================================
  NO BUTTON
  ============================================================
*/

function moveNoButton() {
  if (!buttonRow || !noButton) return;

  noButton.style.position = "absolute";
  noButton.style.left = "0px";
  noButton.style.top = "0px";
  noButton.style.transform = "none";

  const rowRect = buttonRow.getBoundingClientRect();
  const buttonWidth = noButton.offsetWidth;
  const buttonHeight = noButton.offsetHeight;

  const maxX = Math.max(rowRect.width - buttonWidth - 30, 0);
  const maxY = Math.max(rowRect.height - buttonHeight - 20, 0);

  const randomX = Math.random() * maxX;
  const randomY = Math.random() * maxY;

  noButton.style.left = `${randomX}px`;
  noButton.style.top = `${randomY}px`;

  noClicks += 1;

  if (noClicks < messages.length) {
    hint.textContent = messages[noClicks];
  } else {
    hint.textContent = "Okay... I’m still waiting for that YES. ♡";
  }

  const scale = Math.max(0.7, 1 - noClicks * 0.04);

  noButton.style.transform =
    `scale(${scale}) rotate(${(Math.random() - 0.5) * 12}deg)`;
}

/*
  ============================================================
  FLOATING HEARTS
  ============================================================
*/

function createDateBackgroundHearts() {
  const heartLayer = document.querySelector(".floating-hearts-layer");

  if (!heartLayer) return;

  heartLayer.innerHTML = "";

  for (let i = 0; i < 42; i += 1) {
    const heart = document.createElement("span");
    const symbols = ["♡", "♥", "❤"];

    heart.textContent =
      symbols[Math.floor(Math.random() * symbols.length)];

    heart.className = "floating-heart";

    heart.style.left = `${Math.random() * 100}%`;
    heart.style.top = `${Math.random() * 100}%`;
    heart.style.fontSize = `${18 + Math.random() * 26}px`;

    heart.style.setProperty(
      "--drift-x",
      `${(Math.random() - 0.5) * 260}px`
    );

    heart.style.setProperty(
      "--spin",
      `${(Math.random() - 0.5) * 220}deg`
    );

    heart.style.animationDelay = `${Math.random() * 3}s`;
    heart.style.animationDuration = `${5 + Math.random() * 5}s`;

    heartLayer.appendChild(heart);
  }
}

/*
  ============================================================
  DOWNLOAD DATE CARD
  ============================================================
*/

function downloadDateCardImage() {
  const canvas = document.createElement("canvas");

  canvas.width = 1200;
  canvas.height = 1600;

  const ctx = canvas.getContext("2d");

  if (!ctx) return;

  const gradient = ctx.createLinearGradient(
    0,
    0,
    canvas.width,
    canvas.height
  );

  gradient.addColorStop(0, "#fff7f8");
  gradient.addColorStop(1, "#fff0ed");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(223, 114, 133, 0.10)";

  for (let i = 0; i < 12; i += 1) {
    const x = 100 + Math.random() * 1000;
    const y = 200 + Math.random() * 1100;

    ctx.beginPath();
    ctx.arc(
      x,
      y,
      110 + Math.random() * 80,
      0,
      Math.PI * 2
    );

    ctx.fill();
  }

  const cardX = 120;
  const cardY = 190;
  const cardW = 960;
  const cardH = 1220;

  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "rgba(223, 114, 133, 0.14)";
  ctx.lineWidth = 3;

  roundedRect(
    ctx,
    cardX,
    cardY,
    cardW,
    cardH,
    42
  );

  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#df7285";
  ctx.font = '700 42px "DM Sans", sans-serif';
  ctx.textAlign = "center";

  ctx.fillText(
    "IT’S A DATE",
    canvas.width / 2,
    300
  );

  ctx.fillStyle = "#2f2a2b";
  ctx.font = '700 86px "Playfair Display", serif';

  ctx.fillText(
    "You + Me",
    canvas.width / 2,
    420
  );

  ctx.fillStyle = "#df7285";
  ctx.font = '700 34px "DM Sans", sans-serif';

  ctx.fillText(
    "OUR DATE",
    canvas.width / 2,
    520
  );

  const dateText =
    finalDateText?.textContent ||
    "Saturday, October 10, 2026";

  const timeText =
    finalTimeText?.textContent ||
    "6:00 PM";

  const placeText =
    finalPlaceText?.textContent ||
    "Rooftop dinner";

  ctx.fillStyle = "#2f2a2b";
  ctx.font = '600 52px "DM Sans", sans-serif';
  ctx.textAlign = "left";

  wrapText(
    ctx,
    dateText,
    210,
    620,
    760,
    54
  );

  wrapText(
    ctx,
    timeText,
    210,
    700,
    760,
    54
  );

  wrapText(
    ctx,
    placeText,
    210,
    780,
    760,
    54
  );

  ctx.fillStyle = "#df7285";
  ctx.font = '700 30px "DM Sans", sans-serif';
  ctx.textAlign = "center";

  ctx.fillText(
    "See you there",
    canvas.width / 2,
    1080
  );

  ctx.fillStyle = "#ee8ea1";
  ctx.font = '600 96px serif';

  ctx.fillText(
    "♡",
    canvas.width / 2,
    1180
  );

  const link = document.createElement("a");

  link.download = "our-date-card.png";
  link.href = canvas.toDataURL("image/png");

  link.click();
}

/*
  ============================================================
  ROUNDED RECTANGLE
  ============================================================
*/

function roundedRect(
  context,
  x,
  y,
  width,
  height,
  radius
) {
  context.beginPath();

  context.moveTo(
    x + radius,
    y
  );

  context.lineTo(
    x + width - radius,
    y
  );

  context.quadraticCurveTo(
    x + width,
    y,
    x + width,
    y + radius
  );

  context.lineTo(
    x + width,
    y + height - radius
  );

  context.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radius,
    y + height
  );

  context.lineTo(
    x + radius,
    y + height
  );

  context.quadraticCurveTo(
    x,
    y + height,
    x,
    y + height - radius
  );

  context.lineTo(
    x,
    y + radius
  );

  context.quadraticCurveTo(
    x,
    y,
    x + radius,
    y
  );

  context.closePath();
}

/*
  ============================================================
  WRAP TEXT
  ============================================================
*/

function wrapText(
  context,
  text,
  x,
  y,
  maxWidth,
  lineHeight
) {
  const words = text.split(" ");

  let line = "";
  let currentY = y;

  for (let i = 0; i < words.length; i += 1) {
    const testLine =
      `${line}${words[i]} `;

    const metrics =
      context.measureText(testLine);

    if (
      metrics.width > maxWidth &&
      i > 0
    ) {
      context.fillText(
        line,
        x,
        currentY
      );

      line = `${words[i]} `;
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }

  context.fillText(
    line.trim(),
    x,
    currentY
  );
}

/*
  ============================================================
  AUDIO
  ============================================================

  IMPORTANT:
  The original code was looking for:

      document.getElementById("galleryAudio")

  But you said there is no <audio id="galleryAudio">
  in your HTML.

  So we create the audio element here automatically.

  Your actual file is:

      music.mp3/syempre.mp3
  ============================================================
*/

function ensureAudioContext() {
  const AudioCtor =
    window.AudioContext ||
    window.webkitAudioContext;

  if (!AudioCtor) return null;

  if (!audioContext) {
    audioContext = new AudioCtor();
  }

  if (
    audioContext.state === "suspended"
  ) {
    audioContext.resume();
  }

  return audioContext;
}

/*
  Stop the music
*/

function stopBackgroundMusic() {
  if (musicIntervalId) {
    clearInterval(musicIntervalId);
    musicIntervalId = null;
  }

  if (galleryAudio) {
    galleryAudio.pause();
    galleryAudio.currentTime = 0;
  }
}

/*
  Play the local music
*/

async function playLocalGalleryMusic() {
  if (!galleryAudio) {
    console.error(
      "Gallery audio element does not exist."
    );

    return false;
  }

  galleryAudio.volume = 0.35;
  galleryAudio.muted = false;
  galleryAudio.loop = true;

  try {
    await galleryAudio.play();

    console.log(
      "syempre.mp3 started successfully."
    );

    return true;
  } catch (error) {
    console.error(
      "Music failed to play:",
      error
    );

    console.error(
      "Make sure this file exists:",
      "music.mp3/syempre.mp3"
    );

    return false;
  }
}

/*
  Start background music

  This uses the exact folder structure
  from your VS Code screenshot.
*/

function startBackgroundMusic() {
  if (!galleryAudio) {
    console.error(
      "Audio element is missing."
    );

    return;
  }

  // Your MP3 is inside the folder named "music.mp3"
  galleryAudio.src =
    "music.mp3/syempre.mp3";

  galleryAudio.volume = 0.35;
  galleryAudio.loop = true;
  galleryAudio.muted = false;

  /*
    IMPORTANT:
    Do NOT wait for "canplay" here.

    The YES button click is a user interaction,
    so we attempt to play the music immediately.
  */

  playLocalGalleryMusic();
}

/*
  ============================================================
  SPARKLES
  ============================================================
*/

function createSparkles() {
  for (let i = 0; i < 18; i += 1) {
    const sparkle =
      document.createElement("span");

    sparkle.className = "sparkle";

    sparkle.style.left =
      `${Math.random() * 100}vw`;

    sparkle.style.top =
      `${Math.random() * 100}vh`;

    sparkle.style.animationDelay =
      `${Math.random() * 2}s`;

    sparkle.style.opacity =
      `${0.3 + Math.random() * 0.7}`;

    document.body.appendChild(
      sparkle
    );

    setTimeout(
      () => sparkle.remove(),
      3000
    );
  }
}

/*
  ============================================================
  BURST EFFECT
  ============================================================
*/

function createBurst() {
  const colors = [
    "#f5a7b5",
    "#f8d7a1",
    "#f5c7d9",
    "#f4b9ae"
  ];

  for (let i = 0; i < 18; i += 1) {
    const burst =
      document.createElement("span");

    burst.textContent = "✦";

    burst.style.position = "fixed";

    burst.style.left =
      `${50 + (Math.random() - 0.5) * 30}vw`;

    burst.style.top =
      `${50 + (Math.random() - 0.5) * 30}vh`;

    burst.style.color =
      colors[
        Math.floor(
          Math.random() * colors.length
        )
      ];

    burst.style.fontSize =
      `${14 + Math.random() * 22}px`;

    burst.style.pointerEvents =
      "none";

    burst.style.zIndex =
      "200";

    burst.style.transition =
      "all 1.6s ease";

    burst.style.opacity = "1";

    document.body.appendChild(
      burst
    );

    requestAnimationFrame(() => {
      const x =
        (Math.random() - 0.5) * 220;

      const y =
        -120 - Math.random() * 180;

      burst.style.transform =
        `translate(${x}px, ${y}px) rotate(${(Math.random() - 0.5) * 200}deg)`;

      burst.style.opacity = "0";
    });

    setTimeout(
      () => burst.remove(),
      1600
    );
  }
}

/*
  ============================================================
  HEARTS
  ============================================================
*/

function createHearts() {
  const symbols = [
    "♡",
    "♥",
    "❤"
  ];

  const heartColors = [
    "#ee8ea1",
    "#f7a7b5",
    "#f9c7d7",
    "#ffc7a8"
  ];

  for (let i = 0; i < 32; i += 1) {
    const heart = document.createElement("span");

    heart.textContent =
      symbols[Math.floor(Math.random() * symbols.length)];

    heart.style.position = "fixed";
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.top = `${-20 - Math.random() * 24}vh`;
    heart.style.color = heartColors[Math.floor(Math.random() * heartColors.length)];
    heart.style.fontSize = `${14 + Math.random() * 28}px`;
    heart.style.zIndex = "220";
    heart.style.pointerEvents = "none";
    heart.style.opacity = "0";
    heart.style.filter = "drop-shadow(0 0 8px rgba(238, 142, 161, 0.5))";
    heart.style.transition = "transform 4.5s linear, opacity 4.5s linear";

    document.body.appendChild(heart);

    requestAnimationFrame(() => {
      const driftX = (Math.random() - 0.5) * 360;
      const driftY = window.innerHeight + 200;
      const rotate = (Math.random() - 0.5) * 300;

      heart.style.transform = `translate(${driftX}px, ${driftY}px) rotate(${rotate}deg)`;
      heart.style.opacity = "1";
    });

    setTimeout(() => heart.remove(), 5200);
  }
}

function startHeartRain() {
  stopHeartRain();
  createHearts();

  heartRainIntervalId = setInterval(() => {
    createHearts();
  }, 150);
}

function stopHeartRain() {
  if (heartRainIntervalId) {
    clearInterval(heartRainIntervalId);
    heartRainIntervalId = null;
  }
}

/*
  ============================================================
  DATE PREVIEW
  ============================================================
*/

function updateDatePreview() {
  const dateValue =
    dateInput.value;

  const timeValue =
    timeInput.value;

  const placeValue =
    placeInput.value.trim();

  const dateText =
    formatDate(dateValue);

  const timeText =
    formatTime(timeValue);

  const placeText =
    placeValue ||
    "rooftop dinner";

  const summary =
    `${dateText} at ${timeText} — ${placeText}`;

  if (previewSummary) {
    previewSummary.textContent =
      summary;
  }

  if (ourDateNote) {
    ourDateNote.textContent =
      summary;
  }

  if (
    finalDateText &&
    finalTimeText &&
    finalPlaceText
  ) {
    finalDateText.textContent =
      dateText;

    finalTimeText.textContent =
      timeText;

    finalPlaceText.textContent =
      placeText;
  }
}

/*
  ============================================================
  NO BUTTON CLICK
  ============================================================
*/

noButton.addEventListener(
  "click",
  (event) => {
    event.preventDefault();
    moveNoButton();
  }
);

/*
  ============================================================
  NO BUTTON HOVER
  ============================================================
*/

noButton.addEventListener(
  "mouseenter",
  () => {
    if (noClicks > 0) {
      moveNoButton();
    }
  }
);

/*
  ============================================================
  YES / HEART BUTTON
  ============================================================

  THIS IS THE IMPORTANT AUDIO FIX.

  The music starts directly from the YES click.
  This is much more reliable because the browser
  considers this a user interaction.
  ============================================================
*/

yesButton.addEventListener(
  "click",
  () => {
    hint.textContent =
      "Yay! I’m so happy. ♡";

    createBurst();
    createSparkles();

    /*
      START MUSIC HERE
    */
    startBackgroundMusic();

    plannerPage.classList.add(
      "show"
    );

    document.body.style.overflow =
      "hidden";
  }
);

/*
  ============================================================
  LATER BUTTON
  ============================================================
*/

function showFavoriteMessage() {
  if (!favoriteMessageModal) return;

  favoriteMessageModal.classList.add("show");
  favoriteMessageModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function showLaterMessage() {
  if (!laterMessageModal) return;

  const chosenMessage = laterMessages[Math.floor(Math.random() * laterMessages.length)];

  if (laterMessageTitle) {
    laterMessageTitle.textContent = chosenMessage.title;
  }

  if (laterMessageText) {
    laterMessageText.textContent = chosenMessage.text;
  }

  if (laterMessageImage) {
    laterMessageImage.src = chosenMessage.image;
    laterMessageImage.alt = chosenMessage.title;
  }

  laterMessageModal.classList.add("show");
  laterMessageModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

if (favoriteMessageTrigger) {
  favoriteMessageTrigger.addEventListener("click", () => {
    showFavoriteMessage();
  });
}

if (closeFavoriteMessage && favoriteMessageModal) {
  closeFavoriteMessage.addEventListener("click", () => {
    favoriteMessageModal.classList.remove("show");
    favoriteMessageModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  });
}

if (favoriteMessageModal) {
  favoriteMessageModal.addEventListener("click", (event) => {
    if (event.target === favoriteMessageModal || event.target.matches("[data-close-favorite-message]")) {
      favoriteMessageModal.classList.remove("show");
      favoriteMessageModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
  });
}

laterButton.addEventListener(
  "click",
  () => {
    showLaterMessage();
  }
);

if (closeLaterMessage && laterMessageModal) {
  closeLaterMessage.addEventListener("click", () => {
    laterMessageModal.classList.remove("show");
    laterMessageModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  });
}

if (laterMessageConfirm && laterMessageModal) {
  laterMessageConfirm.addEventListener("click", () => {
    laterMessageModal.classList.remove("show");
    laterMessageModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  });
}

if (laterMessageModal) {
  laterMessageModal.addEventListener("click", (event) => {
    if (event.target === laterMessageModal || event.target.matches("[data-close-later-message]")) {
      laterMessageModal.classList.remove("show");
      laterMessageModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
  });
}

/*
  ============================================================
  DATE FORM
  ============================================================
*/

dateForm.addEventListener(
  "submit",
  (event) => {
    event.preventDefault();

    updateDatePreview();

    plannerPage.classList.remove(
      "show"
    );

    datePage.classList.add(
      "show"
    );

    document.body.style.overflow =
      "hidden";

    createDateBackgroundHearts();
    createHearts();
    createBurst();
    createSparkles();
  }
);

/*
  ============================================================
  DATE INPUTS
  ============================================================
*/

if (
  dateInput &&
  timeInput &&
  placeInput
) {
  dateInput.addEventListener(
    "input",
    updateDatePreview
  );

  timeInput.addEventListener(
    "input",
    updateDatePreview
  );

  placeInput.addEventListener(
    "input",
    updateDatePreview
  );
}

/*
  ============================================================
  DOWNLOAD DATE BUTTON
  ============================================================
*/

if (downloadDateButton) {
  downloadDateButton.addEventListener(
    "click",
    downloadDateCardImage
  );
}

/*
  ============================================================
  GALLERY
  ============================================================
*/

if (
  galleryTrigger &&
  galleryModal
) {
  galleryTrigger.addEventListener(
    "click",
    () => {
      startHeartRain();

      galleryModal.classList.add(
        "show"
      );

      galleryModal.setAttribute(
        "aria-hidden",
        "false"
      );

      document.body.style.overflow =
        "hidden";

      /*
        Music is already started by YES.

        If the user reaches the gallery without
        music playing, this will try again.
      */
      if (
        galleryAudio &&
        galleryAudio.paused
      ) {
        startBackgroundMusic();
      }
    }
  );
}

/*
  ============================================================
  CLOSE GALLERY
  ============================================================
*/

if (
  closeGallery &&
  galleryModal
) {
  closeGallery.addEventListener(
    "click",
    () => {
      galleryModal.classList.remove(
        "show"
      );

      galleryModal.setAttribute(
        "aria-hidden",
        "true"
      );

      document.body.style.overflow =
        "";

      stopHeartRain();
      stopBackgroundMusic();
    }
  );
}

/*
  ============================================================
  CLOSE GALLERY BY CLICKING OUTSIDE
  ============================================================
*/

if (galleryModal) {
  galleryModal.addEventListener(
    "click",
    (event) => {
      if (
        event.target ===
          galleryModal ||
        event.target.matches(
          "[data-close-gallery]"
        )
      ) {
        galleryModal.classList.remove(
          "show"
        );

        galleryModal.setAttribute(
          "aria-hidden",
          "true"
        );

        document.body.style.overflow =
          "";

        stopHeartRain();
        stopBackgroundMusic();
      }
    }
  );
}

/*
  ============================================================
  PAGE LOAD
  ============================================================
*/

window.addEventListener(
  "DOMContentLoaded",
  () => {
    animateTyping();
    updateDatePreview();
  }
);