const signalStories = {
  ambiguity: {
    title: "Start with the untidy truth.",
    copy:
      "I map the real workflow before choosing the tool, architecture, or automation.",
  },
  ai: {
    title: "Use AI where judgment repeats.",
    copy:
      "Retrieval, tool use, and structured prompts become dependable parts of a workflow—not a demo beside it.",
  },
  systems: {
    title: "Engineer for the whole trip.",
    copy:
      "APIs, services, data, packaging, deployment, and support stay connected from design through production.",
  },
  outcome: {
    title: "Finish on a measurable change.",
    copy:
      "Time removed, incidents resolved, releases stabilized, or a capability other engineers can reuse.",
  },
};

const nodes = Array.from(document.querySelectorAll(".signal-node"));
const signalCanvas = document.querySelector(".signal-canvas");
const signalSvg = document.querySelector(".signal-lines");
const signalRoute = document.querySelector(".route-main");
const signalPacket = document.querySelector(".signal-packet");
const title = document.querySelector(".readout-title");
const copy = document.querySelector(".readout-copy");
const motion = document.querySelector("#packet-motion");
const replayButton = document.querySelector(".replay-signal");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector("#primary-nav");
const flowDiagram = document.querySelector(".case-diagram");
const flowButton = document.querySelector(".one-click");
const flowStatus = document.querySelector(".flow-status");
let signalPath = "";
let packetTimer;

function buildSignalPath() {
  if (!signalCanvas || !signalSvg || !signalRoute || !motion || nodes.length < 2) {
    return;
  }

  const canvasBox = signalCanvas.getBoundingClientRect();
  const points = nodes.map((node) => {
    const box = node.getBoundingClientRect();
    return {
      x: box.left + box.width / 2 - canvasBox.left,
      y: box.top + box.height / 2 - canvasBox.top,
    };
  });

  signalPath = `M ${points[0].x} ${points[0].y}`;
  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const current = points[index];
    const bend = (current.x - previous.x) * 0.42;
    signalPath += ` C ${previous.x + bend} ${previous.y}, ${current.x - bend} ${current.y}, ${current.x} ${current.y}`;
  }

  signalSvg.setAttribute("viewBox", `0 0 ${canvasBox.width} ${canvasBox.height}`);
  signalRoute.setAttribute("d", signalPath);
  motion.setAttribute("path", signalPath);
}

function replaySignal() {
  if (!motion || !signalPacket || !signalPath || reduceMotion.matches) return;

  window.clearTimeout(packetTimer);
  signalPacket.classList.add("is-moving");
  if (typeof motion.beginElement === "function") {
    motion.beginElement();
  }
  packetTimer = window.setTimeout(() => {
    signalPacket.classList.remove("is-moving");
  }, 3250);
}

function selectNode(node) {
  const story = signalStories[node.dataset.node];
  if (!story || !title || !copy) return;

  nodes.forEach((item) => {
    const selected = item === node;
    item.classList.toggle("is-active", selected);
    item.setAttribute("aria-pressed", String(selected));
  });

  title.textContent = story.title;
  copy.textContent = story.copy;
}

nodes.forEach((node) => {
  node.addEventListener("click", () => selectNode(node));
});

replayButton?.addEventListener("click", () => {
  replaySignal();
});

if (signalCanvas) {
  const resizeObserver = new ResizeObserver(() => {
    window.requestAnimationFrame(buildSignalPath);
  });
  resizeObserver.observe(signalCanvas);
  document.fonts?.ready.then(buildSignalPath);
  buildSignalPath();
}

flowButton?.addEventListener("click", () => {
  if (!flowDiagram || !flowStatus) return;

  flowDiagram.classList.remove("is-running", "is-complete");
  void flowDiagram.offsetWidth;
  flowDiagram.classList.add("is-running");
  flowButton.disabled = true;
  flowButton.textContent = "Running…";
  flowStatus.textContent = "Connecting CRM, APIs, server, and database…";

  const duration = reduceMotion.matches ? 20 : 1500;
  window.setTimeout(() => {
    flowDiagram.classList.remove("is-running");
    flowDiagram.classList.add("is-complete");
    flowButton.disabled = false;
    flowButton.textContent = "Run again";
    flowStatus.textContent = "Flow complete — 28 manual steps became one run.";
  }, duration);
});

function closeMenu() {
  if (!menuToggle || !primaryNav) return;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  primaryNav.classList.remove("is-open");
}

menuToggle?.addEventListener("click", () => {
  if (!primaryNav) return;
  const opening = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(opening));
  menuToggle.setAttribute("aria-label", opening ? "Close navigation" : "Open navigation");
  primaryNav.classList.toggle("is-open", opening);
});

primaryNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  const menuIsOpen = menuToggle?.getAttribute("aria-expanded") === "true";
  if (event.key === "Escape" && menuIsOpen) {
    closeMenu();
    menuToggle?.focus();
  }
});

const year = document.querySelector("#current-year");
if (year) {
  year.textContent = String(new Date().getFullYear());
}
