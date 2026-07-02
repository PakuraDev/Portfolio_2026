class AppFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="app-footer">
        <!-- Left Section -->
        <div class="footer-left-part">

          <!-- Brand box -->
          <div class="footer-brand-box">
            <div class="footer-texts">
              <h3 class="text-h3 text-azul">Alejandro Pérez &copy; 2026</h3>
              <p class="text-p-large text-azul footer-brand-desc" style="align-self: stretch;">Design without soul is not design. Code without criteria is not a product. Here I try to make both happen at once.</p>
            </div>
            <div class="footer-logo">
              <svg width="84" height="84" viewBox="0 0 84 84" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M84 0H0V18H84V0Z" fill="#2563EB"/>
                <path d="M0 36H63L71.4 48H0V36Z" fill="#2563EB"/>
                <path d="M84.0002 66H25.2002V84H84.0002V66Z" fill="#2563EB"/>
                <path d="M16.8 66H0V84H16.8V66Z" fill="#2563EB"/>
              </svg>
            </div>
          </div>

          <!-- Contact -->
          <div class="footer-contact">
            <h3 class="text-h3 text-azul">Let's talk product?</h3>
            <a href="mailto:AlexPereZamudio@proton.me" class="footer-email-link">
              <span class="text-p-large text-azul">[ Send email ]</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.0411 5L12.1507 9.10959L5.30137 15.9589L5 19L8.0411 18.6986L14.8904 11.8493L19 15.9589V5H8.0411Z" fill="#2563EB"/>
              </svg>
            </a>
          </div>

          <!-- Index -->
          <div class="footer-index">
            <h3 class="text-h3 text-azul">Site index:</h3>
            <div class="footer-links-group" id="footer-links-group">
            </div>
          </div>

          <!-- Copy -->
          <div class="footer-copy">
            <p class="text-p-large text-azul">Created by Alejandro, AKA SrPakura</p>
          </div>
        </div>

        <!-- Social networks and buttons -->
        <div class="footer-socials-part">

          <div class="footer-social-box footer-back-to-top" role="button" aria-label="Back to top" tabindex="0">
            <div class="footer-back-to-top-inner">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 15L12 9L6 15" stroke="#2563EB" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>

          <a href="https://github.com/SrPakura" target="_blank" class="footer-social-box">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_19_65)">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 0C18.6276 0 24 5.50792 24 12.3035C24 17.7383 20.5656 22.3487 15.8004 23.9771C15.192 24.0983 14.976 23.7141 14.976 23.3865C14.976 22.9809 14.9904 21.6562 14.9904 20.0098C14.9904 18.8626 14.6064 18.1138 14.1756 17.7322C16.848 17.4274 19.656 16.3869 19.656 11.6613C19.656 10.3173 19.1904 9.22058 18.42 8.35898C18.5448 8.04818 18.9564 6.79674 18.3024 5.10234C18.3024 5.10234 17.2968 4.77267 15.006 6.36387C14.0472 6.09147 13.02 5.95441 12 5.94961C10.98 5.95441 9.954 6.09147 8.9964 6.36387C6.7032 4.77267 5.6952 5.10234 5.6952 5.10234C5.0436 6.79674 5.4552 8.04818 5.5788 8.35898C4.812 9.22058 4.3428 10.3173 4.3428 11.6613C4.3428 16.3749 7.1448 17.4314 9.81 17.7422C9.4668 18.0494 9.156 18.5913 9.048 19.3869C8.364 19.7013 6.6264 20.2454 5.556 18.365C5.556 18.365 4.9212 17.1829 3.7164 17.0965C3.7164 17.0965 2.5464 17.0809 3.6348 17.8441C3.6348 17.8441 4.4208 18.2221 4.9668 19.6441C4.9668 19.6441 5.6712 21.8401 9.0096 21.0961C9.0156 22.1245 9.0264 23.0937 9.0264 23.3865C9.0264 23.7117 8.8056 24.0923 8.2068 23.9783C3.438 22.3523 0 17.7395 0 12.3035C0 5.50792 5.3736 0 12 0Z" fill="#2563EB"/>
            </g>
            <defs>
            <clipPath id="clip0_19_65">
            <rect width="24" height="24" fill="white"/>
            </clipPath>
            </defs>
            </svg>
          </a>

          <a href="https://github.com/PakuraDev" target="_blank" class="footer-social-box">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_19_65)">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 0C18.6276 0 24 5.50792 24 12.3035C24 17.7383 20.5656 22.3487 15.8004 23.9771C15.192 24.0983 14.976 23.7141 14.976 23.3865C14.976 22.9809 14.9904 21.6562 14.9904 20.0098C14.9904 18.8626 14.6064 18.1138 14.1756 17.7322C16.848 17.4274 19.656 16.3869 19.656 11.6613C19.656 10.3173 19.1904 9.22058 18.42 8.35898C18.5448 8.04818 18.9564 6.79674 18.3024 5.10234C18.3024 5.10234 17.2968 4.77267 15.006 6.36387C14.0472 6.09147 13.02 5.95441 12 5.94961C10.98 5.95441 9.954 6.09147 8.9964 6.36387C6.7032 4.77267 5.6952 5.10234 5.6952 5.10234C5.0436 6.79674 5.4552 8.04818 5.5788 8.35898C4.812 9.22058 4.3428 10.3173 4.3428 11.6613C4.3428 16.3749 7.1448 17.4314 9.81 17.7422C9.4668 18.0494 9.156 18.5913 9.048 19.3869C8.364 19.7013 6.6264 20.2454 5.556 18.365C5.556 18.365 4.9212 17.1829 3.7164 17.0965C3.7164 17.0965 2.5464 17.0809 3.6348 17.8441C3.6348 17.8441 4.4208 18.2221 4.9668 19.6441C4.9668 19.6441 5.6712 21.8401 9.0096 21.0961C9.0156 22.1245 9.0264 23.0937 9.0264 23.3865C9.0264 23.7117 8.8056 24.0923 8.2068 23.9783C3.438 22.3523 0 17.7395 0 12.3035C0 5.50792 5.3736 0 12 0Z" fill="#2563EB"/>
            </g>
            <defs>
            <clipPath id="clip0_19_65">
            <rect width="24" height="24" fill="white"/>
            </clipPath>
            </defs>
            </svg>
          </a>

          <a href="https://www.linkedin.com/in/alejandro-pz-56493839b/" target="_blank" class="footer-social-box">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_37_70)">
            <path d="M12 0C5.37188 0 0 5.37188 0 12C0 18.6281 5.37188 24 12 24C18.6281 24 24 18.6281 24 12C24 5.37188 18.6281 0 12 0ZM8.64375 17.0203H6.30469V9.53437H8.64375V17.0203ZM7.41094 8.59687H7.39219C6.54375 8.59687 5.99531 8.025 5.99531 7.29844C5.99531 6.55781 6.5625 6 7.425 6C8.2875 6 8.81719 6.55781 8.83594 7.29844C8.84062 8.02031 8.29219 8.59687 7.41094 8.59687ZM18 17.0203H15.3469V13.1484C15.3469 12.1359 14.9344 11.4422 14.0203 11.4422C13.3219 11.4422 12.9328 11.9109 12.7547 12.3609C12.6891 12.5203 12.6984 12.7453 12.6984 12.975V17.0203H10.0688C10.0688 17.0203 10.1016 10.1578 10.0688 9.53437H12.6984V10.7109C12.8531 10.1953 13.6922 9.46406 15.0328 9.46406C16.6969 9.46406 18 10.5422 18 12.8578V17.0203Z" fill="#2563EB"/>
            </g>
            <defs>
            <clipPath id="clip0_37_70">
            <rect width="24" height="24" fill="white"/>
            </clipPath>
            </defs>
            </svg>
          </a>

        </div>
      </footer>
    `;

    this.linksData = [
      { name: 'Home', href: 'index.html', dataTarget: 'Home' },
      { name: 'Projects', href: 'index.html#proyectos', dataTarget: 'Projects' },
      { name: 'About me', href: 'index.html#sobre-mi', dataTarget: 'About me' },
      { name: 'Resume', href: 'curriculum.html' },
      { name: 'Contact', href: 'contacto.html' }
    ];

    this.setupListeners();
    this.setupRevealEffect();
    this.renderLinks();

    document.addEventListener('navigate-section', (e) => {
      if (e.detail && e.detail.section) {
        this.renderLinks(e.detail.section);
      }
    });
  }

  renderLinks(activeName) {
    const group = this.querySelector('#footer-links-group');
    if (!group) return;

    let activeItem;
    if (activeName) {
      activeItem = this.linksData.find(l => l.name === activeName);
    } else {
      const currentPath = window.location.pathname;
      if (currentPath.includes('contacto')) {
        activeItem = this.linksData.find(l => l.name === 'Contact');
      } else if (currentPath.includes('curriculum')) {
        activeItem = this.linksData.find(l => l.name === 'Resume');
      } else if (currentPath.includes('study_case')) {
        activeItem = null;
      } else {
        activeItem = this.linksData[0]; // Default Home
      }
    }

    const otherLinks = activeItem ? this.linksData.filter(l => l !== activeItem) : this.linksData;

    let html = '';

    if (activeItem) {
      html += `
        <div class="footer-links-row">
          <a href="${activeItem.href}" class="footer-link active" data-target="${activeItem.dataTarget || ''}">
            <span class="text-p-large">${activeItem.name}</span>
            <span class="text-p-large footer-link-estas-aqui text-azul">(You are here)</span>
          </a>
        </div>
      `;
    }

    for (let i = 0; i < otherLinks.length; i += 2) {
      html += '<div class="footer-links-row">';
      html += this.createLinkHTML(otherLinks[i]);
      if (otherLinks[i+1]) {
        html += this.createLinkHTML(otherLinks[i+1]);
      }
      html += '</div>';
    }

    group.innerHTML = html;
    this.setupLinkListeners();
  }

  createLinkHTML(link) {
    return `
      <a href="${link.href}" class="footer-link" data-target="${link.dataTarget || ''}">
        <span class="text-p-large">${link.name}</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.0411 5L12.1507 9.10959L5.30137 15.9589L5 19L8.0411 18.6986L14.8904 11.8493L19 15.9589V5H8.0411Z" fill="#2563EB"/>
        </svg>
      </a>
    `;
  }

  setupLinkListeners() {
    const links = this.querySelectorAll('.footer-link');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const target = link.getAttribute('data-target');
        if (target) {
          const isHomePage = window.location.pathname === '/' || window.location.pathname.endsWith('index.html');
          if (isHomePage) {
            e.preventDefault();
            this.renderLinks(target);

            const event = new CustomEvent('navigate-section', {
              detail: { section: target },
              bubbles: true,
              composed: true
            });
            this.dispatchEvent(event);
          }
        }
      });
    });
  }

  setupRevealEffect() {
    const mainContent = document.getElementById('main-content');
    const introSection = document.querySelector('.home-intro');

    const updateMargin = () => {
      if (mainContent) {
        mainContent.style.marginBottom = this.offsetHeight + 'px';
      }
    };

    if (window.ResizeObserver) {
      const resizeObserver = new ResizeObserver(() => {
        updateMargin();
      });
      resizeObserver.observe(this);
    }

    window.addEventListener('resize', updateMargin);
    setTimeout(updateMargin, 100);
    setTimeout(updateMargin, 500);
    setTimeout(updateMargin, 2000);

    window.addEventListener('scroll', () => {
      if (mainContent) {
        const mainBottom = mainContent.getBoundingClientRect().bottom;
        if (mainBottom < window.innerHeight * 1.5) {
          this.classList.add('show-footer');
        } else {
          this.classList.remove('show-footer');
        }
      } else {
        this.classList.add('show-footer');
      }
    });

    if (mainContent) {
      const mainBottom = mainContent.getBoundingClientRect().bottom;
      if (mainBottom < window.innerHeight * 1.5) {
        this.classList.add('show-footer');
      } else {
        this.classList.remove('show-footer');
      }
    } else {
      this.classList.add('show-footer');
    }
  }

  setupListeners() {
    const backToTopBtn = this.querySelector('.footer-back-to-top');

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };

    if(backToTopBtn) {
        backToTopBtn.addEventListener('click', scrollToTop);
        backToTopBtn.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            scrollToTop();
          }
        });
    }
  }
}

customElements.define('app-footer', AppFooter);