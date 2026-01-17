// site.js — mobile nav + theme toggle (persisted)
const THEME_KEY = 'theme'; // 'light' | 'dark' | null (follow system)

document.addEventListener('DOMContentLoaded', () => {
  // MOBILE NAV
  const toggle = document.getElementById('mobile-nav-toggle');
  const navList = document.getElementById('nav-list');

  if (toggle && navList) {
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      navList.style.display = expanded ? 'none' : 'flex';
    });
  }

  // THEME TOGGLE
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const root = document.documentElement;

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      themeIcon.textContent = '☀️';
      if (themeToggle) themeToggle.setAttribute('aria-pressed', 'true');
    } else if (theme === 'light') {
      root.removeAttribute('data-theme');
      themeIcon.textContent = '🌙';
      if (themeToggle) themeToggle.setAttribute('aria-pressed', 'false');
    } else {
      root.removeAttribute('data-theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      themeIcon.textContent = prefersDark ? '☀️' : '🌙';
      if (themeToggle) themeToggle.setAttribute('aria-pressed', String(prefersDark));
    }
  }

  // Load saved preference
  let saved = null;
  try { saved = localStorage.getItem(THEME_KEY); } catch (e) { saved = null; }

  if (saved === 'light' || saved === 'dark') applyTheme(saved);
  else applyTheme(null);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = localStorage.getItem(THEME_KEY);
      let next;
      if (current === 'dark') next = 'light';
      else if (current === 'light') next = 'dark';
      else {
        const isDarkNow = root.getAttribute('data-theme') === 'dark' ||
          window.matchMedia('(prefers-color-scheme: dark)').matches;
        next = isDarkNow ? 'light' : 'dark';
      }

      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
      applyTheme(next);
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      const savedNow = localStorage.getItem(THEME_KEY);
      if (!savedNow) applyTheme(null);
    });
  }

  // NAV highlighting
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-list a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === current || (href === 'index.html' && current === '')) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    }
  });
});
