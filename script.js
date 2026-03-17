const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });
}
function getBusinessStatus() {
  const now = new Date();

  const options = {
    timeZone: 'Europe/Madrid',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  };

  const parts = new Intl.DateTimeFormat('es-ES', options).formatToParts(now);

  const weekday = parts.find(p => p.type === 'weekday').value.toLowerCase();
  const hour = parseInt(parts.find(p => p.type === 'hour').value, 10);
  const minute = parseInt(parts.find(p => p.type === 'minute').value, 10);

  const currentMinutes = hour * 60 + minute;

  const schedule = {
    lunes:    [{ open: 9 * 60, close: 20 * 60 }],
    martes:   [{ open: 9 * 60, close: 20 * 60 }],
    miércoles:[{ open: 9 * 60, close: 20 * 60 }],
    jueves:   [{ open: 9 * 60, close: 20 * 60 + 30 }],
    viernes:  [{ open: 9 * 60, close: 20 * 60 }],
    sábado:   [{ open: 10 * 60, close: 15 * 60 }],
    domingo:  []
  };

  const todayHours = schedule[weekday] || [];

  if (todayHours.length === 0) {
    return { open: false, text: 'Cerrado hoy' };
  }

  for (const range of todayHours) {
    if (currentMinutes >= range.open && currentMinutes < range.close) {
      const closeHour = Math.floor(range.close / 60).toString().padStart(2, '0');
      const closeMinute = (range.close % 60).toString().padStart(2, '0');
      return { open: true, text: `Abierto hasta las ${closeHour}:${closeMinute}` };
    }
  }

  return { open: false, text: 'Cerrado ahora' };
}

function renderBusinessStatus() {
  const el = document.getElementById('business-status');
  if (!el) return;

  const status = getBusinessStatus();

  el.innerHTML = status.open
    ? `<i style="color:#6EEB83;">●</i> ${status.text}`
    : `<i style="color:#ff6b6b;">●</i> ${status.text}`;
}

renderBusinessStatus();
setInterval(renderBusinessStatus, 60000);
