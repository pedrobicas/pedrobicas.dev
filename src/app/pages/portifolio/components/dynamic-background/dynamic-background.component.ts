import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

interface GeometricShape {
  x: number;
  y: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  opacity: number;
  type: 'triangle' | 'square' | 'hexagon' | 'circle';
  color: string;
  pulsePhase: number;
}

@Component({
  selector: 'app-dynamic-background',
  template: `
    <div class="dynamic-background">
      <canvas #backgroundCanvas></canvas>
      <div class="gradient-overlay"></div>
      <div class="floating-shape"></div>
      <div class="floating-shape"></div>
      <div class="floating-shape"></div>
      <div class="floating-shape"></div>
      <div class="floating-shape"></div>
    </div>
  `,
  styleUrls: ['./dynamic-background.component.scss'],
  standalone: true
})
export class DynamicBackgroundComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('backgroundCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private animationId!: number;
  private particles: Particle[] = [];
  private geometricShapes: GeometricShape[] = [];
  private mouseX = 0;
  private mouseY = 0;
  private lastScrollY = 0;
  private time = 0;
  
  private readonly maxParticles = window.innerWidth < 768 ? 12 : 25;
  private readonly maxShapes = window.innerWidth < 768 ? 3 : 6;
  
  private colors = [
    'rgba(13, 71, 161, 0.15)',    // --accent: #0d47a1 com transparência
    'rgba(21, 101, 192, 0.12)',   // --accent-light: #1565c0 com transparência
    'rgba(28, 87, 175, 0.10)',    // --accent: #1c57af com transparência
    'rgba(44, 131, 212, 0.08)',   // Azul intermediário
    'rgba(58, 141, 222, 0.06)',   // Azul mais claro
    'rgba(87, 203, 255, 0.04)'    // Azul muito claro
  ];

  ngOnInit() {
    this.setupEventListeners();
  }

  ngAfterViewInit() {
    this.canvas = this.canvasRef.nativeElement;
    this.ctx = this.canvas.getContext('2d')!;
    this.resizeCanvas();
    this.initializeParticles();
    this.initializeGeometricShapes();
    this.animate();
  }

  ngOnDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    window.removeEventListener('resize', this.resizeCanvas.bind(this));
    window.removeEventListener('mousemove', this.handleMouseMove.bind(this));
    window.removeEventListener('click', this.handleClick.bind(this));
    window.removeEventListener('scroll', this.handleScroll.bind(this));
  }

  private setupEventListeners() {
    window.addEventListener('resize', this.resizeCanvas.bind(this));
    window.addEventListener('mousemove', this.handleMouseMove.bind(this));
    window.addEventListener('click', this.handleClick.bind(this));
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  private handleClick(event: MouseEvent) {
    // Apenas efeito de ripple no clique, sem criar partículas
    const clickX = event.clientX;
    const clickY = event.clientY;
    
    // Efeito de ripple grande no clique
    this.createRippleEffect(clickX, clickY, 150);
  }

  private handleScroll() {
    const currentScrollY = window.scrollY;
    const scrollVelocity = Math.abs(currentScrollY - this.lastScrollY);
    
    // Efeito muito sutil baseado no scroll
    if (scrollVelocity > 10) { // Aumentado o threshold
      for (let i = 0; i < Math.min(scrollVelocity / 20, 2); i++) { // Menos partículas
        const particle = this.createParticle();
        particle.opacity = 0.05; // Muito sutil
        particle.size = Math.random() * 0.8 + 0.3; // Partículas menores
        this.particles.push(particle);
      }
    }
    
    this.lastScrollY = currentScrollY;
  }

  private createExplosionEffect(x: number, y: number) {
    // Create multiple particles in a burst
    for (let i = 0; i < 15; i++) {
      const angle = (Math.PI * 2 * i) / 15;
      const speed = Math.random() * 3 + 2;
      const particle = this.createParticle();
      particle.x = x;
      particle.y = y;
      particle.vx = Math.cos(angle) * speed;
      particle.vy = Math.sin(angle) * speed;
      particle.size = Math.random() * 4 + 2;
      particle.opacity = 1;
      this.particles.push(particle);
    }
  }

  private resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  private handleMouseMove(event: MouseEvent) {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
    
    // Efeito mais interativo no movimento do mouse
    if (Math.random() < 0.08) { // Aumentado para 8% de chance
      const particle = this.createParticle();
      particle.x = this.mouseX + (Math.random() - 0.5) * 50;
      particle.y = this.mouseY + (Math.random() - 0.5) * 50;
      particle.size = Math.random() * 2 + 0.8; // Partículas maiores
      particle.opacity = 0.2; // Mais visível
      particle.color = this.colors[Math.floor(Math.random() * this.colors.length)];
      this.particles.push(particle);
    }
    
    // Efeito de ripple no cursor
    if (Math.random() < 0.15) { // 15% de chance para ripple
      this.createRippleEffect(this.mouseX, this.mouseY);
    }
  }

  private createRippleEffect(x: number, y: number, maxRadius: number = 80) {
    // Criar múltiplas ondas de ripple
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const ripple = {
          x: x,
          y: y,
          radius: 0,
          maxRadius: maxRadius + (i * 20),
          opacity: 0.3 - (i * 0.1),
          color: this.colors[Math.floor(Math.random() * this.colors.length)]
        };
        
        this.animateRipple(ripple);
      }, i * 100);
    }
  }

  private animateRipple(ripple: any) {
    const animate = () => {
      ripple.radius += 3;
      ripple.opacity *= 0.95;
      
      this.ctx.save();
      this.ctx.globalAlpha = ripple.opacity;
      this.ctx.strokeStyle = ripple.color;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
      this.ctx.stroke();
      this.ctx.restore();
      
      if (ripple.radius < ripple.maxRadius && ripple.opacity > 0.01) {
        requestAnimationFrame(animate);
      }
    };
    animate();
  }

  private initializeParticles() {
    this.particles = [];
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push(this.createParticle());
    }
  }

  private createParticle(): Particle {
    const maxLife = Math.random() * 300 + 200;
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      color: this.colors[Math.floor(Math.random() * this.colors.length)],
      life: maxLife,
      maxLife: maxLife
    };
  }

  private initializeGeometricShapes() {
    this.geometricShapes = [];
    const shapeTypes: ('triangle' | 'square' | 'hexagon' | 'circle')[] = ['triangle', 'square', 'hexagon', 'circle'];
    
    for (let i = 0; i < this.maxShapes; i++) {
      this.geometricShapes.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        size: Math.random() * 40 + 20,
        opacity: Math.random() * 0.3 + 0.1,
        type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        pulsePhase: Math.random() * Math.PI * 2
      });
    }
  }

  private animate() {
    this.time += 0.016;
    
    // Performance optimization: skip frames if needed
    if (this.time % 2 === 0) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    } else {
      // Clear with fade effect for smoother animation but without trails
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    this.updateAndDrawParticles();
    this.updateAndDrawGeometricShapes();
    
    // Only draw connections and mouse interaction every other frame for performance
    if (this.time % 2 === 0) {
      this.drawConnections();
      this.drawMouseInteraction();
    }
    
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  private updateAndDrawParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Mouse interaction
      const dx = this.mouseX - particle.x;
      const dy = this.mouseY - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 150) {
        const force = (150 - distance) / 150;
        particle.vx += (dx / distance) * force * 0.01;
        particle.vy += (dy / distance) * force * 0.01;
      }
      
      // Boundary check
      if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
      
      // Keep particles in bounds
      particle.x = Math.max(0, Math.min(this.canvas.width, particle.x));
      particle.y = Math.max(0, Math.min(this.canvas.height, particle.y));
      
      // Update life
      particle.life--;
      particle.opacity = (particle.life / particle.maxLife) * 0.8;
      
      // Draw particle
      this.ctx.save();
      this.ctx.globalAlpha = particle.opacity;
      this.ctx.fillStyle = particle.color;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
      
      // Remove dead particles
      if (particle.life <= 0) {
        this.particles.splice(i, 1);
        this.particles.push(this.createParticle());
      }
    }
  }

  private updateAndDrawGeometricShapes() {
    for (const shape of this.geometricShapes) {
      // Update rotation
      shape.rotation += shape.rotationSpeed;
      shape.pulsePhase += 0.02;
      
      // Pulse effect
      const pulseSize = shape.size + Math.sin(shape.pulsePhase) * 5;
      const pulseOpacity = shape.opacity + Math.sin(shape.pulsePhase * 0.5) * 0.1;
      
      // Draw shape
      this.ctx.save();
      this.ctx.translate(shape.x, shape.y);
      this.ctx.rotate(shape.rotation);
      this.ctx.globalAlpha = pulseOpacity;
      this.ctx.strokeStyle = shape.color;
      this.ctx.lineWidth = 2;
      
      this.drawShape(shape.type, pulseSize);
      
      this.ctx.restore();
      
      // Slow movement
      shape.x += Math.sin(this.time * 0.5 + shape.pulsePhase) * 0.2;
      shape.y += Math.cos(this.time * 0.3 + shape.pulsePhase) * 0.15;
      
      // Keep shapes in bounds
      if (shape.x < -50) shape.x = this.canvas.width + 50;
      if (shape.x > this.canvas.width + 50) shape.x = -50;
      if (shape.y < -50) shape.y = this.canvas.height + 50;
      if (shape.y > this.canvas.height + 50) shape.y = -50;
    }
  }

  private drawShape(type: string, size: number) {
    this.ctx.beginPath();
    
    switch (type) {
      case 'triangle':
        this.ctx.moveTo(0, -size / 2);
        this.ctx.lineTo(-size / 2, size / 2);
        this.ctx.lineTo(size / 2, size / 2);
        this.ctx.closePath();
        break;
      case 'square':
        this.ctx.rect(-size / 2, -size / 2, size, size);
        break;
      case 'hexagon':
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const x = Math.cos(angle) * size / 2;
          const y = Math.sin(angle) * size / 2;
          if (i === 0) this.ctx.moveTo(x, y);
          else this.ctx.lineTo(x, y);
        }
        this.ctx.closePath();
        break;
      case 'circle':
        this.ctx.arc(0, 0, size / 2, 0, Math.PI * 2);
        break;
    }
    
    this.ctx.stroke();
  }

  private drawConnections() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 120) {
          const opacity = (120 - distance) / 120 * 0.3;
          this.ctx.save();
          this.ctx.globalAlpha = opacity;
          this.ctx.strokeStyle = 'rgba(44, 131, 212, 0.5)';
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
          this.ctx.restore();
        }
      }
    }
  }

  private drawMouseInteraction() {
    if (this.mouseX && this.mouseY) {
      // Efeito de aura azul ao redor do cursor
      this.ctx.save();
      
      // Gradiente radial com as cores do portfólio
      const gradient = this.ctx.createRadialGradient(
        this.mouseX, this.mouseY, 0,
        this.mouseX, this.mouseY, 120
      );
      gradient.addColorStop(0, 'rgba(28, 87, 175, 0.3)');
      gradient.addColorStop(0.3, 'rgba(21, 101, 192, 0.2)');
      gradient.addColorStop(0.6, 'rgba(13, 71, 161, 0.1)');
      gradient.addColorStop(1, 'transparent');
      
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(this.mouseX, this.mouseY, 120, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Círculo interno pulsante
      const pulseRadius = 20 + Math.sin(this.time * 3) * 5;
      this.ctx.globalAlpha = 0.4 + Math.sin(this.time * 2) * 0.2;
      this.ctx.fillStyle = 'rgba(58, 141, 222, 0.4)';
      this.ctx.beginPath();
      this.ctx.arc(this.mouseX, this.mouseY, pulseRadius, 0, Math.PI * 2);
      this.ctx.fill();
      
      this.ctx.restore();
    }
  }
}