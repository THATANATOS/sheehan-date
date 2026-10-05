const yesButton = document.getElementById("yesButton");
const noButton = document.getElementById("noButton");
const hint = document.getElementById("hint");
const buttonRow = document.querySelector(".button-row");
const heroPhoto = document.querySelector(".main-photo");
const heroPhotoSources = Array.from({ length: 9 }, (_, index) => `Image/she${index + 1}.jpg`);
let heroPhotoIndex = heroPhoto ? heroPhotoSources.indexOf(heroPhoto.getAttribute("src")) : -1;
let heroPhotoInterval = null;
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
const ourDateNote = document.getElementById("ourDateNote");
const downloadDateButton = document.getElementById("downloadDateButton");
const galleryTrigger = document.getElementById("galleryTrigger");
const galleryModal = document.getElementById("galleryModal");
const closeGallery = document.getElementById("closeGallery");
const galleryOpenButton = document.getElementById("galleryOpenButton");
const typingLines = document.querySelectorAll(".typing-line");
const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector(".main-nav");
const agreementView = document.getElementById("agreementView");
const closeAgreement = document.getElementById("closeAgreement");
const agreementForm = document.getElementById("agreementForm");
const agreementName = document.getElementById("agreementName");
const agreementDate = document.getElementById("agreementDate");
const agreementTime = document.getElementById("agreementTime");
const agreementPlace = document.getElementById("agreementPlace");
const agreementActivity = document.getElementById("agreementActivity");
const agreementMessage = document.getElementById("agreementMessage");
const signatureCanvas = document.getElementById("signatureCanvas");
const clearSignatureButton = document.getElementById("clearSignatureButton");
const acceptAgreementButton = document.getElementById("acceptAgreementButton");
const agreementCompleted = document.getElementById("agreementCompleted");
const agreementActions = document.getElementById("agreementActions");
const downloadAgreementButton = document.getElementById("downloadAgreementButton");
const printAgreementButton = document.getElementById("printAgreementButton");
const planDateButton = document.getElementById("planDateButton");

let audioContext = null;
let musicIntervalId = null;
let heartRainIntervalId = null;
let noClicks = 0;
let signatureContext = null;
let signatureHasInk = false;
let signatureDrawing = false;
let agreementRecord = null;

let galleryAudio = document.getElementById("galleryAudio");

if (!galleryAudio) {
  galleryAudio = document.createElement("audio");
  galleryAudio.id = "galleryAudio";
  galleryAudio.src = "music.mp3/syempre.mp3";
  galleryAudio.preload = "auto";
  galleryAudio.loop = true;
  galleryAudio.volume = 0.35;
  document.body.appendChild(galleryAudio);
} else {
  galleryAudio.src = "music.mp3/syempre.mp3";
  galleryAudio.preload = "auto";
  galleryAudio.loop = true;
  galleryAudio.volume = 0.35;
}

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
    image: "Image/she2.jpg"
  },
  {
    title: "I’m patient",
    text: "You don’t have to decide right this second. I just wanted you to know I care. ♥",
    image: "Image/she3.jpg"
  },
  {
    title: "I’ll wait",
    text: "I can be patient and still be excited about us. We’ve got time.",
    image: "Image/she5.jpg"
  },
  {
    title: "A little more time",
    text: "That’s okay. I’ll keep this smile for you until you’re ready to say yes.",
    image: "Image/she6.jpg"
  }
];

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
  noButton.style.transform = `scale(${scale}) rotate(${(Math.random() - 0.5) * 12}deg)`;
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function showModal(modal) {
  if (!modal) return;
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function createDateBackgroundHearts() {
  const heartLayer = document.querySelector(".floating-hearts-layer");
  if (!heartLayer) return;

  heartLayer.innerHTML = "";

  for (let i = 0; i < 42; i += 1) {
    const heart = document.createElement("span");
    const symbols = ["♡", "♥", "❤"];

    heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    heart.className = "floating-heart";
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.top = `${Math.random() * 100}%`;
    heart.style.fontSize = `${18 + Math.random() * 26}px`;
    heart.style.setProperty("--drift-x", `${(Math.random() - 0.5) * 260}px`);
    heart.style.setProperty("--spin", `${(Math.random() - 0.5) * 220}deg`);
    heart.style.animationDelay = `${Math.random() * 3}s`;
    heart.style.animationDuration = `${5 + Math.random() * 5}s`;

    heartLayer.appendChild(heart);
  }
}

function roundedRect(context, x, y, width, height, radius) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";
  let currentY = y;

  for (let i = 0; i < words.length; i += 1) {
    const testLine = `${line}${words[i]} `;
    const metrics = context.measureText(testLine);

    if (metrics.width > maxWidth && i > 0) {
      context.fillText(line, x, currentY);
      line = `${words[i]} `;
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }

  context.fillText(line.trim(), x, currentY);
}

function downloadDateCardImage() {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 1600;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#fff7f8");
  gradient.addColorStop(1, "#fff0ed");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(223, 114, 133, 0.10)";
  for (let i = 0; i < 12; i += 1) {
    const x = 100 + Math.random() * 1000;
    const y = 200 + Math.random() * 1100;
    ctx.beginPath();
    ctx.arc(x, y, 110 + Math.random() * 80, 0, Math.PI * 2);
    ctx.fill();
  }

  const cardX = 120;
  const cardY = 190;
  const cardW = 960;
  const cardH = 1220;

  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "rgba(223, 114, 133, 0.14)";
  ctx.lineWidth = 3;
  roundedRect(ctx, cardX, cardY, cardW, cardH, 42);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#df7285";
  ctx.font = '700 42px "DM Sans", sans-serif';
  ctx.textAlign = "center";
  ctx.fillText("IT’S A DATE", canvas.width / 2, 300);

  ctx.fillStyle = "#2f2a2b";
  ctx.font = '700 86px "Playfair Display", serif';
  ctx.fillText("You + Me", canvas.width / 2, 420);

  ctx.fillStyle = "#df7285";
  ctx.font = '700 34px "DM Sans", sans-serif';
  ctx.fillText("OUR DATE", canvas.width / 2, 520);

  const dateText = finalDateText?.textContent || "Saturday, October 10, 2026";
  const timeText = finalTimeText?.textContent || "6:00 PM";
  const placeText = finalPlaceText?.textContent || "Rooftop dinner";

  ctx.fillStyle = "#2f2a2b";
  ctx.font = '600 52px "DM Sans", sans-serif';
  ctx.textAlign = "left";
  wrapText(ctx, dateText, 210, 620, 760, 54);
  wrapText(ctx, timeText, 210, 700, 760, 54);
  wrapText(ctx, placeText, 210, 780, 760, 54);

  ctx.fillStyle = "#df7285";
  ctx.font = '700 30px "DM Sans", sans-serif';
  ctx.textAlign = "center";
  ctx.fillText("See you there", canvas.width / 2, 1080);

  ctx.fillStyle = "#ee8ea1";
  ctx.font = '600 96px serif';
  ctx.fillText("♡", canvas.width / 2, 1180);

  const link = document.createElement("a");
  link.download = "our-date-card.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
}

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

async function playLocalGalleryMusic() {
  if (!galleryAudio) return false;

  galleryAudio.volume = 0.35;
  galleryAudio.muted = false;
  galleryAudio.loop = true;

  try {
    await galleryAudio.play();
    return true;
  } catch (error) {
    console.error("Music failed to play:", error);
    return false;
  }
}

function startBackgroundMusic() {
  if (!galleryAudio) return;

  galleryAudio.src = "music.mp3/syempre.mp3";
  galleryAudio.volume = 0.35;
  galleryAudio.loop = true;
  galleryAudio.muted = false;
  playLocalGalleryMusic();
}

function createSparkles() {
  for (let i = 0; i < 18; i += 1) {
    const sparkle = document.createElement("span");
    sparkle.className = "sparkle";
    sparkle.style.left = `${Math.random() * 100}vw`;
    sparkle.style.top = `${Math.random() * 100}vh`;
    sparkle.style.animationDelay = `${Math.random() * 2}s`;
    sparkle.style.opacity = `${0.3 + Math.random() * 0.7}`;
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 3000);
  }
}

function createBurst() {
  const colors = ["#f5a7b5", "#f8d7a1", "#f5c7d9", "#f4b9ae"];

  for (let i = 0; i < 18; i += 1) {
    const burst = document.createElement("span");
    burst.textContent = "✦";
    burst.style.position = "fixed";
    burst.style.left = `${50 + (Math.random() - 0.5) * 30}vw`;
    burst.style.top = `${50 + (Math.random() - 0.5) * 30}vh`;
    burst.style.color = colors[Math.floor(Math.random() * colors.length)];
    burst.style.fontSize = `${14 + Math.random() * 22}px`;
    burst.style.pointerEvents = "none";
    burst.style.zIndex = "200";
    burst.style.transition = "all 1.6s ease";
    burst.style.opacity = "1";
    document.body.appendChild(burst);

    requestAnimationFrame(() => {
      const x = (Math.random() - 0.5) * 220;
      const y = -120 - Math.random() * 180;
      burst.style.transform = `translate(${x}px, ${y}px) rotate(${(Math.random() - 0.5) * 200}deg)`;
      burst.style.opacity = "0";
    });

    setTimeout(() => burst.remove(), 1600);
  }
}

function createHearts() {
  const symbols = ["♡", "♥", "❤"];
  const heartColors = ["#ee8ea1", "#f7a7b5", "#f9c7d7", "#ffc7a8"];

  for (let i = 0; i < 32; i += 1) {
    const heart = document.createElement("span");
    heart.textContent = symbols[Math.floor(Math.random() * symbols.length)];
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

function updateDatePreview(dateValue = "", timeValue = "", placeValue = "") {
  const dateText = formatDate(dateValue);
  const timeText = formatTime(timeValue);
  const placeText = placeValue.trim() || "rooftop dinner";
  const summary = `${dateText} at ${timeText} — ${placeText}`;

  if (ourDateNote) ourDateNote.textContent = summary;

  if (finalDateText && finalTimeText && finalPlaceText) {
    finalDateText.textContent = dateText;
    finalTimeText.textContent = timeText;
    finalPlaceText.textContent = placeText;
  }
}

function startHeroPhotoSlideshow() {
  if (!heroPhoto || heroPhotoInterval || heroPhotoSources.length < 2) return;

  heroPhotoInterval = setInterval(() => {
    heroPhotoIndex = (heroPhotoIndex + 1) % heroPhotoSources.length;
    const nextPhoto = new Image();

    nextPhoto.onload = () => {
      heroPhoto.classList.add("is-changing");
      setTimeout(() => {
        heroPhoto.src = nextPhoto.src;
        heroPhoto.classList.remove("is-changing");
      }, 180);
    };

    nextPhoto.src = heroPhotoSources[heroPhotoIndex];
  }, 2000);
}

function showDateConfirmation() {
  const dateSuccessPage = document.getElementById("datePage");
  if (!dateSuccessPage) return;

  dateSuccessPage.classList.remove("hidden");
  dateSuccessPage.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  createDateBackgroundHearts();
  createHearts();
  createBurst();
  createSparkles();
}

function initializeSignatureCanvas() {
  if (!signatureCanvas || signatureCanvas.dataset.ready) return;

  const bounds = signatureCanvas.getBoundingClientRect();
  if (!bounds.width) return;

  const scale = window.devicePixelRatio || 1;
  signatureCanvas.width = Math.round(bounds.width * scale);
  signatureCanvas.height = Math.round(150 * scale);
  signatureContext = signatureCanvas.getContext("2d");
  if (!signatureContext) return;

  signatureContext.scale(scale, scale);
  signatureContext.fillStyle = "#ffffff";
  signatureContext.fillRect(0, 0, bounds.width, 150);
  signatureContext.strokeStyle = "#49363b";
  signatureContext.lineWidth = 2.5;
  signatureContext.lineCap = "round";
  signatureContext.lineJoin = "round";
  signatureCanvas.dataset.ready = "true";
}

function updateAgreementButton() {
  if (!agreementForm || !acceptAgreementButton) return;
  acceptAgreementButton.disabled = !agreementForm.checkValidity() || !signatureHasInk;
}

function getSignaturePoint(event) {
  const bounds = signatureCanvas.getBoundingClientRect();
  return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
}

function clearSignature() {
  if (!signatureContext || !signatureCanvas) return;
  const bounds = signatureCanvas.getBoundingClientRect();
  signatureContext.clearRect(0, 0, bounds.width, bounds.height);
  signatureContext.fillStyle = "#ffffff";
  signatureContext.fillRect(0, 0, bounds.width, bounds.height);
  signatureHasInk = false;
  updateAgreementButton();
}

function acceptAgreement() {
  agreementRecord = {
    name: agreementName.value.trim(),
    date: agreementDate.value,
    time: agreementTime.value,
    place: agreementPlace.value.trim(),
    activity: agreementActivity.value.trim(),
    message: agreementMessage.value.trim(),
    signedAt: new Date(),
    signature: signatureCanvas.toDataURL("image/png")
  };

  const signingDate = agreementRecord.signedAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  document.getElementById("completedName").textContent = agreementRecord.name;
  document.getElementById("completedSigningDate").textContent = signingDate;
  document.getElementById("completedBoyfriendDate").textContent = signingDate;
  document.getElementById("completedDate").textContent = formatDate(agreementRecord.date);
  document.getElementById("completedTime").textContent = formatTime(agreementRecord.time);
  document.getElementById("completedPlace").textContent = agreementRecord.place;
  document.getElementById("completedActivity").textContent = agreementRecord.activity;
  document.getElementById("completedMessage").textContent = agreementRecord.message || "None";
  document.getElementById("completedSignature").src = agreementRecord.signature;
  agreementForm.classList.add("hidden");
  agreementCompleted.classList.remove("hidden");
  agreementActions.classList.remove("hidden");
}

function downloadAgreementPdf() {
  if (!agreementRecord || !window.jspdf?.jsPDF) {
    window.alert("The PDF tool is unavailable right now. Please use Print Agreement and save as PDF.");
    return;
  }

  const pdf = new window.jspdf.jsPDF({ unit: "mm", format: "a4" });
  const left = 18;
  const width = 174;
  let y = 20;

  function addParagraph(text, fontSize = 10, gap = 2) {
    pdf.setFontSize(fontSize);
    const lines = pdf.splitTextToSize(text, width);
    const neededHeight = lines.length * (fontSize * 0.42) + gap;
    if (y + neededHeight > 278) {
      pdf.addPage();
      y = 20;
    }
    pdf.text(lines, left, y);
    y += neededHeight;
  }

  const signingDate = agreementRecord.signedAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  pdf.setTextColor(70, 48, 53);
  pdf.setFont("helvetica", "bold");
  addParagraph("OFFICIAL DATE AGREEMENT", 17, 5);
  pdf.setFont("helvetica", "normal");
  addParagraph('This Agreement ("Agreement") establishes a mutually agreed romantic date between the following undersigned parties:', 10, 3);
  addParagraph("Sheehan T. Cago (Girlfriend)", 10);
  addParagraph("Joshua C. Godilos (Boyfriend)", 10, 3);
  addParagraph('Herein referred to collectively as the "Parties", it is entered into for the purpose of establishing the terms and understanding of their planned date. The Parties hereby agree to the following provisions:', 10, 4);

  const sections = [
    {
      title: "SECTION I: DATE PURPOSE",
      clauses: [
        "1.1 The Parties agree to spend meaningful time together and enjoy a date in a respectful and comfortable environment.",
        "1.2 The purpose of this Agreement is to create a memorable experience involving good conversation, food, laughter, quality time, and shared memories.",
        "1.3 Both Parties acknowledge that the date should be based on mutual agreement, comfort, and willingness to participate."
      ]
    },
    {
      title: "SECTION II: DATE COMMITMENTS",
      clauses: [
        "2.1 The Parties agree to make reasonable efforts to attend the agreed date at the selected time and location.",
        "2.2 The Parties agree to enjoy the date without unnecessary pressure and to respect each other's personal boundaries.",
        "2.3 At least one photograph may be taken during the date for memory purposes, provided that both Parties are comfortable with it."
      ]
    },
    {
      title: "SECTION III: IMPORTANT PROVISIONS",
      clauses: [
        "3.1 Good food is strongly encouraged.",
        "3.2 Good conversation is highly recommended.",
        "3.3 Laughing at each other's jokes is appreciated, even when the jokes are objectively questionable.",
        "3.4 The Parties agree that the primary objective is to make a genuinely good memory together.",
        "3.5 This Agreement is a romantic keepsake and does not create a legally enforceable relationship, obligation, or contract."
      ]
    }
  ];

  sections.forEach((section) => {
    pdf.setFont("helvetica", "bold");
    addParagraph(section.title, 11, 2);
    pdf.setFont("helvetica", "normal");
    section.clauses.forEach((clause) => addParagraph(clause, 9, 2));
    y += 2;
  });

  pdf.setFont("helvetica", "bold");
  addParagraph("OFFICIAL DATE AGREEMENT - PART II", 14, 1);
  addParagraph("DATE INFORMATION FORM", 12, 2);
  pdf.setFont("helvetica", "normal");
  addParagraph("Please complete the following information to confirm the details of the proposed date.", 9, 4);
  [
    `1. Full Name: ${agreementRecord.name}`,
    `2. Preferred Date: ${formatDate(agreementRecord.date)}`,
    `3. Preferred Time: ${formatTime(agreementRecord.time)}`,
    `4. Preferred Location: ${agreementRecord.place}`,
    `5. Preferred Activity: ${agreementRecord.activity}`,
    `6. A Little Message for Your Boyfriend: ${agreementRecord.message || "None"}`
  ].forEach((detail) => addParagraph(detail, 10, 3));

  pdf.setFont("helvetica", "bold");
  addParagraph("ACKNOWLEDGEMENT", 11, 2);
  pdf.setFont("helvetica", "normal");
  [
    "[X] I have read and understood the provisions of this Agreement.",
    "[X] I understand that this is a playful romantic keepsake and not a legally binding contract.",
    "[X] I agree to the proposed date and its arrangements."
  ].forEach((statement) => addParagraph(statement, 9, 2));

  if (y + 72 > 278) {
    pdf.addPage();
    y = 20;
  }
  pdf.setFont("helvetica", "bold");
  addParagraph("DIGITAL SIGNATURE - SIGNATURE OF GIRLFRIEND", 10, 1);
  pdf.addImage(agreementRecord.signature, "PNG", left, y, 72, 22);
  y += 26;
  pdf.setFont("helvetica", "normal");
  addParagraph(`Date Signed: ${signingDate}`, 9, 3);
  pdf.setFont("helvetica", "bold");
  addParagraph("BOYFRIEND", 10, 1);
  pdf.setFont("helvetica", "normal");
  addParagraph("Joshua C. Godilos", 10, 1);
  addParagraph(`Date: ${signingDate}`, 9, 3);
  pdf.setFont("helvetica", "bold");
  addParagraph("AGREEMENT STATUS: [X] ACCEPTED  [ ] PENDING", 11);
  pdf.save("Sheehan-Date-Agreement.pdf");
}

if (noButton) {
  noButton.addEventListener("click", (event) => {
    event.preventDefault();
    moveNoButton();
  });

  noButton.addEventListener("mouseenter", () => {
    if (noClicks > 0) {
      moveNoButton();
    }
  });
}

function openAgreement() {
  showModal(agreementView);
  requestAnimationFrame(initializeSignatureCanvas);
}

if (closeAgreement) {
  closeAgreement.addEventListener("click", () => closeModal(agreementView));
}

if (yesButton) {
  yesButton.addEventListener("click", () => {
    hint.textContent = "Yay! I’m so happy. ♡";
    createBurst();
    createSparkles();
    startBackgroundMusic();
    openAgreement();
  });
}

if (agreementForm) {
  agreementForm.addEventListener("input", updateAgreementButton);
  agreementForm.addEventListener("change", updateAgreementButton);
  agreementForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (agreementForm.checkValidity() && signatureHasInk) acceptAgreement();
  });
}

if (signatureCanvas) {
  signatureCanvas.addEventListener("pointerdown", (event) => {
    if (!signatureContext || agreementRecord) return;
    event.preventDefault();
    signatureCanvas.setPointerCapture(event.pointerId);
    const point = getSignaturePoint(event);
    signatureContext.beginPath();
    signatureContext.arc(point.x, point.y, 1.2, 0, Math.PI * 2);
    signatureContext.fill();
    signatureContext.beginPath();
    signatureContext.moveTo(point.x, point.y);
    signatureDrawing = true;
    signatureHasInk = true;
    updateAgreementButton();
  });

  signatureCanvas.addEventListener("pointermove", (event) => {
    if (!signatureDrawing || !signatureContext) return;
    event.preventDefault();
    const point = getSignaturePoint(event);
    signatureContext.lineTo(point.x, point.y);
    signatureContext.stroke();
    signatureContext.beginPath();
    signatureContext.moveTo(point.x, point.y);
  });

  signatureCanvas.addEventListener("pointerup", () => {
    signatureDrawing = false;
  });
  signatureCanvas.addEventListener("pointercancel", () => {
    signatureDrawing = false;
  });
}

if (clearSignatureButton) {
  clearSignatureButton.addEventListener("click", clearSignature);
}

if (downloadAgreementButton) {
  downloadAgreementButton.addEventListener("click", downloadAgreementPdf);
}

if (printAgreementButton) {
  printAgreementButton.addEventListener("click", () => window.print());
}

if (planDateButton) {
  planDateButton.addEventListener("click", () => {
    if (!agreementRecord) return;
    updateDatePreview(agreementRecord.date, agreementRecord.time, agreementRecord.place);
    closeModal(agreementView);
    showDateConfirmation();
  });
}

function showFavoriteMessage() {
  if (!favoriteMessageModal) return;
  showModal(favoriteMessageModal);
}

function showLaterMessage() {
  if (!laterMessageModal) return;

  const chosenMessage = laterMessages[Math.floor(Math.random() * laterMessages.length)];
  if (laterMessageTitle) laterMessageTitle.textContent = chosenMessage.title;
  if (laterMessageText) laterMessageText.textContent = chosenMessage.text;
  if (laterMessageImage) {
    laterMessageImage.src = chosenMessage.image;
    laterMessageImage.alt = chosenMessage.title;
  }

  showModal(laterMessageModal);
}

if (favoriteMessageTrigger) {
  favoriteMessageTrigger.addEventListener("click", showFavoriteMessage);
}

if (closeFavoriteMessage) {
  closeFavoriteMessage.addEventListener("click", () => {
    closeModal(favoriteMessageModal);
  });
}

if (favoriteMessageModal) {
  favoriteMessageModal.addEventListener("click", (event) => {
    if (event.target === favoriteMessageModal || event.target.matches("[data-close-favorite-message]")) {
      closeModal(favoriteMessageModal);
    }
  });
}

if (closeLaterMessage) {
  closeLaterMessage.addEventListener("click", () => {
    closeModal(laterMessageModal);
  });
}

if (laterMessageConfirm) {
  laterMessageConfirm.addEventListener("click", () => {
    closeModal(laterMessageModal);
  });
}

if (laterMessageModal) {
  laterMessageModal.addEventListener("click", (event) => {
    if (event.target === laterMessageModal || event.target.matches("[data-close-later-message]")) {
      closeModal(laterMessageModal);
    }
  });
}

if (downloadDateButton) {
  downloadDateButton.addEventListener("click", downloadDateCardImage);
}

if (galleryTrigger && galleryModal) {
  galleryTrigger.addEventListener("click", () => {
    startHeartRain();
    showModal(galleryModal);

    if (galleryAudio && galleryAudio.paused) {
      startBackgroundMusic();
    }
  });
}

if (galleryOpenButton && galleryModal) {
  galleryOpenButton.addEventListener("click", () => {
    startHeartRain();
    showModal(galleryModal);
  });
}

if (closeGallery && galleryModal) {
  closeGallery.addEventListener("click", () => {
    closeModal(galleryModal);
    stopHeartRain();
    stopBackgroundMusic();
  });
}

if (galleryModal) {
  galleryModal.addEventListener("click", (event) => {
    if (event.target === galleryModal || event.target.matches("[data-close-gallery]")) {
      closeModal(galleryModal);
      stopHeartRain();
      stopBackgroundMusic();
    }
  });
}

if (navToggle && mainNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

window.addEventListener("DOMContentLoaded", () => {
  animateTyping();
  updateDatePreview();
  startHeroPhotoSlideshow();

  if (galleryAudio) {
    galleryAudio.volume = 0.35;
  }
});
