// background.js

let scene, camera, renderer;
let gridPlane;

const waves = [];

const craterRadius = 26; 

const accentColor = '#2563EB'; 
const baseGridColor = '#e0e0e0'; 
const waveSpeed = 0.9; 
const waveHeight = 6.0; 

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(-1000, -1000);
let hoverPos = null;
let isMobile = false;
let time = 0;
let lastWaveTime = 0;

function checkDevice() {
  isMobile = window.innerWidth <= 1024;
}

function init() {
  const canvas = document.getElementById('three-canvas');
  if (!canvas) return; // Si no hay canvas, salimos
  
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);
  scene.fog = new THREE.FogExp2(0xffffff, 0.006);

  camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.set(0, 150, 0); 
  camera.lookAt(0, 0, 0); 

  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  checkDevice();

  const sizeX = 350;
  const sizeZ = 350;
  const segmentsX = 140;
  const segmentsZ = 140;

  const gridGeom = new THREE.PlaneGeometry(sizeX, sizeZ, segmentsX, segmentsZ);
  gridGeom.rotateX(-Math.PI / 2);

  const vertexCount = gridGeom.attributes.position.count;
  const colors = new Float32Array(vertexCount * 3);
  gridGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const gridMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    vertexColors: true,
    wireframe: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.NormalBlending 
  });

  gridPlane = new THREE.Mesh(gridGeom, gridMaterial);
  scene.add(gridPlane);

  window.addEventListener('resize', onWindowResize);
  window.addEventListener('mousemove', onMouseMove, { passive: true });
  
  window.addEventListener('click', () => {
    if (!isMobile && hoverPos) {
      triggerWavePulse(hoverPos.x, hoverPos.z, -8.0);
    }
  });
}

function onMouseMove(event) {
  if (isMobile) return;
  const rect = renderer.domElement.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  mouse.x = (x / window.innerWidth) * 2 - 1;
  mouse.y = -(y / window.innerHeight) * 2 + 1;
}

function triggerWavePulse(originX, originZ, impactDepth) {
  const particleCount = isMobile ? 600 : 400; 
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colorsArray = new Float32Array(particleCount * 3);
  const colorRGB = new THREE.Color(accentColor);

  const angles = [];
  const particleSpeeds = [];

  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 2;
    angles.push(angle);
    
    particleSpeeds.push(0.9 + Math.random() * 0.2);

    positions[i * 3] = originX;
    positions[i * 3 + 1] = impactDepth; 
    positions[i * 3 + 2] = originZ;

    colorsArray[i * 3] = colorRGB.r;
    colorsArray[i * 3 + 1] = colorRGB.g;
    colorsArray[i * 3 + 2] = colorRGB.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

  const pointsMaterial = new THREE.PointsMaterial({
    size: 0.8, 
    vertexColors: true,
    transparent: true,
    opacity: 0.95,
    blending: THREE.NormalBlending,
    depthWrite: false
  });

  const pointsMesh = new THREE.Points(geometry, pointsMaterial);
  scene.add(pointsMesh);

  waves.push({
    mesh: pointsMesh,
    radius: 0,
    maxRadius: isMobile ? 500 : 250, 
    speed: waveSpeed,
    particleCount: particleCount,
    angles: angles,
    speeds: particleSpeeds,
    impactY: impactDepth,
    originX: originX,
    originZ: originZ
  });

  const ambientGlow = document.getElementById('ambient-glow');
  if (ambientGlow) ambientGlow.style.opacity = '1';
}

function animate() {
  if (!renderer) return;
  requestAnimationFrame(animate);
  time += 0.016;

  if (!isMobile) {
    raycaster.setFromCamera(mouse, camera);
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    const targetPoint = new THREE.Vector3();
    if (raycaster.ray.intersectPlane(plane, targetPoint)) {
      hoverPos = targetPoint;
    } else {
      hoverPos = null;
    }
  }

  if (isMobile) {
    if (time - lastWaveTime > 2.0) {
      triggerWavePulse(180, -180, -5.0);
      lastWaveTime = time;
    }
  }

  const ambientGlow = document.getElementById('ambient-glow');

  for (let w = waves.length - 1; w >= 0; w--) {
    const wave = waves[w];
    wave.radius += wave.speed;

    const posAttr = wave.mesh.geometry.attributes.position;
    const positions = posAttr.array;

    const depthProgress = Math.min(1, wave.radius / 18.0);
    const particleBaseY = wave.impactY * (1 - depthProgress);

    for (let i = 0; i < wave.particleCount; i++) {
      const angle = wave.angles[i];
      const curDist = wave.radius * wave.speeds[i];

      positions[i * 3] = wave.originX + Math.cos(angle) * curDist;
      positions[i * 3 + 1] = particleBaseY + Math.sin(curDist * 0.2 + i) * 1.5 * (1 - wave.radius / wave.maxRadius);
      positions[i * 3 + 2] = wave.originZ + Math.sin(angle) * curDist;
    }
    posAttr.needsUpdate = true;

    const lifeFactor = 1 - (wave.radius / wave.maxRadius);
    wave.mesh.material.opacity = Math.max(0, lifeFactor * 0.95);

    if (w === 0 && !isMobile && ambientGlow) {
      const intensity = Math.max(0.05, lifeFactor * 0.4);
      ambientGlow.style.opacity = intensity;
      ambientGlow.style.background = `radial-gradient(circle at 50% 50%, rgba(37, 99, 235, ${intensity}) 0%, transparent 70%)`;
    }

    if (wave.radius >= wave.maxRadius) {
      scene.remove(wave.mesh);
      wave.mesh.geometry.dispose();
      wave.mesh.material.dispose();
      waves.splice(w, 1);
    }
  }

  if (waves.length === 0 && ambientGlow) {
    const idleIntensity = 0.05 + Math.sin(time * 2.0) * 0.02;
    ambientGlow.style.opacity = idleIntensity;
  }

  if (gridPlane) {
    const posAttr = gridPlane.geometry.attributes.position;
    const colorAttr = gridPlane.geometry.attributes.color;
    const vertexCount = posAttr.count;

    const baseColorObj = new THREE.Color(baseGridColor); 
    const activeColorObj = new THREE.Color(accentColor);

    for (let i = 0; i < vertexCount; i++) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);

      let targetY = 0;
      let maxIntensity = 0;

      if (!isMobile && hoverPos) {
        const dxMouse = x - hoverPos.x;
        const dzMouse = z - hoverPos.z;
        const distanceMouse = Math.sqrt(dxMouse * dxMouse + dzMouse * dzMouse);
        
        if (distanceMouse < craterRadius) {
          const normalized = distanceMouse / craterRadius;
          const sinkFactor = Math.cos(normalized * Math.PI / 2);
          targetY -= (sinkFactor * sinkFactor) * 9.0; 
          
          const hoverInt = 1.0 - normalized;
          if (hoverInt > maxIntensity) maxIntensity = hoverInt * 0.5;
        }
      }

      waves.forEach(wave => {
        const dxWave = x - wave.originX;
        const dzWave = z - wave.originZ;
        const distanceWave = Math.sqrt(dxWave * dxWave + dzWave * dzWave);

        const distDiff = Math.abs(distanceWave - wave.radius);
        if (distDiff < 14) {
          const influence = 1 - (distDiff / 14);
          const lifeFactor = 1 - (wave.radius / wave.maxRadius);
          
          targetY += Math.sin(distanceWave * 0.4 - wave.radius * 0.5) * waveHeight * influence * lifeFactor;
          
          const intensity = influence * lifeFactor;
          if (intensity > maxIntensity) maxIntensity = intensity;
        }
      });

      const currentY = posAttr.getY(i);
      posAttr.setY(i, currentY + (targetY - currentY) * 0.35);

      const finalColor = new THREE.Color().lerpColors(baseColorObj, activeColorObj, maxIntensity);
      colorAttr.setXYZ(i, finalColor.r, finalColor.g, finalColor.b);
    }

    posAttr.needsUpdate = true;
    colorAttr.needsUpdate = true;
  }

  renderer.render(scene, camera);
}

function onWindowResize() {
  if (!camera || !renderer) return;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  checkDevice();
}

window.addEventListener('DOMContentLoaded', () => {
  init();
  animate();
  
  setTimeout(() => {
     if(!isMobile) triggerWavePulse(0, 0, -8.0);
  }, 500);
});
