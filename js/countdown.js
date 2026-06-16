// Wedding date — TODO: replace with real date
const WEDDING_DATE = new Date('2027-04-24T14:00:00');

function updateCountdown() {
  const now = new Date();
  const diff = WEDDING_DATE - now;

  if (diff <= 0) {
    document.getElementById('count-days').textContent = '0';
    document.getElementById('count-hours').textContent = '0';
    document.getElementById('count-minutes').textContent = '0';
    document.getElementById('count-seconds').textContent = '0';
    return;
  }

  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  setUnit('count-days',    days);
  setUnit('count-hours',   hours);
  setUnit('count-minutes', minutes);
  setUnit('count-seconds', seconds);
}

function setUnit(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  const padded = String(value).padStart(2, '0');
  if (el.textContent !== padded) {
    el.textContent = padded;
    el.classList.remove('updated');
    void el.offsetWidth; // reflow to restart animation
    el.classList.add('updated');
  }
}

updateCountdown();
setInterval(updateCountdown, 1000);
