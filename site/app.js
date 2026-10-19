// Copy buttons on code blocks, a collapsed page list on small screens, and the one-time hero animation.
for (const block of document.querySelectorAll('.code')) {
  const button = block.querySelector('.copy');
  const code = block.querySelector('code');
  if (!button || !code) continue;
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(code.innerText.replace(/\n$/, ''));
      button.textContent = 'Copied';
      button.dataset.done = '';
    } catch {
      button.textContent = 'Select and copy';
    }
    setTimeout(() => {
      button.textContent = 'Copy';
      delete button.dataset.done;
    }, 1600);
  });
}

const pages = document.querySelector('details.pages');
if (pages && window.matchMedia('(max-width: 960px)').matches) pages.open = false;

const chain = document.querySelector('.chain');
if (chain) requestAnimationFrame(() => chain.classList.add('play'));
