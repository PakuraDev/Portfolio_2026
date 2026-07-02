document.addEventListener('DOMContentLoaded', () => {
  const selectorOptions = document.querySelectorAll('.selector-option');
  const optionsArray = Array.from(selectorOptions);
  const selectorSection = document.getElementById('home-selector-section');
  const waveTrack = document.getElementById('wave-track');
  const partialContent = document.getElementById('contenido-parcial');

  // Current track position: 0 = mirror, 1 = normal, 2 = mirror, 3 = normal
  // We start visually at segment 1 (Normal)
  let wavePosition = 1;

  // Keep track of current option to know direction (forward/backward)
  let currentOptionIndex = 0;

  selectorOptions.forEach(option => {
    option.addEventListener('click', () => handleOptionSelect(option));
    option.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleOptionSelect(option);
      }
    });
  });

  // Initial load of the default active section (Summary)
  const initialActive = document.querySelector('.selector-option.active');
  if (initialActive) {
    handleOptionSelect(initialActive, true);
  }

  function handleOptionSelect(selectedOption, isInitialLoad = false) {
    // Prevent clicking the already active one (except on initial load)
    if (!isInitialLoad && selectedOption.classList.contains('active')) return;

    // Calculate direction
    const newOptionIndex = optionsArray.indexOf(selectedOption);
    const direction = newOptionIndex > currentOptionIndex ? 1 : -1;
    currentOptionIndex = newOptionIndex;

    if (!isInitialLoad) {
      // Update active classes on selector
      selectorOptions.forEach(opt => opt.classList.remove('active'));
      selectedOption.classList.add('active');

      // Scroll so the separator is at the bottom of the screen
      const separador = document.getElementById('separador');
      const separadorBottom = separador.getBoundingClientRect().bottom + window.pageYOffset;
      const y = separadorBottom - window.innerHeight;
      window.scrollTo({ top: y, behavior: 'smooth' });

      // Slide the wave according to direction
      slideWave(direction);
    }

    // Load partial HTML
    const target = selectedOption.getAttribute('data-target');

    // Sync the header
    const mapToHeader = {
      'Summary': 'Home',
      'My projects': 'Projects',
      'About me': 'About me'
    };
    const headerTarget = mapToHeader[target] || target;
    const headerLinks = document.querySelectorAll('.nav-capsule');
    headerLinks.forEach(link => {
      if (link.getAttribute('data-target') === headerTarget) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    const rutas = {
      'Summary': './html_partials/summary.html',
      'My projects': './html_partials/projects.html',
      'About me': './html_partials/about_me.html'
    };

    const url = rutas[target];
    partialContent.style.opacity = 0;

    if (url) {
      fetch(url)
        .then(response => {
          if (!response.ok) throw new Error('Error loading the view');
          return response.text();
        })
        .then(html => {
          setTimeout(() => {
            // Clear previous ScrollTriggers before injecting new HTML
            if (typeof ScrollTrigger !== 'undefined') {
              ScrollTrigger.getAll().forEach(t => t.kill());
            }

            partialContent.innerHTML = html;
            partialContent.style.transition = 'opacity 0.4s ease';
            partialContent.style.opacity = 1;

            // Initialize GSAP if it's the summary section
            if (target === 'Summary') {
              initResumenGSAP();
            }
          }, 500);
        })
        .catch(err => {
          console.error(err);
          setTimeout(() => {
            partialContent.innerHTML = `<div style="padding: 96px 48px; min-height: 50vh;"><h2 class="text-h2 text-negro" style="text-align: center;">Error loading section</h2></div>`;
            partialContent.style.transition = 'opacity 0.4s ease';
            partialContent.style.opacity = 1;
          }, 500);
        });
    } else {
      setTimeout(() => {
        partialContent.innerHTML = `<div style="padding: 96px 48px; min-height: 50vh;"><h2 class="text-h2 text-negro" style="text-align: center;">Simulating load of: ${target}</h2></div>`;
        partialContent.style.transition = 'opacity 0.4s ease';
        partialContent.style.opacity = 1;
      }, 500);
    }
  }

  /**
   * Initializes GSAP effects for the Summary section.
   * Uses double requestAnimationFrame to ensure the browser
   * has completed layout after dynamic HTML injection.
   */
  function initResumenGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {

        // Footer reveal: Sec 02 emerges from below Sec 01
        gsap.fromTo(".resumen-sec-02-wrapper",
          { y: -150, opacity: 0.8 },
          {
            y: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".resumen-sec-01",
              start: "bottom bottom",
              end: "bottom center",
              scrub: true
            }
          }
        );

        // Radial Wipe — The wrapper is pinned, and content reveals from the center
        gsap.to("#wipe-section", {
          clipPath: "circle(150% at 50% 50vh)",
          ease: "none",
          scrollTrigger: {
            trigger: "#wipe-transition-wrapper",
            start: "top top",
            end: "+=1500",
            pin: true,
            scrub: 1,
            anticipatePin: 1
          }
        });

        // Force initial recalculation
        ScrollTrigger.refresh(true);

        // Instead of ResizeObserver (which can fire due to toradora-bg animations
        // and cause massive jumps with continuous refresh()),
        // we wait for images in the section to load before doing a final refresh.
        const pageContainer = document.querySelector('.page-resumen');
        if (pageContainer) {
          const images = Array.from(pageContainer.querySelectorAll('img'));
          Promise.all(images.map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise(resolve => {
              img.addEventListener('load', resolve);
              img.addEventListener('error', resolve);
            });
          })).then(() => {
            ScrollTrigger.refresh();
          });

          // Refresh GSAP when accordions open/close so it recalculates height
          const accordions = pageContainer.querySelectorAll('details.resumen-acordeon');
          accordions.forEach(acc => {
            acc.addEventListener('toggle', () => {
              ScrollTrigger.refresh();
            });
          });
        }
      });
    });
  }

  // Listen for header navigation events
  document.addEventListener('navigate-section', (e) => {
    const sectionName = e.detail.section;
    const mapTargets = {
      'Home': 'Summary',
      'Projects': 'My projects',
      'About me': 'About me'
    };

    const targetToFind = mapTargets[sectionName] || sectionName;
    const targetOption = optionsArray.find(opt => opt.getAttribute('data-target') === targetToFind);
    if (targetOption) {
      handleOptionSelect(targetOption);
    }
  });

  /**
   * Slides the wave track one segment left or right.
   */
  function slideWave(direction) {
    if (!waveTrack) return;

    wavePosition += direction;
    waveTrack.style.transform = `translateX(-${wavePosition * 25}%)`;
    waveTrack.addEventListener('transitionend', resetWavePosition, { once: true });
  }

  /** Reset invisible: disable transition, return to center, re-enable transition */
  function resetWavePosition() {
    waveTrack.style.transition = 'none';

    if (Math.abs(wavePosition) % 2 === 0) {
      wavePosition = 2;
    } else {
      wavePosition = 1;
    }

    waveTrack.style.transform = `translateX(-${wavePosition * 25}%)`;

    // Force reflow
    waveTrack.offsetHeight;

    requestAnimationFrame(() => {
      waveTrack.style.transition = '';
    });
  }
});