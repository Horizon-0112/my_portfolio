

const SITE_CONFIG = {
  email: 'honneung13@gmail.com', // Used for display + clipboard copy
  emailDomain: 'gmail.com',      // Shown in terminal DNS line (optional flavor)
};

(function () {
  const { email, emailDomain } = SITE_CONFIG;

  const emailDisplay = document.getElementById('email-display');
  if (emailDisplay) emailDisplay.textContent = email;

  // HUD clock
  function updateClock() {
    const el = document.getElementById('hud-clock');
    if (!el) return;
    const now = new Date();
    el.textContent = now.toTimeString().slice(0, 8);
  }
  updateClock();
  setInterval(updateClock, 1000);

  // Mobile menu
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const isHidden = mobileMenu.classList.toggle('hidden');
      menuToggle.setAttribute('aria-expanded', String(!isHidden));
      menuToggle.innerHTML = isHidden
        ? '<i class="ri-menu-3-line"></i>'
        : '<i class="ri-close-line"></i>';
    });

    document.querySelectorAll('.mobile-link').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.innerHTML = '<i class="ri-menu-3-line"></i>';
      });
    });
  }

  // Skill bars on scroll
  const augmentSection = document.getElementById('augment');
  const bootLine = document.getElementById('augment-boot');
  let skillsAnimated = false;

  function animateSkills() {
    if (skillsAnimated) return;
    skillsAnimated = true;

    if (bootLine) {
      bootLine.textContent = '> Augmentation matrix loaded. All systems nominal.';
      bootLine.classList.remove('terminal-cursor');
    }

    document.querySelectorAll('.bar-fill').forEach((bar, i) => {
      setTimeout(() => {
        bar.classList.add('loaded');
        const row = bar.closest('.skill-row');
        const pct = row?.dataset.width || '0%';
        const label = row?.querySelector('.skill-pct');
        const num = parseInt(pct, 10);
        let current = 0;
        const step = Math.max(1, Math.floor(num / 30));
        const timer = setInterval(() => {
          current = Math.min(num, current + step);
          if (label) label.textContent = current + '%';
          if (current >= num) clearInterval(timer);
        }, 40);
      }, i * 120);
    });
  }

  if (augmentSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateSkills();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );
    observer.observe(augmentSection);
  } else {
    animateSkills();
  }

  // Terminal connect + copy email
  const connectBtn = document.getElementById('connect-btn');
  const terminalOutput = document.getElementById('terminal-output');

  function appendLine(html, className) {
    const p = document.createElement('p');
    if (className) p.className = className;
    p.innerHTML = html;
    terminalOutput.appendChild(p);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  connectBtn?.addEventListener('click', async () => {
    connectBtn.disabled = true;
    connectBtn.classList.add('opacity-60', 'cursor-not-allowed');

    appendLine('&gt; CONNECTING TO HOST...', 'text-cyber-yellow');
    await delay(400);
    appendLine(`&gt; Resolving DNS: ${emailDomain} ... OK`, 'text-gray-500');
    await delay(500);
    appendLine('&gt; Handshake: TLS 1.3 ████████████ 100%', 'text-cyber-cyan');
    await delay(450);
    appendLine('&gt; AUTH: channel open', 'text-gray-500');
    await delay(400);

    try {
      await navigator.clipboard.writeText(email);
      appendLine(
        `&gt; EMAIL copied: <span class="text-cyber-green">${email}</span>`,
        'text-cyber-green'
      );
      appendLine('&gt; STATUS: <span class="glow-green">UPLINK ESTABLISHED</span>', '');
    } catch {
      appendLine(
        `&gt; Clipboard blocked. Copy manually: <span class="text-cyber-pink">${email}</span>`,
        'text-cyber-pink'
      );
    }

    await delay(300);
    appendLine('&gt; Idle. Press CONNECT to copy again.', 'text-gray-600');

    connectBtn.disabled = false;
    connectBtn.classList.remove('opacity-60', 'cursor-not-allowed');
  });

  // Smooth scroll for in-page links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();
