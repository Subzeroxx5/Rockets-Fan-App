const countdown = document.querySelector("#countdown");
let secondsRemaining = (2 * 60 * 60) + (18 * 60) + 44;

function updateCountdown() {
  if (!countdown) return;
  const hours = Math.floor(secondsRemaining / 3600);
  const minutes = Math.floor((secondsRemaining % 3600) / 60);
  const seconds = secondsRemaining % 60;
  countdown.textContent = [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(" : ");
  secondsRemaining = secondsRemaining > 0 ? secondsRemaining - 1 : 0;
}

updateCountdown();
setInterval(updateCountdown, 1000);
