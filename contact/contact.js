// Contact: the message field grows with what you write, shows the send button once there is text, and
// sends through the visitor's mail app (a static site has no server to post to).
(() => {
  const form = document.getElementById('msg'), field = document.getElementById('msg-text');
  const fit = () => { field.style.height = 'auto'; field.style.height = field.scrollHeight + 'px'; };
  // one line at display size; once it wraps, the reading size takes over (checked at display size, so it can step back up)
  const lines = () => {
    form.classList.remove('long'); field.style.height = 'auto';
    const lh = parseFloat(getComputedStyle(field).lineHeight);
    form.classList.toggle('long', field.scrollHeight > lh * 1.6);
  };
  const sync = () => { form.classList.toggle('has-text', field.value.trim() !== ''); lines(); fit(); };
  field.addEventListener('input', sync); addEventListener('resize', sync); sync();
  // Enter sends, Shift+Enter starts a new line
  field.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey && field.value.trim()) { e.preventDefault(); form.requestSubmit(); } });
  // the address is kept scrambled (each character XOR a short key), never as plain text in the page or
  // this file, so address-harvesting bots that scan pages don't find it; it's put together only on send
  const address = () => [110, 114, 104, 106, 106, 114, 100, 101, 101, 114, 108, 108, 71, 116, 104, 106, 110, 127, 43, 104, 104, 126]
    .map((c, i) => String.fromCharCode(c ^ [7, 19, 5, 11][i % 4])).join('');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const body = field.value.trim();
    if (!body) return;
    const to = address();
    location.href = `mailto:${to}?subject=${encodeURIComponent('Hello from your portfolio')}&body=${encodeURIComponent(body)}`;
  });
})();
