const toggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const form = document.querySelector("#enquiry");
const error = document.querySelector("#form-error");
const plotField = form?.querySelector("[name='plot']");
const cards = [...document.querySelectorAll("[data-plot]")];

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

function selectPlot(value) {
  cards.forEach((card) => {
    const on = card.dataset.plot === value;
    card.classList.toggle("is-selected", on);
    card.setAttribute("aria-pressed", on ? "true" : "false");
  });
  if (plotField && [...plotField.options].some((option) => option.value === value)) {
    plotField.value = value;
  }
}

cards.forEach((card) => {
  card.setAttribute("aria-pressed", "false");
  card.addEventListener("click", () => {
    selectPlot(card.dataset.plot);
    document.querySelector("#visit")?.scrollIntoView({ block: "start" });
  });
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
