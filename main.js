// ── API CONFIGURATION ────────────────────────────────
const REMOTIVE_API = 'https://remotive.com/api/remote-jobs?limit=30';
const ADZUNA_API = 'https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=84acb1f8&app_key=604acb101caa5e513108988e6878e371&results_per_page=20&what=remote&content-type=application/json';

let allJobs = [];

// ── LOAD JOBS ─────────────────────────────────────────
async function loadJobs() {
  document.getElementById('job-listings').innerHTML =
    '<div style="text-align:center;padding:3rem;">' +
    '<div style="display:inline-block;width:40px;height:40px;border:4px solid #e2e8f0;border-top-color:#4f46e5;border-radius:50%;animation:spin 0.8s linear infinite;"></div>' +
    '<p style="color:#777;margin-top:1rem;">Loading remote jobs...</p>' +
    '</div>' +
    '<style>@keyframes spin{to{transform:rotate(360deg)}}</style>';

  try {
    var remotiveRes = null;
    var adzunaRes = null;

    try {
      var r = await fetch(REMOTIVE_API);
      remotiveRes = await r.json();
    } catch(e) { remotiveRes = null; }

    try {
      var a = await fetch(ADZUNA_API);
      adzunaRes = await a.json();
    } catch(e) { adzunaRes = null; }

    var jobs = [];

    if (remotiveRes && remotiveRes.jobs) {
      for (var i = 0; i < remotiveRes.jobs.length; i++) {
        var job = remotiveRes.jobs[i];
        jobs.push({
          id: 'r-' + job.id,
          title: job.title,
          company: job.company_name,
          logo: job.company_logo || '',
          location: job.candidate_required_location || 'Worldwide',
          category: job.category ? job.category.toLowerCase().replace(/ /g, '-') : 'other',
          salary: job.salary || 'Competitive',
          tags: job.tags ? job.tags.slice(0, 3) : [],
          date: job.publication_date ? job.publication_date.split('T')[0] : '',
          applyLink: job.url,
          source: 'Remotive'
        });
      }
    }

    if (adzunaRes && adzunaRes.results) {
      for (var j = 0; j < adzunaRes.results.length; j++) {
        var ajob = adzunaRes.results[j];
        var companyName = (ajob.company && ajob.company.display_name) ? ajob.company.display_name : 'Company';
        var locationName = (ajob.location && ajob.location.display_name) ? ajob.location.display_name : 'India';
        var categoryTag = (ajob.category && ajob.category.tag) ? ajob.category.tag : 'other';
        var categoryLabel = (ajob.category && ajob.category.label) ? ajob.category.label : 'Remote';
        var salary = ajob.salary_min
          ? '₹' + Math.round(ajob.salary_min / 100000) + '–' + Math.round(ajob.salary_max / 100000) + ' LPA'
          : 'Competitive';
        jobs.push({
          id: 'a-' + ajob.id,
          title: ajob.title,
          company: companyName,
          logo: '',
          location: locationName,
          category: categoryTag,
          salary: salary,
          tags: [categoryLabel],
          date: ajob.created ? ajob.created.split('T')[0] : '',
          applyLink: ajob.redirect_url,
          source: 'Adzuna'
        });
      }
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
  var listing = document.getElementById('job-listings');
  var countEl = document.getElementById('job-count');
  listing.innerHTML = '';

  if (countEl) countEl.textContent = 'Showing ' + jobs.length + ' remote jobs';

  if (jobs.length === 0) {
    listing.innerHTML = '<p style="text-align:center;color:#777;padding:2rem;">No jobs found.</p>';
    return;
  }

  for (var i = 0; i < jobs.length; i++) {
    var job = jobs[i];
    var initial = job.company.charAt(0).toUpperCase();

    var logoHTML = job.logo
      ? '<img src="' + job.logo + '" alt="' + job.company + '" ' +
        'onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\';" ' +
        'style="width:48px;height:48px;object-fit:contain;border-radius:8px;border:1px solid #e2e8f0;padding:4px;margin-right:1rem;background:#fff;flex-shrink:0;">' +
        '<div style="display:none;width:48px;height:48px;border-radius:8px;background:#4f46e5;color:#fff;align-items:center;justify-content:center;font-weight:bold;font-size:1.2rem;margin-right:1rem;flex-shrink:0;">' + initial + '</div>'
      : '<div style="width:48px;height:48px;border-radius:8px;background:#4f46e5;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:1.2rem;margin-right:1rem;flex-shrink:0;">' + initial + '</div>';

    var tagsHTML = '<span class="tag green">Remote</span>';
    for (var t = 0; t < job.tags.length; t++) {
      tagsHTML += '<span class="tag">' + job.tags[t] + '</span>';
    }
    tagsHTML += '<span class="tag" style="background:#e8f0fe;color:#1a56db;">' + job.source + '</span>';

    var card = document.createElement('div');
    card.className = 'job-card';
    card.setAttribute('data-category', job.category);
    card.innerHTML =
      '<div class="job-info" style="display:flex;align-items:flex-start;">' +
        logoHTML +
        '<div>' +
          '<h2>' + job.title + '</h2>' +
          '<p class="company">' + job.company + ' · ' + job.location + '</p>' +
          '<div class="tags">' + tagsHTML + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="job-meta">' +
        '<span class="salary">' + job.salary + '</span>' +
        '<span class="date">' + job.date + '</span>' +
        '<a href="' + job.applyLink + '" class="apply-btn" target="_blank">Apply Now</a>' +
      '</div>';

    listing.appendChild(card);
  }
}

// ── SEARCH ───────────────────────────────────────────
function filterJobs() {
  var query = document.getElementById('searchInput').value.toLowerCase();
  var filtered = [];
  for (var i = 0; i < allJobs.length; i++) {
    var job = allJobs[i];
    var match = job.title.toLowerCase().indexOf(query) > -1 ||
                job.company.toLowerCase().indexOf(query) > -1 ||
                job.location.toLowerCase().indexOf(query) > -1;
    if (!match) {
      for (var t = 0; t < job.tags.length; t++) {
        if (job.tags[t].toLowerCase().indexOf(query) > -1) { match = true; break; }
      }
    }
    if (match) filtered.push(job);
  }
  renderJobs(filtered);
}

// ── CATEGORY FILTER ──────────────────────────────────
function filterByCategory(category) {
  var buttons = document.querySelectorAll('.filter-btn');
  for (var i = 0; i < buttons.length; i++) buttons[i].classList.remove('active');
  event.target.classList.add('active');
  var filtered = [];
  for (var j = 0; j < allJobs.length; j++) {
    if (category === 'all' || allJobs[j].category.indexOf(category) > -1) {
      filtered.push(allJobs[j]);
    }
  }
  renderJobs(filtered);
}

// ── NEWSLETTER ───────────────────────────────────────
function subscribeNewsletter(e) {
  e.preventDefault();
  var email = document.getElementById('emailInput').value;
  document.getElementById('newsletter-msg').textContent =
    'Thanks! ' + email + ' has been subscribed.';
  document.getElementById('emailInput').value = '';
}

// ── POST A JOB ───────────────────────────────────────
function submitJob(e) {
  e.preventDefault();
  document.getElementById('job-form-msg').textContent =
    'Job submitted! We will review and publish it within 24 hours.';
  e.target.reset();
}

// ── START ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  loadJobs();
  var searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('keyup', function(e) {
      if (e.key === 'Enter') filterJobs();
    });
  }
});