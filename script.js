// ==========================================================
// FLORES AMARILLAS ANIMADAS - AMBIENTE Y PARTÍCULAS
// ==========================================================

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('ambient-canvas');
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // Ajuste en cambio de tamaño de ventana
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // --------------------------------------------------------
  // PARTÍCULAS DE LUZ Y POLEN DORADO (LUCIÉRNAGAS)
  // --------------------------------------------------------
  const ambientParticles = [];
  const PARTICLE_COUNT = 65;

  class GlowingSpark {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + 20;
      this.size = Math.random() * 2.8 + 1.2;
      this.speedY = Math.random() * -0.6 - 0.2;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.7 + 0.3;
      this.pulseSpeed = Math.random() * 0.025 + 0.01;
      this.pulse = Math.random() * Math.PI;
      this.color = Math.random() > 0.3 ? '#ffe066' : '#ffd13b';
    }

    update() {
      this.y += this.speedY;
      this.x += Math.sin(this.pulse) * 0.4 + this.speedX;
      this.pulse += this.pulseSpeed;

      if (this.y < -30 || this.x < -20 || this.x > width + 20) {
        this.reset();
      }
    }

    draw() {
      const currentAlpha = Math.max(0, Math.min(1, Math.sin(this.pulse) * 0.4 + this.alpha));
      
      // Resplandor exterior
      ctx.save();
      ctx.globalAlpha = currentAlpha * 0.35;
      ctx.shadowBlur = this.size * 6;
      ctx.shadowColor = '#ffd000';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
      ctx.fillStyle = '#ffbe0b';
      ctx.fill();

      // Núcleo brillante
      ctx.globalAlpha = currentAlpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.restore();
    }
  }

  // --------------------------------------------------------
  // PÉTALOS FLOTANTES SUAVES EN EL AIRE
  // --------------------------------------------------------
  const floatingPetals = [];
  const PETAL_COUNT = 14;

  class FallingPetal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -30;
      this.size = Math.random() * 8 + 10;
      this.speedY = Math.random() * 0.8 + 0.5;
      this.speedX = Math.random() * 0.6 - 0.1;
      this.angle = Math.random() * 360;
      this.rotSpeed = (Math.random() - 0.5) * 1.5;
      this.alpha = Math.random() * 0.5 + 0.3;
      this.wave = Math.random() * Math.PI;
    }

    update() {
      this.y += this.speedY;
      this.wave += 0.02;
      this.x += Math.sin(this.wave) * 0.9 + this.speedX;
      this.angle += this.rotSpeed;

      if (this.y > height + 40) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.angle * Math.PI) / 180);
      ctx.globalAlpha = this.alpha;

      // Forma estilizada de pétalo
      ctx.beginPath();
      ctx.moveTo(0, -this.size);
      ctx.bezierCurveTo(this.size * 0.6, -this.size * 0.6, this.size * 0.6, this.size * 0.6, 0, this.size);
      ctx.bezierCurveTo(-this.size * 0.6, this.size * 0.6, -this.size * 0.6, -this.size * 0.6, 0, -this.size);
      
      const grad = ctx.createLinearGradient(0, -this.size, 0, this.size);
      grad.addColorStop(0, '#fff475');
      grad.addColorStop(0.6, '#ffcc00');
      grad.addColorStop(1, '#ff9900');
      
      ctx.fillStyle = grad;
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(255, 180, 0, 0.4)';
      ctx.fill();
      ctx.restore();
    }
  }

  // --------------------------------------------------------
  // EFECTO AL TOCAR / HACER CLIC: BROTE DE CHISPAS DORADAS
  // --------------------------------------------------------
  const clickSparks = [];

  class ClickSpark {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3.5 + 1;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed - 1.2;
      this.size = Math.random() * 3.5 + 2;
      this.alpha = 1;
      this.decay = Math.random() * 0.025 + 0.015;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.05; // gravedad suave
      this.alpha -= this.decay;
    }

    draw() {
      if (this.alpha <= 0) return;
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ffd000';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = '#fff48f';
      ctx.fill();
      ctx.restore();
    }
  }

  // Evento al tocar o hacer clic en la pantalla
  const createSparksAt = (x, y) => {
    for (let i = 0; i < 22; i++) {
      clickSparks.push(new ClickSpark(x, y));
    }
  };

  window.addEventListener('pointerdown', (e) => {
    createSparksAt(e.clientX, e.clientY);
  });

  // Inicializar partículas
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    ambientParticles.push(new GlowingSpark());
  }
  for (let i = 0; i < PETAL_COUNT; i++) {
    floatingPetals.push(new FallingPetal());
  }

  // --------------------------------------------------------
  // BUCLE DE ANIMACIÓN PRINCIPAL
  // --------------------------------------------------------
  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Dibujar y actualizar luciérnagas
    for (let i = 0; i < ambientParticles.length; i++) {
      ambientParticles[i].update();
      ambientParticles[i].draw();
    }

    // Dibujar y actualizar pétalos cayendo
    for (let i = 0; i < floatingPetals.length; i++) {
      floatingPetals[i].update();
      floatingPetals[i].draw();
    }

    // Dibujar y actualizar chispas interactivas
    for (let i = clickSparks.length - 1; i >= 0; i--) {
      clickSparks[i].update();
      clickSparks[i].draw();
      if (clickSparks[i].alpha <= 0) {
        clickSparks.splice(i, 1);
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
});
