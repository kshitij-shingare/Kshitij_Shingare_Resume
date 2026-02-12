// ===== Load Resume Data & Render =====
document.addEventListener('DOMContentLoaded', () => {
  fetch('resume.json')
    .then(res => res.json())
    .then(data => {
      renderHero(data);
      renderSummary(data);
      renderSkills(data);
      renderExperience(data);
      renderEducation(data);
      renderProjects(data);
      renderFooterLinks(data);
      renderGitHubGraph();
      initScrollAnimations();
    })
    .catch(err => console.error('Failed to load resume data:', err));

  initThemeToggle();
});

// ===== Hero Section =====
function renderHero(data) {
  // Avatar initials
  const initials = data.name.split(' ').map(w => w[0]).join('');
  document.getElementById('avatarInitials').textContent = initials;

  // Name & title
  document.getElementById('name').textContent = data.name;
  document.getElementById('title').textContent = data.title;

  // Social links
  const heroLinks = document.getElementById('heroLinks');
  const links = [
    { icon: 'fab fa-github', url: `https://github.com/${data.github}`, title: 'GitHub' },
    { icon: 'fab fa-linkedin', url: `https://linkedin.com/in/${data.linkedin}`, title: 'LinkedIn' },
    { icon: 'fas fa-envelope', url: `mailto:${data.email}`, title: 'Email' },
  ];
  links.forEach(link => {
    const a = document.createElement('a');
    a.href = link.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.title = link.title;
    a.innerHTML = `<i class="${link.icon}"></i>`;
    heroLinks.appendChild(a);
  });
}

// ===== Summary =====
function renderSummary(data) {
  document.getElementById('summaryText').textContent = data.summary;
}

// ===== Skills =====
function renderSkills(data) {
  const grid = document.getElementById('skillsGrid');
  Object.entries(data.skills).forEach(([category, skills]) => {
    const div = document.createElement('div');
    div.className = 'skill-category';
    div.innerHTML = `
      <h3>${category}</h3>
      <div class="skill-tags">
        ${skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
      </div>
    `;
    grid.appendChild(div);
  });
}

// ===== Experience =====
function renderExperience(data) {
  const container = document.getElementById('experienceList');
  data.experience.forEach(exp => {
    const div = document.createElement('div');
    div.className = 'exp-item';
    div.innerHTML = `
      <h3>${exp.role}</h3>
      <p class="exp-meta">${exp.company} &middot; ${exp.duration}</p>
      ${exp.highlights ? `
        <ul>
          ${exp.highlights.map(h => `<li>${h}</li>`).join('')}
        </ul>
      ` : ''}
    `;
    container.appendChild(div);
  });
}

// ===== Education =====
function renderEducation(data) {
  const container = document.getElementById('educationList');
  data.education.forEach(edu => {
    const div = document.createElement('div');
    div.className = 'edu-item';
    div.innerHTML = `
      <div>
        <h3>${edu.degree}</h3>
        <p>${edu.institution}</p>
      </div>
      <span class="edu-year">${edu.year}</span>
    `;
    container.appendChild(div);
  });
}

// ===== Projects =====
function renderProjects(data) {
  const container = document.getElementById('projectsList');
  data.projects.forEach(proj => {
    const div = document.createElement('div');
    div.className = 'project-card';
    div.innerHTML = `
      <h3>${proj.name}</h3>
      <p>${proj.description}</p>
      <div class="project-tech">
        ${proj.tech.map(t => `<span>${t}</span>`).join('')}
      </div>
    `;
    container.appendChild(div);
  });
}

// ===== Footer Links =====
function renderFooterLinks(data) {
  const container = document.getElementById('footerLinks');
  const links = [
    { icon: 'fab fa-github', url: `https://github.com/${data.github}` },
    { icon: 'fab fa-linkedin', url: `https://linkedin.com/in/${data.linkedin}` },
    { icon: 'fas fa-envelope', url: `mailto:${data.email}` },
  ];
  links.forEach(link => {
    const a = document.createElement('a');
    a.href = link.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.innerHTML = `<i class="${link.icon}"></i>`;
    container.appendChild(a);
  });
}

// ===== GitHub Contribution Graph — spells "KBS" =====
function renderGitHubGraph() {
  const graph = document.getElementById('githubGraph');
  const weeks = 52;
  const days = 7;

  // Define letters as columns (each sub-array = 7 rows for one week-column)
  // 1 = lit cell, 0 = empty
  const K = [
    [1,1,1,1,1,1,1],
    [0,0,0,1,0,0,0],
    [0,0,1,0,1,0,0],
    [0,1,0,0,0,1,0],
    [1,0,0,0,0,0,1],
  ];
  const B = [
    [1,1,1,1,1,1,1],
    [1,0,0,1,0,0,1],
    [1,0,0,1,0,0,1],
    [1,0,0,1,0,0,1],
    [0,1,1,0,1,1,0],
  ];
  const S = [
    [0,1,1,0,0,1,0],
    [1,0,0,1,0,0,1],
    [1,0,0,1,0,0,1],
    [1,0,0,1,0,0,1],
    [0,1,0,0,1,1,0],
  ];

  const gap = [
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
  ];

  // Compose the full pattern: gap + K + gap + B + gap + S
  // Total letter columns = 5+2+5+2+5 = 19, center in 52 weeks
  const letterPattern = [...K, ...gap, ...B, ...gap, ...S];
  const padStart = Math.floor((weeks - letterPattern.length) / 2);

  // Build a 52-column pattern map
  const patternMap = {};
  letterPattern.forEach((col, i) => {
    patternMap[padStart + i] = col;
  });

  for (let w = 0; w < weeks; w++) {
    for (let d = 0; d < days; d++) {
      const cell = document.createElement('div');
      cell.className = 'gh-cell';

      let level = 0;

      if (patternMap[w] && patternMap[w][d] === 1) {
        // Letter cell: use bright levels (3 or 4)
        level = pseudoRandom(w * 7 + d) > 0.4 ? 4 : 3;
      } else {
        // Background: sparse light activity for realism
        const rand = pseudoRandom(w * 7 + d + 999);
        if (rand > 0.85) level = 1;
      }

      cell.setAttribute('data-level', level);

      const date = getDateFromWeekDay(w, d);
      const contributions = level === 0 ? 'No' : level * 2;
      cell.title = `${contributions} contributions on ${date}`;

      graph.appendChild(cell);
    }
  }
}

// Simple seeded pseudo-random for consistent graph
function pseudoRandom(seed) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

// Get a formatted date string from week/day offset
function getDateFromWeekDay(week, day) {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - (52 * 7) + (week * 7) + day);
  return start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ===== Theme Toggle =====
function initThemeToggle() {
  const btn = document.getElementById('themeToggle');
  const saved = localStorage.getItem('theme');

  if (saved === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    btn.innerHTML = '<i class="fas fa-sun"></i>';
  }

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    if (current === 'light') {
      document.documentElement.removeAttribute('data-theme');
      btn.innerHTML = '<i class="fas fa-moon"></i>';
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      btn.innerHTML = '<i class="fas fa-sun"></i>';
      localStorage.setItem('theme', 'light');
    }
  });
}

// ===== Scroll Animations =====
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

