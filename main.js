const toggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const form = document.querySelector("#enquiry");
const error = document.querySelector("#form-error");
const plotField = form?.querySelector("[name='plot']");
const cards = [...document.querySelectorAll("[data-plot]")];
const reading = document.querySelector("#reading");
const pickedAsk = document.querySelector("#picked-ask");
const sqmField = document.querySelector("#sqm");
const metreOut = document.querySelector("#metre-out");
const metreWork = document.querySelector("#metre-work");
const look = document.querySelector("#look");
const lookImg = document.querySelector("#look-img");
const lookCap = document.querySelector("#look-cap");

const RATE = 200000;
const notes = {
  "300 sqm — ₦45 million":
    "300 sqm at ₦150,000 each. 300 × ₦150,000 is ₦45 million, the smallest residential size on the sheet. 600 sqm is twice the land, and the same rate doubles the price.",
  "600 sqm — ₦90 million":
    "600 sqm, still ₦150,000 each, so ₦90 million. That is twice the 300 sqm plot. The next standard size is 1,000 sqm: 400 sqm more land, which is ₦60 million more.",
  "1,000 sqm — ₦150 million":
    "1,000 sqm at the standard ₦150,000, totalling ₦150 million. This is the last size on that rate. The next parcel is 2,000 sqm, marked Special, at ₦250,000 per sqm.",
  "2,000 sqm Special — ₦500 million":
    "2,000 sqm at the special rate of ₦250,000. That is ₦100,000 more per sqm than the standard plots, and the sheet total is ₦500 million.",
  "3,000 sqm Special — ₦750 million":
    "3,000 sqm at ₦250,000. It is 1,000 sqm more than the 2,000 sqm special, so ₦250 million more, and the total is ₦750 million.",
  "10,000 sqm Special — ₦2.5 billion":
    "10,000 sqm at ₦250,000. It is the largest size on the sheet, and it fills the scale. 10,000 × ₦250,000 is ₦2.5 billion.",
  "Commercial — ₦200,000 per sqm":
    "Commercial land has no fixed size on the sheet. The rate is ₦200,000 per sqm. A size you type in the metre is an example until Jumong confirms the land.",
};

const sheet = [
  "Greenhills City — Army-Efab Jumong",
  "Plot 267, Behind Katampe Extension, Usuma District, Abuja",
  "",
  "300 sqm — ₦45 million — ₦150,000 per sqm",
  "600 sqm — ₦90 million — ₦150,000 per sqm",
  "1,000 sqm — ₦150 million — ₦150,000 per sqm",
  "2,000 sqm Special — ₦500 million — ₦250,000 per sqm",
  "3,000 sqm Special — ₦750 million — ₦250,000 per sqm",
  "10,000 sqm Special — ₦2.5 billion — ₦250,000 per sqm",
  "Commercial — ₦200,000 per sqm",
  "",
  "Call / WhatsApp 0703 594 8055 or 0706 890 2140",
  "jumongprojects1@gmail.com",
].join("\n");

toggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", open ? "true" : "false");
});

nav?.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    nav.classList.remove("is-open");
    toggle?.setAttribute("aria-expanded", "false");
  }
});

function naira(amount) {
  return `₦${Math.round(amount).toLocaleString("en-NG")}`;
}

function commercialSum() {
  const raw = String(sqmField?.value || "").trim();
  const size = Number(raw);
  if (!raw || !Number.isInteger(size) || size < 1 || size > 100000) return null;
  const total = size * RATE;
  const short =
    total % 1000000000 === 0
      ? `₦${total / 1000000000} billion`
      : total % 1000000 === 0
        ? `₦${total / 1000000} million`
        : "";
  return {
    size,
    total,
    line: `${size.toLocaleString("en-NG")} sqm × ₦200,000 = ${naira(total)}${short ? ` (${short})` : ""}`,
  };
}

function paintMetre() {
  const sum = commercialSum();
  if (!metreOut || !metreWork) return;
  if (!sum) {
    metreOut.textContent = "—";
    metreWork.textContent = "Use a whole number of square metres, up to 100,000.";
    return;
  }
  metreOut.textContent = naira(sum.total);
  metreWork.textContent = sum.line;
}

function askHref(plot) {
  const lines = ["Hello Jumong, I am enquiring about Greenhills City.", `Plot: ${plot}`];
  if (plot.startsWith("Commercial")) {
    const sum = commercialSum();
    if (sum) lines.push(`Example: ${sum.line}`);
  }
  return `https://wa.me/2347035948055?text=${encodeURIComponent(lines.join("\n"))}`;
}

function selectPlot(value) {
  cards.forEach((card) => {
    const on = card.dataset.plot === value;
    card.classList.toggle("is-selected", on);
    card.setAttribute("aria-pressed", on ? "true" : "false");
  });
  if (plotField && [...plotField.options].some((option) => option.value === value)) {
    plotField.value = value;
  }
  if (reading && notes[value]) reading.textContent = notes[value];
  if (pickedAsk && value) {
    pickedAsk.hidden = false;
    pickedAsk.href = askHref(value);
    pickedAsk.textContent = value.startsWith("Commercial") ? "Ask about commercial" : "Ask about this size";
  }
}

cards.forEach((card) => {
  card.setAttribute("aria-pressed", "false");
  card.addEventListener("click", () => {
    selectPlot(card.dataset.plot);
    if (!card.closest(".scale")) {
      document.querySelector("#visit")?.scrollIntoView({ block: "start" });
    }
  });
});

sqmField?.addEventListener("input", () => {
  paintMetre();
  if (plotField?.value.startsWith("Commercial") && pickedAsk) pickedAsk.href = askHref(plotField.value);
});
paintMetre();

document.querySelector("#use-commercial")?.addEventListener("click", () => {
  const sum = commercialSum();
  if (!sum) {
    sqmField?.focus();
    return;
  }
  selectPlot("Commercial — ₦200,000 per sqm");
  const note = form?.querySelector("[name='note']");
  if (note) note.value = sum.line;
  document.querySelector("#visit")?.scrollIntoView({ block: "start" });
});

document.querySelector("#copy-sheet")?.addEventListener("click", async () => {
  const note = document.querySelector("#copy-note");
  let copied = false;
  try {
    await navigator.clipboard.writeText(sheet);
    copied = true;
  } catch {
    const area = document.createElement("textarea");
    area.value = sheet;
    document.body.appendChild(area);
    area.select();
    copied = document.execCommand("copy");
    area.remove();
  }
  if (note) {
    note.hidden = false;
    note.textContent = copied ? "Copied. Paste it into a chat." : "Copy did not go through. The prices are still on the flyer.";
  }
});

document.querySelectorAll(".flyer, .setting figure, .homes figure").forEach((figure) => {
  const img = figure.querySelector("img");
  if (!img || !look || !lookImg || !lookCap) return;
  figure.classList.add("can-look");
  figure.tabIndex = 0;
  figure.setAttribute("role", "button");
  figure.setAttribute("aria-label", img.alt);
  const caption = figure.querySelector("figcaption");
  const open = () => {
    lookImg.src = img.currentSrc || img.src;
    lookImg.alt = img.alt;
    const bits = [...(caption?.querySelectorAll("span, p") || [])]
      .map((part) => part.textContent.trim())
      .filter(Boolean);
    lookCap.textContent = bits.length ? bits.join(" — ") : caption?.textContent.trim() || img.alt;
    look.showModal();
  };
  figure.addEventListener("click", open);
  figure.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      open();
    }
  });
});

look?.addEventListener("click", (event) => {
  if (event.target === look) look.close();
});

plotField?.addEventListener("change", () => selectPlot(plotField.value));

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const phone = String(data.get("phone") || "").trim();
  const plot = String(data.get("plot") || "").trim();
  const note = String(data.get("note") || "").trim();

  if (!name || !phone || !plot) {
    error.hidden = false;
    form.querySelector(":invalid")?.focus();
    return;
  }

  error.hidden = true;
  const lines = [
    "Hello Jumong, I am enquiring about Greenhills City.",
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Plot: ${plot}`,
  ];
  if (note) lines.push(`Note: ${note}`);

  window.location.href = `https://wa.me/2347035948055?text=${encodeURIComponent(lines.join("\n"))}`;
});
