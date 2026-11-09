import './enhancements.css';

// ---------- Email links ----------
// A plain mailto: link does nothing on computers that have no desktop mail
// app set up (very common), which is why the buttons looked "broken".
// On desktop we open a Gmail compose window instead. On phones/tablets
// (touch devices) the normal mailto: link is kept, since the mail app works there.
function initMailLinks() {
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  if (isTouch) return;

  document.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      let to = '';
      let subject = '';
      try {
        const url = new URL(link.getAttribute('href'));
        to = decodeURIComponent(url.pathname);
        subject = url.searchParams.get('subject') || '';
      } catch (err) {
        return; // malformed link: fall back to normal mailto behavior
      }
      if (!to) return;

      e.preventDefault();
      const gmail =
        'https://mail.google.com/mail/?view=cm&fs=1&to=' +
        encodeURIComponent(to) +
        (subject ? '&su=' + encodeURIComponent(subject) : '');
      window.open(gmail, '_blank', 'noopener');
    });
  });
}

initMailLinks();
