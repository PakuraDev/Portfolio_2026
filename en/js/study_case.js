document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');
  const initialTab = urlParams.get('tab');

  const loaderState = document.getElementById('loader-state');
  const projectContent = document.getElementById('project-content');
  const partialContent = document.getElementById('contenido-parcial');
  const waveTrack = document.getElementById('wave-track');

  let currentProjectData = null;
  let wavePosition = 1;
  let currentOptionIndex = 0;
  let optionsArray = [];

  if (!projectId) {
    showError("No project was specified. (Add ?id=aerko to the URL)");
    return;
  }

  // 1. Load the JSON
  fetch('./case_studies/projects.json')
    .then(res => {
      if (!res.ok) throw new Error("Could not load the project database.");
      return res.json();
    })
    .then(data => {
      if (!data[projectId]) throw new Error("The specified project does not exist.");
      currentProjectData = data[projectId];
      renderProject(currentProjectData);
    })
    .catch(err => {
      showError(err.message);
    });

  function showError(msg) {
    loaderState.innerHTML = `<h2 class="text-h2 text-negro" style="color: red;">${msg}</h2>`;
  }

  // 2. Render the initial data
  function renderProject(data) {
    document.title = `${data.titulo} - Pezetoide`;

    // Inject data into the header
    document.getElementById('project-title').textContent = data.titulo;
    document.getElementById('project-desc').textContent = data.descripcion;
    document.getElementById('project-question').textContent = `What would you like to know about ${data.titulo}?`;

    // Tags
    const tagsContainer = document.getElementById('project-tags');
    data.etiquetas.forEach(tag => {
      const div = document.createElement('div');
      div.className = 'case-tag-badge';
      div.innerHTML = `<span class="text-p">${tag}</span>`;
      tagsContainer.appendChild(div);
    });

    // Links
    const linksContainer = document.getElementById('project-links');
    data.enlaces.forEach(link => {
      const a = document.createElement('a');
      a.href = link.url;
      a.className = 'case-link-btn';
      // Simple icon mapping (real SVGs could be used here)
      let iconSvg = '';
      if(link.icon === 'github') iconSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>';
      else if(link.icon === 'web') iconSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>';
      else if(link.icon === 'figma') iconSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z"></path><path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z"></path><path d="M12 9h3.5a3.5 3.5 0 1 1 0 7H12V9z"></path><path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z"></path><path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z"></path></svg>';
      else iconSvg = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>';

      a.innerHTML = `${iconSvg} <span class="text-p">${link.texto}</span>`;
      linksContainer.appendChild(a);
    });

    // Tabs
    const tabsContainer = document.getElementById('project-tabs');
    data.tabs.forEach((tab, index) => {
      const div = document.createElement('div');
      div.className = 'selector-option';
      div.setAttribute('data-tab', tab.id);
      div.setAttribute('data-file', tab.archivo);
      div.tabIndex = 0;
      div.role = 'button';

      div.innerHTML = `
        <h4 class="text-h4 selector-num">${tab.numero}</h4>
        <h1 class="text-h1 selector-text">${tab.titulo}</h1>
      `;

      div.addEventListener('click', () => selectTab(div));
      div.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          selectTab(div);
        }
      });
      tabsContainer.appendChild(div);
    });

    // Store options globally
    optionsArray = Array.from(document.querySelectorAll('.selector-option'));

    // Show the content
    loaderState.style.display = 'none';
    projectContent.style.display = 'block';

    // Force reflow for animation
    projectContent.offsetHeight;
    projectContent.style.opacity = 1;

    // Select the default tab or the one from the URL
    let targetTab = optionsArray[0];
    if (initialTab) {
      const found = optionsArray.find(o => o.getAttribute('data-tab') === initialTab);
      if (found) targetTab = found;
    }

    // Initial load
    selectTab(targetTab, true);
  }

  // 3. Tab Logic (Selector + Wave)
  function selectTab(selectedOption, isInitialLoad = false) {
    if (!isInitialLoad && selectedOption.classList.contains('active')) return;

    const newOptionIndex = optionsArray.indexOf(selectedOption);
    const direction = newOptionIndex > currentOptionIndex ? 1 : -1;
    currentOptionIndex = newOptionIndex;

    const tabId = selectedOption.getAttribute('data-tab');
    const fileName = selectedOption.getAttribute('data-file');

    if (!isInitialLoad) {
      optionsArray.forEach(opt => opt.classList.remove('active'));
      selectedOption.classList.add('active');

      // Scroll to the separator
      const separador = document.getElementById('separador');
      const separadorBottom = separador.getBoundingClientRect().bottom + window.pageYOffset;
      const y = separadorBottom - window.innerHeight;
      window.scrollTo({ top: y, behavior: 'smooth' });

      slideWave(direction);

      // Update URL without reloading (History API)
      const url = new URL(window.location);
      url.searchParams.set('tab', tabId);
      window.history.pushState({}, '', url);
    } else {
      selectedOption.classList.add('active');
    }

    // Load partial content
    partialContent.style.opacity = 0;

    fetch(`./case_studies/${fileName}`)
      .then(res => {
        if (!res.ok) throw new Error('Error loading the partial file');
        return res.text();
      })
      .then(html => {
        setTimeout(() => {
          // Clear ScrollTriggers
          if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.getAll().forEach(t => t.kill());
          }

          partialContent.innerHTML = html;
          partialContent.style.transition = 'opacity 0.4s ease';
          partialContent.style.opacity = 1;
        }, 500);
      })
      .catch(err => {
        console.error(err);
        setTimeout(() => {
          partialContent.innerHTML = `<div style="padding: 96px 48px; min-height: 50vh;"><h2 class="text-h2 text-blanco" style="text-align: center;">Error loading section</h2></div>`;
          partialContent.style.transition = 'opacity 0.4s ease';
          partialContent.style.opacity = 1;
        }, 500);
      });
  }

  // Wave animation
  function slideWave(direction) {
    if (!waveTrack) return;
    wavePosition += direction;
    waveTrack.style.transform = `translateX(-${wavePosition * 25}%)`;
    waveTrack.addEventListener('transitionend', resetWavePosition, { once: true });
  }

  function resetWavePosition() {
    waveTrack.style.transition = 'none';
    if (Math.abs(wavePosition) % 2 === 0) {
      wavePosition = 2;
    } else {
      wavePosition = 1;
    }
    waveTrack.style.transform = `translateX(-${wavePosition * 25}%)`;
    waveTrack.offsetHeight; // Reflow
    requestAnimationFrame(() => {
      waveTrack.style.transition = '';
    });
  }
});