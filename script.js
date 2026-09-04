document.documentElement.classList.add('js-ready');

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.header');
  const mobileButton = document.querySelector('.mobile-button');
  const menu = document.querySelector('.menu');

  if (mobileButton && menu) {
    mobileButton.setAttribute('aria-expanded', 'false');

    mobileButton.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      mobileButton.setAttribute('aria-expanded', String(open));
      const icon = mobileButton.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars', !open);
        icon.classList.toggle('fa-xmark', open);
      }
    });

    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('open');
        mobileButton.setAttribute('aria-expanded', 'false');
        const icon = mobileButton.querySelector('i');
        if (icon) {
          icon.classList.add('fa-bars');
          icon.classList.remove('fa-xmark');
        }
      });
    });
  }

  const onScroll = () => {
    if (header) header.classList.toggle('scrolled', window.scrollY > 40);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }

  // Ranking: category filters and text search.
  const filters = document.querySelectorAll('.filter[data-category]');
  const search = document.querySelector('.search');
  const rows = document.querySelectorAll('.ranking-row[data-category]');

  function applyRankingFilters() {
    const active = document.querySelector('.filter[data-category].active')?.dataset.category || 'geral';
    const term = (search?.value || '').trim().toLowerCase();

    rows.forEach(row => {
      const category = (row.dataset.category || '').toLowerCase();
      const text = row.textContent.toLowerCase();
      const categoryOK = active === 'geral' || category === active;
      const searchOK = !term || text.includes(term);
      row.style.display = categoryOK && searchOK ? 'grid' : 'none';
    });
  }

  filters.forEach(button => {
    button.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      button.classList.add('active');
      applyRankingFilters();
    });
  });

  search?.addEventListener('input', applyRankingFilters);
  applyRankingFilters();

  // Demo login: keeps the e-mail locally so the interface can show a confirmation.
  const loginForm = document.getElementById('loginForm');
  const loginMsg = document.getElementById('loginMsg');

  loginForm?.addEventListener('submit', event => {
    event.preventDefault();
    const email = document.getElementById('loginEmail')?.value.trim();

    if (!email) return;

    localStorage.setItem('judoBrasiliaDemoEmail', email);

    if (loginMsg) {
      loginMsg.className = 'notice';
      loginMsg.textContent =
        'Login demonstrativo realizado. Para autenticação real, é necessário conectar este formulário a um backend seguro.';
    }
  });

  // Demo contact form.
  const contactForm = document.getElementById('contactForm');
  const contactMsg = document.getElementById('contactMsg');

  contactForm?.addEventListener('submit', event => {
    event.preventDefault();

    if (contactMsg) {
      contactMsg.className = 'notice';
      contactMsg.textContent =
        'Mensagem preparada com sucesso. Nesta versão estática, o envio real precisa ser conectado a um serviço de formulário ou backend.';
    }

    contactForm.reset();
  });

  // Small accessibility improvement: close mobile menu with Escape.
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu?.classList.contains('open')) {
      menu.classList.remove('open');
      mobileButton?.setAttribute('aria-expanded', 'false');
      const icon = mobileButton?.querySelector('i');
      if (icon) {
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-xmark');
      }
    }
  });

  // Current year in footer.
  document.querySelectorAll('#year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });
});
