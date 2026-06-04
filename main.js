let allJobs = [];

// Load jobs from jobs.json
fetch('jobs.json')
  .then(res => res.json())
  .then(data => {
    allJobs = data;
    renderJobs(allJobs);
  });

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
          </div>
        </div>
        <div class="job-meta">
          <span class="salary">₹${job.salary}</span>
          <span class="date">${job.date}</span>
          <a href="${job.applyLink}" class="apply-btn" target="_blank">Apply Now</a>
        </div>
      </div>`;
  });
}

function filterJobs() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const filtered = allJobs.filter(job =>
    job.title.toLowerCase().includes(query) ||
    job.company.toLowerCase().includes(query) ||
    job.tags.some(t => t.toLowerCase().includes(query))
  );
  renderJobs(filtered);
}

document.getElementById('searchInput').addEventListener('keyup', function(e) {
  if (e.key === 'Enter') filterJobs();
});

function filterByCategory(category) {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  const filtered = category === 'all' ? allJobs : allJobs.filter(j => j.category === category);
  renderJobs(filtered);
}

function subscribeNewsletter(e) {
  e.preventDefault();
  const email = document.getElementById('emailInput').value;
  document.getElementById('newsletter-msg').textContent = `✅ Thanks! ${email} has been subscribed.`;
  document.getElementById('emailInput').value = '';
}

function submitJob(e) {
  e.preventDefault();
  document.getElementById('job-form-msg').textContent = '✅ Job submitted! We\'ll review and publish it within 24 hours.';
  e.target.reset();
}