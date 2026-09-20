const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const calmMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const cursorGlow = document.querySelector(".cursor-constellation");

if (finePointer.matches && !calmMotion.matches && cursorGlow) {
  let frame;
  window.addEventListener("pointermove", (event) => {
    window.cancelAnimationFrame(frame);
    frame = window.requestAnimationFrame(() => {
      document.documentElement.style.setProperty("--cursor-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--cursor-y", `${event.clientY}px`);
      cursorGlow.classList.add("is-visible");
    });
  });

  document.documentElement.addEventListener("mouseleave", () => {
    cursorGlow.classList.remove("is-visible");
  });
}

if (finePointer.matches && !calmMotion.matches) {
  document.querySelectorAll(".case-study, .project").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const box = card.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      card.style.setProperty("--tilt-x", `${y * -2.2}deg`);
      card.style.setProperty("--tilt-y", `${x * 3.2}deg`);
    });

    card.addEventListener("pointerleave", () => {
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    });
  });

  document.querySelectorAll(".button, .one-click").forEach((control) => {
    control.addEventListener("pointermove", (event) => {
      const box = control.getBoundingClientRect();
      const x = (event.clientX - (box.left + box.width / 2)) * 0.12;
      const y = (event.clientY - (box.top + box.height / 2)) * 0.12;
      control.style.setProperty("--magnet-x", `${x}px`);
      control.style.setProperty("--magnet-y", `${y}px`);
    });

    control.addEventListener("pointerleave", () => {
      control.style.setProperty("--magnet-x", "0px");
      control.style.setProperty("--magnet-y", "0px");
    });
  });
}

const navLinks = Array.from(
  document.querySelectorAll("#primary-nav a[href^='#']")
);
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if (sections.length) {
  const setCurrent = (id) => {
    navLinks.forEach((link) => {
      const active = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-current", active);
      if (active) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const spy = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) {
        setCurrent(visible.target.id);
      }
    },
    { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.2, 0.5, 1] }
  );

  sections.forEach((section) => spy.observe(section));
}

async function copyText(value) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    // fall through to the textarea path below
  }

  const scratch = document.createElement("textarea");
  scratch.value = value;
  scratch.setAttribute("readonly", "");
  scratch.style.position = "fixed";
  scratch.style.opacity = "0";
  document.body.appendChild(scratch);
  scratch.select();

  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch {
    copied = false;
  }
  scratch.remove();
  return copied;
}

const copyStatus = document.querySelector(".copy-status");

document.querySelectorAll(".copy-button").forEach((button) => {
  let resetTimer;
  button.addEventListener("click", async () => {
    const value = button.dataset.copy || "";
    const label = button.dataset.label || button.textContent.trim();
    const copied = await copyText(value);

    window.clearTimeout(resetTimer);
    button.classList.toggle("is-copied", copied);
    button.textContent = copied ? "Copied" : "Press Ctrl+C";
    if (copyStatus) {
      copyStatus.textContent = copied
        ? `${value} copied to clipboard.`
        : `Could not copy automatically — ${value}`;
    }

    resetTimer = window.setTimeout(() => {
      button.classList.remove("is-copied");
      button.textContent = label;
      if (copyStatus) copyStatus.textContent = "";
    }, 2400);
  });
});

document.addEventListener("pointerdown", (event) => {
  if (calmMotion.matches || event.pointerType === "touch") return;
  const interactive = event.target.closest("a, button");
  if (!interactive) return;

  for (let index = 0; index < 6; index += 1) {
    const spark = document.createElement("i");
    spark.className = "signal-spark";
    spark.style.setProperty("--spark-x", `${event.clientX}px`);
    spark.style.setProperty("--spark-y", `${event.clientY}px`);
    spark.style.setProperty("--spark-angle", `${index * 60}deg`);
    document.body.appendChild(spark);
    spark.addEventListener("animationend", () => spark.remove(), { once: true });
  }
});
