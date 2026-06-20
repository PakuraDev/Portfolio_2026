document.addEventListener('DOMContentLoaded', () => {
  const selectorOptions = document.querySelectorAll('.selector-option');
  const optionsArray = Array.from(selectorOptions);
  const selectorSection = document.getElementById('home-selector-section');
  const waveTrack = document.getElementById('wave-track');
  const partialContent = document.getElementById('contenido-parcial');

  // Posición actual del track: 0 = espejo, 1 = normal, 2 = espejo, 3 = normal
  // Empezamos visualmente en el segmento 1 (Normal)
  let wavePosition = 1;
  
  // Guardamos la opción actual para saber si vamos hacia delante o hacia atrás
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

  // Carga inicial de la sección activa por defecto (Resumen)
  const initialActive = document.querySelector('.selector-option.active');
  if (initialActive) {
    handleOptionSelect(initialActive, true);
  }

  function handleOptionSelect(selectedOption, isInitialLoad = false) {
    // Evitar clickar la que ya está activa (salvo en carga inicial)
    if (!isInitialLoad && selectedOption.classList.contains('active')) return;

    // Calcular dirección
    const newOptionIndex = optionsArray.indexOf(selectedOption);
    const direction = newOptionIndex > currentOptionIndex ? 1 : -1;
    currentOptionIndex = newOptionIndex;

    if (!isInitialLoad) {
      // Cambiar clases active en selector
      selectorOptions.forEach(opt => opt.classList.remove('active'));
      selectedOption.classList.add('active');

      // Scroll para que el separador quede al final de la pantalla
      const separador = document.getElementById('separador');
      const separadorBottom = separador.getBoundingClientRect().bottom + window.pageYOffset;
      const y = separadorBottom - window.innerHeight;
      window.scrollTo({ top: y, behavior: 'smooth' });

      // Deslizar la ola según la dirección
      slideWave(direction);
    }

    // Cargar HTML parcial
    const target = selectedOption.getAttribute('data-target');

    // Sincronizar el header
    const mapToHeader = {
      'Resumen': 'Inicio',
      'Mis proyectos': 'Proyectos',
      'Sobre mí': 'Sobre mí'
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
      'Resumen': './html_parciales/resumen.html',
      'Mis proyectos': './html_parciales/proyectos.html',
      'Sobre mí': './html_parciales/sobre_mi.html'
    };

    const url = rutas[target];
    partialContent.style.opacity = 0;

    if (url) {
      fetch(url)
        .then(response => {
          if (!response.ok) throw new Error('Error al cargar la vista');
          return response.text();
        })
        .then(html => {
          setTimeout(() => {
            // Limpiar ScrollTriggers anteriores antes de inyectar HTML nuevo
            if (typeof ScrollTrigger !== 'undefined') {
              ScrollTrigger.getAll().forEach(t => t.kill());
            }

            partialContent.innerHTML = html;
            partialContent.style.transition = 'opacity 0.4s ease';
            partialContent.style.opacity = 1;
            
            // Inicializar GSAP si es la sección de resumen
            if (target === 'Resumen') {
              initResumenGSAP();
            }
          }, 500);
        })
        .catch(err => {
          console.error(err);
          setTimeout(() => {
            partialContent.innerHTML = `<div style="padding: 96px 48px; min-height: 50vh;"><h2 class="text-h2 text-negro" style="text-align: center;">Error al cargar la sección</h2></div>`;
            partialContent.style.transition = 'opacity 0.4s ease';
            partialContent.style.opacity = 1;
          }, 500);
        });
    } else {
      setTimeout(() => {
        partialContent.innerHTML = `<div style="padding: 96px 48px; min-height: 50vh;"><h2 class="text-h2 text-negro" style="text-align: center;">Simulando carga de: ${target}</h2></div>`;
        partialContent.style.transition = 'opacity 0.4s ease';
        partialContent.style.opacity = 1;
      }, 500);
    }
  }

  /**
   * Inicializa los efectos GSAP de la sección Resumen.
   * Usa doble requestAnimationFrame para asegurar que el navegador
   * ha completado el layout tras la inyección dinámica de HTML.
   */
  function initResumenGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {

        // Footer reveal: Sec 02 emerge por debajo de Sec 01
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

        // Radial Wipe — El wrapper se pinea, y el contenido revela desde el centro
        gsap.to("#wipe-section", {
          clipPath: "circle(150% at 50% 50vh)",
          ease: "none",
          scrollTrigger: {
            trigger: "#wipe-transition-wrapper",
            start: "top top",
            end: "+=1500", // La duración de la expansión
            pin: true,
            scrub: 1,
            anticipatePin: 1
          }
        });

        // Forzar recálculo inicial
        ScrollTrigger.refresh(true);

        // En lugar de ResizeObserver (que puede dispararse por las animaciones 
        // de toradora-bg y causar saltos masivos al hacer refresh() continuo),
        // esperamos a que las imágenes de la sección estén cargadas para hacer un refresh final.
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

          // Refrescar GSAP cuando se abren/cierran los acordeones para que recalcule la altura
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

  // Escuchar el evento del header para navegar desde allí
  document.addEventListener('navigate-section', (e) => {
    const sectionName = e.detail.section;
    const mapTargets = {
      'Inicio': 'Resumen',
      'Proyectos': 'Mis proyectos',
      'Sobre mí': 'Sobre mí'
    };
    
    const targetToFind = mapTargets[sectionName] || sectionName;
    const targetOption = optionsArray.find(opt => opt.getAttribute('data-target') === targetToFind);
    if (targetOption) {
      handleOptionSelect(targetOption);
    }
  });

  /**
   * Desliza el track de olas un segmento hacia la izquierda o derecha.
   */
  function slideWave(direction) {
    if (!waveTrack) return;

    wavePosition += direction;
    waveTrack.style.transform = `translateX(-${wavePosition * 25}%)`;
    waveTrack.addEventListener('transitionend', resetWavePosition, { once: true });
  }

  /** Reset invisible: desactiva transición, vuelve al centro, reactiva transición */
  function resetWavePosition() {
    waveTrack.style.transition = 'none';

    if (Math.abs(wavePosition) % 2 === 0) {
      wavePosition = 2;
    } else {
      wavePosition = 1;
    }

    waveTrack.style.transform = `translateX(-${wavePosition * 25}%)`;

    // Forzar reflow
    waveTrack.offsetHeight;

    requestAnimationFrame(() => {
      waveTrack.style.transition = '';
    });
  }
});
