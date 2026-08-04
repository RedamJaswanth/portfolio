(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------
     Boot loader
  ------------------------------------------------------------------ */
  const boot = document.getElementById('boot-loader');
  if (boot) {
    const fill = boot.querySelector('.boot-fill');
    const pct = boot.querySelector('.boot-pct');
    let p = 0;
    const step = () => {
      p += Math.random() * 18 + 8;
      if (p >= 100) p = 100;
      fill.style.width = p + '%';
      pct.textContent = String(Math.floor(p)).padStart(2, '0') + '%';
      if (p < 100) {
        setTimeout(step, 90);
      } else {
        setTimeout(() => boot.classList.add('hidden'), 250);
      }
    };
    if (reduceMotion) {
      boot.classList.add('hidden');
    } else {
      setTimeout(step, 200);
    }
  }

  /* ------------------------------------------------------------------
     Footer year
  ------------------------------------------------------------------ */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------------------------------------------------------
     Navbar: scroll shadow + mobile toggle
  ------------------------------------------------------------------ */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const backToTop = document.getElementById('back-to-top');

  const onScroll = () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 20);
    backToTop.classList.toggle('show', y > 600);
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ------------------------------------------------------------------
     Scrollspy — highlight active nav link
  ------------------------------------------------------------------ */
  const sections = document.querySelectorAll('main section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  const spy = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (!link) return;
      if (entry.isIntersecting) {
        navItems.forEach(n => n.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0 });
  sections.forEach(s => spy.observe(s));

  /* ------------------------------------------------------------------
     Scroll reveal animations
  ------------------------------------------------------------------ */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ------------------------------------------------------------------
     Skill progress bars — fill on view
  ------------------------------------------------------------------ */
  const bars = document.querySelectorAll('.bar');
  const barObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('filled');
        barObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(b => barObserver.observe(b));

  /* ------------------------------------------------------------------
     Typing animation
  ------------------------------------------------------------------ */
  const typingEl = document.getElementById('typing-text');
  const phrases = [
    'Generative AI Engineer',
    'LLM Developer',
    'RAG Developer',
    'AI Agent Builder',
    'Python Developer'
  ];

  if (typingEl) {
    if (reduceMotion) {
      typingEl.textContent = phrases[0];
    } else {
      let phraseIndex = 0, charIndex = 0, deleting = false;

      const tick = () => {
        const current = phrases[phraseIndex];
        if (!deleting) {
          charIndex++;
          typingEl.textContent = current.slice(0, charIndex);
          if (charIndex === current.length) {
            deleting = true;
            setTimeout(tick, 1400);
            return;
          }
        } else {
          charIndex--;
          typingEl.textContent = current.slice(0, charIndex);
          if (charIndex === 0) {
            deleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
          }
        }
        setTimeout(tick, deleting ? 35 : 65);
      };
      tick();
    }
  }

  /* ------------------------------------------------------------------
     Neural network canvas background (hero)
  ------------------------------------------------------------------ */
  const canvas = document.getElementById('neural-canvas');
  if (canvas && !reduceMotion) {
    const ctx = canvas.getContext('2d');
    let w, h, nodes, animId;
    const NODE_COUNT_BASE = 70;

    const resize = () => {
      const hero = canvas.parentElement;
      w = canvas.width = hero.offsetWidth;
      h = canvas.height = hero.offsetHeight;
      const count = Math.min(NODE_COUNT_BASE, Math.floor((w * h) / 18000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.8
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const maxDist = 130;

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        a.x += a.vx; a.y += a.vy;
        if (a.x < 0 || a.x > w) a.vx *= -1;
        if (a.y < 0 || a.y > h) a.vy *= -1;

        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            ctx.strokeStyle = `rgba(0, 229, 255, ${(1 - dist / maxDist) * 0.18})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(120, 190, 255, 0.75)';
        ctx.shadowColor = 'rgba(0, 229, 255, 0.8)';
        ctx.shadowBlur = 6;
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    };

    resize();
    draw();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        cancelAnimationFrame(animId);
        resize();
        draw();
      }, 200);
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(animId);
      else draw();
    });
  }

  /* ------------------------------------------------------------------
     3D tilt on project cards
  ------------------------------------------------------------------ */
  if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `translateY(-8px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ------------------------------------------------------------------
     Contact form — client-side validation (front-end only demo)
  ------------------------------------------------------------------ */
  const form = document.getElementById('contact-form');
  if (form) {
    const status = document.getElementById('form-status');
    const fields = {
      name: { el: document.getElementById('name'), err: document.getElementById('err-name') },
      email: { el: document.getElementById('email'), err: document.getElementById('err-email') },
      message: { el: document.getElementById('message'), err: document.getElementById('err-message') }
    };

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const validateField = (key) => {
      const { el, err } = fields[key];
      let msg = '';
      const val = el.value.trim();
      if (key === 'name' && val.length < 2) msg = 'Please enter your name.';
      if (key === 'email' && !emailRe.test(val)) msg = 'Please enter a valid email address.';
      if (key === 'message' && val.length < 10) msg = 'Message should be at least 10 characters.';
      err.textContent = msg;
      el.classList.toggle('invalid', Boolean(msg));
      return !msg;
    };

    Object.keys(fields).forEach(key => {
      fields[key].el.addEventListener('blur', () => validateField(key));
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const results = Object.keys(fields).map(validateField);
      const allValid = results.every(Boolean);

      if (!allValid) {
        status.textContent = 'Please fix the highlighted fields.';
        status.style.color = '#ff5c7a';
        return;
      }

      status.style.color = '';
      status.textContent = 'Sending…';

      const name = encodeURIComponent(fields.name.el.value.trim());
      const email = encodeURIComponent(fields.email.el.value.trim());
      const message = encodeURIComponent(fields.message.el.value.trim());
      const subject = encodeURIComponent(`Portfolio inquiry from ${fields.name.el.value.trim()}`);
      const body = `Name: ${decodeURIComponent(name)}%0AEmail: ${decodeURIComponent(email)}%0A%0A${decodeURIComponent(message)}`;

      setTimeout(() => {
        window.location.href = `mailto:jaswanthredam@gmail.com?subject=${subject}&body=${body}`;
        status.textContent = "Your email app should open now — thanks for reaching out!";
        form.reset();
      }, 500);
    });
  }
})();
