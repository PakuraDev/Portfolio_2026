class ToradoraBg extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    // ... shadowRoot innerHTML ...
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          z-index: 0; /* Background layer */
          pointer-events: none;
        }

        .layer-effects {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 10;
          pointer-events: none;
        }

        .ring {
          position: absolute;
          border-radius: 50%;
          border: 2px solid currentColor;
          box-shadow: 0 0 12px currentColor, inset 0 0 12px currentColor;
          transform: translate(-50%, -50%) scale(0);
          opacity: 1;
          will-change: transform, opacity;
          animation: expandRing linear forwards;
        }

        .ring::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          border-radius: 50%;
          border: 1px solid currentColor;
          opacity: 0.25;
          transform: scale(1.025);
        }

        .ring::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          border-radius: 50%;
          border: 1px dashed currentColor;
          opacity: 0.4;
          transform: scale(0.965);
        }

        @keyframes expandRing {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
            border-width: var(--ring-thickness, 14px);
          }
          80% {
            opacity: 0.85;
            border-width: calc(var(--ring-thickness, 14px) * 0.25);
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0;
            border-width: 1px;
          }
        }

        .origin-glow {
          position: absolute;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, currentColor 0%, transparent 70%);
          opacity: 0;
          pointer-events: none;
          will-change: opacity;
          animation: glowPulse 1.5s ease-out forwards;
        }

        @keyframes glowPulse {
          0%   { opacity: 0;    transform: translate(-50%, -50%) scale(0.3); }
          20%  { opacity: 0.35; transform: translate(-50%, -50%) scale(1);   }
          100% { opacity: 0;    transform: translate(-50%, -50%) scale(1.2); }
        }
      </style>
      <div class="layer-effects" id="effects"></div>
    `;

    this.effectsLayer = this.shadowRoot.getElementById('effects');
    this.colors = ['#2563EB', '#FFF82B', '#EC4899', '#10B981', '#8B5CF6', '#EF4444', '#F97316', '#06B6D4', '#84CC16'];
    this.recentColors = [];
    this.loopTimeout = null;
    this.startTimeout = null;
    this.activeRings = 0;
    this.maxRings = window.innerWidth < 768 ? 2 : 3;
    this.startEffect();
  }

  disconnectedCallback() {
    if (this.loopTimeout) clearTimeout(this.loopTimeout);
    if (this.startTimeout) clearTimeout(this.startTimeout);
  }

  startEffect() {
    for (let i = 0; i < 2; i++) {
      setTimeout(() => { if (this.isConnected) this.createRing(); }, i * 400);
    }
    this.startTimeout = setTimeout(() => {
      if (this.isConnected) this.explosionLoop();
    }, 2000);
  }

  createRing() {
    if (!this.effectsLayer) return;
    // Respetar el límite de anillos concurrentes
    if (this.activeRings >= this.maxRings) return;

    this.activeRings++;

    const ringNode = document.createElement('div');
    ringNode.className = 'ring';

    const rect = this.getBoundingClientRect();
    const width = rect.width || window.innerWidth;
    const height = rect.height || window.innerHeight;

    const x = Math.random() * width;
    const y = Math.random() * height;

    const maxDimension = Math.max(width, height);
    const size = maxDimension * 1.8;

    const availableColors = this.colors.filter(c => !this.recentColors.includes(c));
    const color = availableColors[Math.floor(Math.random() * availableColors.length)];
    
    this.recentColors.push(color);
    if (this.recentColors.length > 3) this.recentColors.shift();
    
    const thickness = 6 + Math.random() * 12;
    const duration = 3.5 + Math.random() * 1.5;

    ringNode.style.left = `${x}px`;
    ringNode.style.top = `${y}px`;
    ringNode.style.width = `${size}px`;
    ringNode.style.height = `${size}px`;
    ringNode.style.color = color;
    ringNode.style.setProperty('--ring-thickness', `${thickness}px`);
    ringNode.style.animationDuration = `${duration}s`;

    const glow = document.createElement('div');
    glow.className = 'origin-glow';
    glow.style.left = `${x}px`;
    glow.style.top = `${y}px`;
    glow.style.color = color;
    
    this.effectsLayer.appendChild(glow);
    setTimeout(() => {
      if (glow.parentNode) glow.parentNode.removeChild(glow);
    }, 1500);

    this.effectsLayer.appendChild(ringNode);
    setTimeout(() => {
      if (ringNode.parentNode) ringNode.parentNode.removeChild(ringNode);
      this.activeRings--;
    }, duration * 1000);
  }

  explosionLoop() {
    this.createRing();
    const nextTime = 2500 + Math.random() * 1500;
    this.loopTimeout = setTimeout(() => this.explosionLoop(), nextTime);
  }
}

customElements.define('toradora-bg', ToradoraBg);
