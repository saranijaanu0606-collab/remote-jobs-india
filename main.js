// ── API CONFIGURATION ────────────────────────────────
const REMOTIVE_API = 'https://remotive.com/api/remote-jobs?limit=30';
const ADZUNA_API = 'https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=84acb1f8&app_key=604acb101caa5e513108988e6878e371&results_per_page=20&what=remote&content-type=application/json';

let allJobs = [];

// ── LOAD JOBS FROM BOTH APIS ─────────────────────────
async function loadJobs() {
  document.getElementById('job-listings').innerHTML =
    '<p style="text-align:center;color:#777;padding:2rem;">Loading jobs...</p>';

  try {
    const [remotiveRes, adzunaRes] = await Promise.allSettled([
      fetch(REMOTIVE_API).then(r => r.json()),
      fetch(ADZUNA_API).then(r => r.json())
    ]);

    let jobs = [];

    // Remotive jobs
    if (remotiveRes.status === 'fulfilled') {
      const remotive = remotiveRes.value.jobs.map(job => ({
        id: 'r-' + job.id,
        title: job.title,
        company: job.company_name,
        location: job.candidate_required_location || 'Worldwide',
        category: job.category ? job.category.toLowerCase().replace(/ /g, '-') : 'other',
        salary: job.salary || 'Competitive',
        tags: job.tags ? job.tags.slice(0, 3) : [],
        date: job.publication_date ? job.publication_date.split('T')[0] : '',
        applyLink: job.url,
        source: 'Remotive'
      }));
      jobs = jobs.concat(remotive);
    }

    // Adzuna India jobs
    if (adzunaRes.status === 'fulfilled' && adzunaRes.value.results) {
      const adzuna = adzunaRes.value.results.map(job => ({
        id: 'a-' + job.id,
        title: job.title,
        company: job.company?.display_name || 'Company',
        location: job.location?.display_name || 'India',
        category: job.category?.tag || 'other',
        salary: job.salary_min
          ? '₹' + Math.round(job.salary_min / 100000) + '–' + Math.round(job.salary_max / 100000) + ' LPA'
          : 'Competitive',
        tags: [job.category?.label || 'Remote'],
        date: job.created ? job.created.split('T')[0] : '',
        applyLink: job.redirect_url,
        source: 'Adzuna'
      }));
      jobs = jobs.concat(adzuna);
    }

    allJobs = jobs;
    renderJobs(allJobs);

  } catch (err) {
    document.getElementById('job-listings').innerHTML =
      '<p style="text-align:center;color:#e94560;padding:2rem;">Failed to load jobs. Please refresh.</p>';
  }
}

// ── RENDER JOBS ──────────────────────────────────────
function renderJobs(jobs) {
  const listing = document.getElementById('job-listings');
  listing.innerHTML = '';
  if (jobs.length === 0) {
    listing.innerHTML = '<p style="text-align:center;color:#777;padding:2rem;">No jobs found.</p>';
    return;
  }
  jobs.forEach(job => {
    listing.innerHTML += `
      <div class="job-card" data-category="${job.category}">
        <div class="job-info">
          <h2>${job.title}</h2>
          <p class="company">${job.company} · ${job.location}</p>
          <div class="tags">
            <span class="tag green">Remote</span>
            ${job.tags.map(t => `<span class="tag">${t}</span>`).join('')}
            <span class="tag" style="background:#e8f0fe;color:#1a56db;">${job.source}</span>
          </div>
        </div>
        <div class="job-meta">
          <span class="salary">${job.salary}</span>
          <span class="date">${job.date}</span>
          <a href="${job.applyLink}" class="apply-btn" target="_blank">Apply Now</a>
        </div>
      </div>`;
  });
}

// ── SEARCH ───────────────────────────────────────────
function filterJobs() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const filtered = allJobs.filter(job =>
    job.title.toLowerCase().includes(query) ||
    job.company.toLowerCase().includes(query) ||
    job.location.toLowerCase().includes(query) ||
    job.tags.some(t => t.toLowerCase().includes(query))
  );
  renderJobs(filtered);
}

// ── CATEGORY FILTER ──────────────────────────────────
function filterByCategory(category) {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  const filtered = category === 'all'
    ? allJobs
    : allJobs.filter(j => j.category.includes(category));
  renderJobs(filtered);
}

// ── NEWSLETTER ───────────────────────────────────────
function subscribeNewsletter(e) {
  e.preventDefault();
  const email = document.getElementById('emailInput').value;
  document.getElementById('newsletter-msg').textContent =
    `✅ Thanks! ${email} has been subscribed.`;
  document.getElementById('emailInput').value = '';
}

// ── POST A JOB ───────────────────────────────────────
function submitJob(e) {
  e.preventDefault();
  document.getElementById('job-form-msg').textContent =
    '✅ Job submitted! We will review and publish it within 24 hours.';
  e.target.reset();
}

// ── START ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  loadJobs();
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('keyup', function(e) {
      if (e.key === 'Enter') filterJobs();
    });
  }
});
