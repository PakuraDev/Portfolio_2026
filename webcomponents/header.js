class AppHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="app-header-container">
        <div class="header-logo" id="header-logo-btn" role="button" aria-label="Menu" tabindex="0">
          <img src="./assets/iconos/Menu.svg" alt="Menu" width="24" height="24">
        </div>
        <nav class="header-nav" id="header-nav">
          <a href="/" class="nav-capsule text-button" data-target="Inicio">Inicio</a>
          <a href="/#proyectos" class="nav-capsule text-button" data-target="Proyectos">Proyectos</a>
          <a href="/#sobre-mi" class="nav-capsule text-button" data-target="Sobre mí">Sobre mí</a>
          <a href="curriculum.html" class="nav-capsule text-button">Currículum</a>
          <a href="contacto.html" class="nav-capsule text-button">Contacto</a>
        </nav>
      </div>
    `;
    this.setupListeners();
  }

  setupListeners() {
    const logoBtn = this.querySelector('#header-logo-btn');
    const nav = this.querySelector('#header-nav');
    const capsules = this.querySelectorAll('.nav-capsule');

    // Muestra u oculta la navegación
    logoBtn.addEventListener('click', () => {
      // Si estamos en PC oculta/muestra la navegación, en movil la despliega
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

    // Establece el estado activo actual según la URL
    const currentPath = window.location.pathname;
    capsules.forEach(capsule => {
      const href = capsule.getAttribute('href');
      // Lógica simple para marcar activo
      if (currentPath.includes('contacto.html') && href.includes('contacto.html')) {
        capsule.classList.add('active');
      } else if (currentPath.includes('curriculum.html') && href.includes('curriculum.html')) {
        capsule.classList.add('active');
      } else if ((currentPath === '/' || currentPath.includes('index.html')) && href === '/') {
        // En index marcamos Inicio por defecto (luego el JS de la página principal puede actualizar esto)
        capsule.classList.add('active');
      }
    });

    // Maneja el estado activo al hacer clic
    capsules.forEach(capsule => {
      capsule.addEventListener('click', (e) => {
        const target = capsule.getAttribute('data-target');
        
        // Si no es un enlace real a otra página (los de navegación in-page)
        if (target) {
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
        
        // En movil cerramos el menú después de hacer click
        if (window.innerWidth <= 768) {
            nav.classList.remove('nav-open');
        }
      });
    });
  }
}

customElements.define('app-header', AppHeader);
