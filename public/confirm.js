const p = document.querySelector(`p`);
let time = 5;

// UPDATES PAGE TIMER, THEN REDIRECTS
window.addEventListener("load", () => {
  p.textContent = `You will be redirected in ${time} seconds.`;
  const interval = setInterval(() => {
    time -= 1;
    p.textContent = `You will be redirected in ${time} seconds.`;
    if (time === 0) {
      window.location.href = "/profile";
      clearInterval(interval);
    }
  }, 1000);
});
