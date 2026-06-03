// ── LOAD JOBS FROM jobs.json ─────────────────────────
async function loadJobs() {
  const response = await fetch('jobs.json');
  const jobs = await response.json();
  displayJobs(jobs);
}

// ── DISPLAY JOBS ON PAGE ─────────────────────────────
function displayJobs(jobs) {
  const container = document.getElementById('job-listings');
  container.innerHTML = '';

  if (jobs.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:#777;">No jobs found.</p>';
    return;
  }

  jobs.forEach(job => {
    const card = document.createElement('div');
    card.classList.add('job-card');
    card.dataset.category = job.category;

    card.innerHTML = `
      <div class="job-info">
        <h2>${job.title}</h2>
        <p class="company">${job.company} · ${job.location}</p>
        <div class="tags">
          ${job.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
      </div>
      <div class="job-meta">
        <span class="salary">${job.salary}</span>
        <span class="date">${job.date}</span>
        <a href="${job.applyLink}" target="_blank" class="apply-btn">Apply Now</a>
      </div>
    `;

    container.appendChild(card);
  });
}

// ── SEARCH ───────────────────────────────────────────
function filterJobs() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const cards = document.querySelectorAll('.job-card');
  cards.forEach(card => {
    card.style.display = card.innerText.toLowerCase().includes(query) ? 'flex' : 'none';
  });
}

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

// ── NEWSLETTER ───────────────────────────────────────
function subscribeNewsletter(e) {
  e.preventDefault();
  const email = document.getElementById('emailInput').value;
  document.getElementById('newsletter-msg').textContent = `✅ Thanks! ${email} has been subscribed.`;
  document.getElementById('emailInput').value = '';
}

// ── POST A JOB ───────────────────────────────────────
function submitJob(e) {
  e.preventDefault();
  document.getElementById('job-form-msg').textContent = '✅ Job submitted! We\'ll review and publish it within 24 hours.';
  e.target.reset();
}

// ── START ────────────────────────────────────────────
loadJobs();
