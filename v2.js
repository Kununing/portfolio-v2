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
