// ── SEARCH ──────────────────────────────────────────
function filterJobs() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const cards = document.querySelectorAll('.job-card');
  cards.forEach(card => {
    const text = card.innerText.toLowerCase();
    card.style.display = text.includes(query) ? 'flex' : 'none';
  });
}

// Search on Enter key
document.getElementById('searchInput').addEventListener('keyup', function(e) {
  if (e.key === 'Enter') filterJobs();
});

// ── CATEGORY FILTER ──────────────────────────────────
function filterByCategory(category) {
  const cards = document.querySelectorAll('.job-card');
  const buttons = document.querySelectorAll('.filter-btn');

  buttons.forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  cards.forEach(card => {
    if (category === 'all' || card.dataset.category === category) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

// ── NEWSLETTER SIGNUP ────────────────────────────────
function subscribeNewsletter(e) {
  e.preventDefault();
  const email = document.getElementById('emailInput').value;
  const msg = document.getElementById('newsletter-msg');
  msg.textContent = `✅ Thanks! ${email} has been subscribed.`;
  document.getElementById('emailInput').value = '';
}

// ── POST A JOB FORM ──────────────────────────────────
function submitJob(e) {
  e.preventDefault();
  const msg = document.getElementById('job-form-msg');
  msg.textContent = '✅ Job submitted! We\'ll review and publish it within 24 hours.';
  e.target.reset();
}