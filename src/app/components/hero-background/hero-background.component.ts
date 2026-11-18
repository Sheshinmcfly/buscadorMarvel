import {
  Component, Input, OnChanges, OnDestroy, AfterViewInit,
  ViewChild, ElementRef, SimpleChanges, NgZone,
  ChangeDetectionStrategy
} from '@angular/core';

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number; alpha: number;
  decay: number; color: string;
}

interface Panel {
  x: number; y: number;
  w: number; h: number;
  vx: number; vy: number;
  angle: number; vAngle: number;
  alpha: number; color: string;
}

interface Star {
  x: number; y: number;
  radius: number; alpha: number;
  twinkleSpeed: number; twinkleDir: number;
}

interface Bolt {
  points: { x: number; y: number }[];
  alpha: number; decay: number;
  color: string;
}

@Component({
    selector: 'app-hero-background',
    imports: [],
    templateUrl: './hero-background.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './hero-background.component.css'
})
export class HeroBackgroundComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() isDC = false;
  @ViewChild('bgCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private rafId = 0;
  private panels: Panel[] = [];
  private particles: Particle[] = [];
  private stars: Star[] = [];
  private bolts: Bolt[] = [];
  private boltTimer = 0;
  private frame = 0;

  constructor(private zone: NgZone) {}

  ngAfterViewInit(): void {
    this.init();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isDC'] && !changes['isDC'].firstChange) {
      this.reset();
    }
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.rafId);
  }

  /* istanbul ignore next */
  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  /* istanbul ignore next */
  private init(): void {
    const canvas = this.canvas;
    this.ctx = canvas.getContext('2d')!;
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.reset();
    this.zone.runOutsideAngular(() => this.loop());
  }

  /* istanbul ignore next */
  private resize(): void {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  }

  /* istanbul ignore next */
  private reset(): void {
    this.panels = [];
    this.particles = [];
    this.stars = [];
    this.bolts = [];
    this.frame = 0;
    this.boltTimer = 0;
    if (this.isDC) this.initStars();
    else this.initPanels();
  }

  /* ── Marvel: comic panels ── */
  /* istanbul ignore next */
  private initPanels(): void {
    const { width, height } = this.canvas;
    for (let i = 0; i < 18; i++) {
      this.panels.push(this.newPanel(width, height, true));
    }
  }

  /* istanbul ignore next */
  private newPanel(w: number, h: number, randomY = false): Panel {
    const colors = ['#8B0000', '#5a0000', '#3d0000', '#cc0000', '#ff1a1a', '#1a0000'];
    return {
      x: Math.random() * w,
      y: randomY ? Math.random() * h : h + 20,
      w: 40 + Math.random() * 90,
      h: 30 + Math.random() * 60,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(0.3 + Math.random() * 0.5),
      angle: Math.random() * Math.PI * 2,
      vAngle: (Math.random() - 0.5) * 0.01,
      alpha: 0.04 + Math.random() * 0.12,
      color: colors[Math.floor(Math.random() * colors.length)]
    };
  }

  /* ── DC: stars ── */
  /* istanbul ignore next */
  private initStars(): void {
    const { width, height } = this.canvas;
    for (let i = 0; i < 200; i++) {
      this.stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 0.3 + Math.random() * 1.5,
        alpha: 0.3 + Math.random() * 0.7,
        twinkleSpeed: 0.005 + Math.random() * 0.015,
        twinkleDir: Math.random() > 0.5 ? 1 : -1
      });
    }
  }

  /* istanbul ignore next */
  private newBolt(w: number, h: number): Bolt {
    const x = Math.random() * w;
    const points: { x: number; y: number }[] = [];
    let cy = 0;
    const segments = 8 + Math.floor(Math.random() * 6);
    for (let i = 0; i <= segments; i++) {
      points.push({ x: x + (Math.random() - 0.5) * 80, y: cy });
      cy += h / segments;
    }
    const hue = Math.random() > 0.5 ? '#4da6ff' : '#a0c4ff';
    return { points, alpha: 0.7 + Math.random() * 0.3, decay: 0.025 + Math.random() * 0.02, color: hue };
  }

  /* ── Marvel: spawn particles ── */
  /* istanbul ignore next */
  private spawnMarvelParticles(w: number, h: number): void {
    if (this.frame % 8 !== 0) return;
    const colors = ['#ff0000', '#ff4444', '#ffffff', '#cc0000', '#ff8800'];
    for (let i = 0; i < 3; i++) {
      this.particles.push({
        x: Math.random() * w, y: h,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -(1 + Math.random() * 2),
        size: 1 + Math.random() * 2,
        alpha: 0.8 + Math.random() * 0.2,
        decay: 0.008 + Math.random() * 0.01,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  /* ── DC: spawn particles ── */
  /* istanbul ignore next */
  private spawnDCParticles(w: number, h: number): void {
    if (this.frame % 6 !== 0) return;
    const colors = ['#4da6ff', '#99ccff', '#ffffff', '#0066cc', '#cce5ff'];
    for (let i = 0; i < 2; i++) {
      this.particles.push({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -(0.5 + Math.random() * 1),
        size: 0.5 + Math.random() * 1.5,
        alpha: 0.6 + Math.random() * 0.4,
        decay: 0.006 + Math.random() * 0.008,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  /* ── Main loop ── */
  /* istanbul ignore next */
  private loop(): void {
    this.rafId = requestAnimationFrame(() => this.loop());
    const { width: w, height: h } = this.canvas;
    this.frame++;

    // Clear
    this.ctx.clearRect(0, 0, w, h);

    if (this.isDC) this.drawDC(w, h);
    else this.drawMarvel(w, h);
  }

  /* ── Draw Marvel ── */
  /* istanbul ignore next */
  private drawMarvel(w: number, h: number): void {
    // Base gradient
    const grad = this.ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#0d0001');
    grad.addColorStop(1, '#1a0003');
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, w, h);

    // Subtle radial glow
    const radial = this.ctx.createRadialGradient(w / 2, h * 0.3, 0, w / 2, h * 0.3, w * 0.6);
    radial.addColorStop(0, 'rgba(180,0,0,0.08)');
    radial.addColorStop(1, 'rgba(0,0,0,0)');
    this.ctx.fillStyle = radial;
    this.ctx.fillRect(0, 0, w, h);

    // Panels
    this.spawnMarvelParticles(w, h);
    if (this.frame % 40 === 0) this.panels.push(this.newPanel(w, h));

    this.panels = this.panels.filter(p => p.y + p.h > -100 && p.alpha > 0.005);
    for (const p of this.panels) {
      p.x += p.vx; p.y += p.vy; p.angle += p.vAngle;
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.angle);
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      // Comic border line
      this.ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(-p.w / 2, -p.h / 2, p.w, p.h);
      // Halftone dots inside
      this.ctx.fillStyle = 'rgba(255,255,255,0.05)';
      for (let dx = -p.w / 2 + 6; dx < p.w / 2; dx += 6) {
        for (let dy = -p.h / 2 + 6; dy < p.h / 2; dy += 6) {
          this.ctx.beginPath();
          this.ctx.arc(dx, dy, 1, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }
      this.ctx.restore();
    }

    // Particles
    this.particles = this.particles.filter(p => p.alpha > 0.01);
    for (const p of this.particles) {
      p.x += p.vx; p.y += p.vy; p.alpha -= p.decay;
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.globalAlpha = 1;

    // Bottom scanline vignette
    const vignette = this.ctx.createLinearGradient(0, h * 0.6, 0, h);
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, 'rgba(0,0,0,0.5)');
    this.ctx.fillStyle = vignette;
    this.ctx.fillRect(0, 0, w, h);
  }

  /* ── Draw DC ── */
  /* istanbul ignore next */
  private drawDC(w: number, h: number): void {
    // Base gradient
    const grad = this.ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#00080f');
    grad.addColorStop(1, '#000d1a');
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, w, h);

    // Blue radial glow
    const radial = this.ctx.createRadialGradient(w / 2, h * 0.4, 0, w / 2, h * 0.4, w * 0.5);
    radial.addColorStop(0, 'rgba(26,83,160,0.12)');
    radial.addColorStop(1, 'rgba(0,0,0,0)');
    this.ctx.fillStyle = radial;
    this.ctx.fillRect(0, 0, w, h);

    // Stars twinkle
    for (const s of this.stars) {
      s.alpha += s.twinkleSpeed * s.twinkleDir;
      if (s.alpha >= 1) { s.alpha = 1; s.twinkleDir = -1; }
      if (s.alpha <= 0.1) { s.alpha = 0.1; s.twinkleDir = 1; }
      this.ctx.globalAlpha = s.alpha;
      this.ctx.fillStyle = '#ffffff';
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Lightning bolts
    this.boltTimer++;
    if (this.boltTimer > 120 + Math.random() * 80) {
      this.bolts.push(this.newBolt(w, h));
      this.boltTimer = 0;
    }
    this.bolts = this.bolts.filter(b => b.alpha > 0.01);
    for (const b of this.bolts) {
      b.alpha -= b.decay;
      this.ctx.globalAlpha = b.alpha;
      this.ctx.strokeStyle = b.color;
      this.ctx.lineWidth = 1.5;
      this.ctx.shadowColor = b.color;
      this.ctx.shadowBlur = 8;
      this.ctx.beginPath();
      this.ctx.moveTo(b.points[0].x, b.points[0].y);
      for (let i = 1; i < b.points.length; i++) {
        this.ctx.lineTo(b.points[i].x, b.points[i].y);
      }
      this.ctx.stroke();
      this.ctx.shadowBlur = 0;
    }

    // DC particles
    this.spawnDCParticles(w, h);
    this.particles = this.particles.filter(p => p.alpha > 0.01);
    for (const p of this.particles) {
      p.x += p.vx; p.y += p.vy; p.alpha -= p.decay;
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    }
    this.ctx.globalAlpha = 1;
  }
}
