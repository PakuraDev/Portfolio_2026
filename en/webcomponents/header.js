class AppHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="app-header-container">
        <div class="header-logo" id="header-logo-btn" role="button" aria-label="Menu" tabindex="0">
          <img src="../assets/iconos/Menu.svg" alt="Menu" width="24" height="24">
        </div>
        <nav class="header-nav" id="header-nav">
          <a href="index.html" class="nav-capsule text-button" data-target="Home">Home</a>
          <a href="index.html#proyectos" class="nav-capsule text-button" data-target="Projects">Projects</a>
          <a href="index.html#sobre-mi" class="nav-capsule text-button" data-target="About me">About me</a>
          <a href="curriculum.html" class="nav-capsule text-button">Resume</a>
          <a href="contacto.html" class="nav-capsule text-button">Contact</a>
        </nav>
      </div>
    `;
    this.setupListeners();
  }

  setupListeners() {
    const logoBtn = this.querySelector('#header-logo-btn');
    const nav = this.querySelector('#header-nav');
    const capsules = this.querySelectorAll('.nav-capsule');

    // Toggle navigation visibility on PC, slide-in on mobile
    logoBtn.addEventListener('click', () => {
      if (window.innerWidth > 768) {
        nav.style.display = (nav.style.display === 'none') ? 'flex' : 'none';
      } else {
        nav.classList.toggle('nav-open');
      }
    });

    // Keyboard support for logo btn
    logoBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        logoBtn.click();
      }
    });

    // Set current active state based on URL
    const currentPath = window.location.pathname;
    capsules.forEach(capsule => {
      const href = capsule.getAttribute('href');
      if (currentPath.includes('contacto.html') && href.includes('contacto.html')) {
        capsule.classList.add('active');
      } else if (currentPath.includes('curriculum.html') && href.includes('curriculum.html')) {
        capsule.classList.add('active');
      } else if ((currentPath === '/' || currentPath.includes('index.html')) && href.includes('index.html')) {
        // En index marcamos Inicio por defecto (luego el JS de la página principal puede actualizar esto)
        capsule.classList.add('active');
      }
    });

    // Handle active state on click
    capsules.forEach(capsule => {
      capsule.addEventListener('click', (e) => {
        const target = capsule.getAttribute('data-target');

        if (target) {
          const isHomePage = window.location.pathname === '/' || window.location.pathname.endsWith('index.html');
          if (isHomePage) {
            e.preventDefault();
            capsules.forEach(c => c.classList.remove('active'));
            capsule.classList.add('active');

            const event = new CustomEvent('navigate-section', {
              detail: { section: target },
              bubbles: true,
              composed: true
            });
            this.dispatchEvent(event);
          }
        }

        // Close menu on mobile after clicking
        if (window.innerWidth <= 768) {
            nav.classList.remove('nav-open');
        }
      });
    });
  }
}

customElements.define('app-header', AppHeader);