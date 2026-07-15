// // DS Business Unit — interactions
document.addEventListener('DOMContentLoaded', () => {

  // Header : fond au scroll + rétractation selon le sens du défilement
  const header = document.querySelector('.site-header');
  let lastScrollY = window.scrollY;

  const onScroll = () => {
    const currentY = window.scrollY;
    if (currentY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');

    if (currentY > lastScrollY && currentY > 160) header.classList.add('is-hidden');
    else header.classList.remove('is-hidden');

    lastScrollY = currentY;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Reveal générique au scroll (Intersection Observer)
  const revealEls = document.querySelectorAll('.reveal, .method-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => observer.observe(el));

  // Smooth scroll pour les ancres internes
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Formulaire RDV / contact en 2 étapes
  const rdvWrap = document.querySelector('.rdv-wrap');
  if (rdvWrap) {
    const form = document.getElementById('rdv-form');
    const steps = rdvWrap.querySelectorAll('.rdv-step');
    const progressSteps = rdvWrap.querySelectorAll('.rdv-progress-step');
    const domainesInput = document.getElementById('rdv-domaines-input');
    const contactInput = document.getElementById('rdv-contact-input');

    // Sélection des pastilles (multi-sélection pour domaines, sélection unique pour contact)
    rdvWrap.querySelectorAll('.rdv-pills').forEach(group => {
      const isMulti = group.dataset.group === 'domaines';
      group.querySelectorAll('.rdv-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          if (!isMulti) {
            group.querySelectorAll('.rdv-pill').forEach(p => p.classList.remove('is-selected'));
          }
          pill.classList.toggle('is-selected');

          const selected = [...group.querySelectorAll('.rdv-pill.is-selected')].map(p => p.textContent).join(', ');
          if (isMulti) domainesInput.value = selected;
          else contactInput.value = selected;
        });
      });
    });

    // Passage à l'étape 2
    rdvWrap.querySelector('.rdv-next').addEventListener('click', () => {
      steps.forEach(s => s.classList.remove('is-active'));
      rdvWrap.querySelector('[data-step="2"]').classList.add('is-active');
      progressSteps.forEach(p => p.classList.remove('is-active'));
      progressSteps[1].classList.add('is-active');
      rdvWrap.classList.add('step-2');
    });

    // Retour à l'étape 1
    rdvWrap.querySelector('.rdv-back').addEventListener('click', () => {
      steps.forEach(s => s.classList.remove('is-active'));
      rdvWrap.querySelector('[data-step="1"]').classList.add('is-active');
      progressSteps.forEach(p => p.classList.remove('is-active'));
      progressSteps[0].classList.add('is-active');
      rdvWrap.classList.remove('step-2');
    });

    // Envoi du formulaire (Netlify Forms)
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Envoi en cours…';
      submitBtn.disabled = true;

      const data = new URLSearchParams(new FormData(form)).toString();

      try {
        const response = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: data
        });
        if (response.ok) {
          rdvWrap.classList.add('is-submitted');
        } else {
          submitBtn.textContent = 'Envoyer la demande →';
          submitBtn.disabled = false;
          alert("Une erreur est survenue, merci de réessayer ou de nous contacter directement.");
        }
      } catch (err) {
        submitBtn.textContent = 'Envoyer la demande →';
        submitBtn.disabled = false;
        alert("Une erreur est survenue, merci de réessayer ou de nous contacter directement.");
      }
    });
  }

  // Menu mobile (hamburger)
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  if (menuToggle && mobileNav) {
    const closeMenu = () => {
      menuToggle.classList.remove('is-active');
      menuToggle.setAttribute('aria-expanded', 'false');
      mobileNav.classList.remove('is-open');
      document.body.style.overflow = '';
    };
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('is-open');
      menuToggle.classList.toggle('is-active', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  }

});
