import { Component, HostListener, Input, OnDestroy, OnInit, AfterViewInit, ElementRef, Renderer2, ViewEncapsulation, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger, state } from '@angular/animations';

interface Experience {
  year: string;
  title: string;
  description: string;
  type?: string;
  details?: string[];
  technologies?: string[];
}

@Component({
  selector: 'app-experience-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience-section.component.html',
  styleUrls: ['./experience-section.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0,
        transform: 'translateY(20px)'
      })),
      transition('void <=> *', [
        animate('0.6s cubic-bezier(0.23, 1, 0.32, 1)')
      ])
    ])
  ]
})
export class ExperienceSectionComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() experiences: Experience[] = [];
  @ViewChild('timelineContainer') timelineContainer!: ElementRef;
  
  activeIndex: number = 0;
  private autoPlayInterval?: any;
  private observer?: IntersectionObserver;
  private mouseMoveUnlisten?: () => void;
  private mouseLeaveUnlisten?: () => void;
  private timelineEl!: HTMLElement;
  private prefersReducedMotion: boolean = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {
    // Verificar preferência de redução de movimento
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  ngOnInit() {
    console.log('Experiences received:', this.experiences);
    if (!this.prefersReducedMotion) {
      this.startAutoPlay();
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initializeAnimations();
    }, 100);
  }

  private initializeAnimations(): void {
    try {
      this.timelineEl = this.timelineContainer?.nativeElement || document.querySelector('.experience-timeline');
      if (!this.timelineEl) return;

      // Configurar observador de interseção para animar itens quando entrarem no viewport
      const items = this.timelineEl.querySelectorAll('.timeline-item') || [];
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          const target = e.target as HTMLElement;
          if (e.isIntersecting) {
            target.classList.add('in-view');
            // Adicionar efeito de destaque temporário
            if (!this.prefersReducedMotion) {
              setTimeout(() => {
                target.classList.add('highlight-pulse');
                setTimeout(() => target.classList.remove('highlight-pulse'), 1000);
              }, 300);
            }
          } else {
            target.classList.remove('in-view');
          }
        });
      }, { 
        root: null, // viewport
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px'
      });

      items.forEach(i => this.observer?.observe(i));

      // Adicionar efeito de entrada inicial aos itens
      Array.from(items).forEach((item, index) => {
        const el = item as HTMLElement;
        if (!this.prefersReducedMotion) {
          el.style.animationDelay = `${index * 0.15}s`;
        }
      });

      // Inicializar efeito parallax 3D
      this.initializeParallaxEffect();
    } catch (err) {
      console.warn('Animações inicializadas com erro:', err);
    }
  }

  private initializeParallaxEffect(): void {
    if (this.prefersReducedMotion || !this.timelineEl) return;
    
    // Adicionar efeito parallax ao container
    this.timelineEl.classList.add('parallax-enabled');
    
    // Adiciona efeito de partículas em movimento
    this.createParticleEffect();
    
    // Adiciona efeito de grid pulsante
    this.createGridEffect();
  }
  
  // Cria efeito de partículas em movimento
  private createParticleEffect(): void {
    const section = this.el.nativeElement.querySelector('.experience-section');
    if (!section) return;
    
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particle-container';
    section.appendChild(particleContainer);
    
    // Cria partículas dinâmicas
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'floating-particle';
      
      // Posição aleatória
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      const size = Math.random() * 5 + 2;
      const duration = Math.random() * 20 + 10;
      const delay = Math.random() * 5;
      
      particle.style.cssText = `
        left: ${posX}%;
        top: ${posY}%;
        width: ${size}px;
        height: ${size}px;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
        opacity: ${Math.random() * 0.5 + 0.1};
      `;
      
      particleContainer.appendChild(particle);
    }
  }
  
  // Cria efeito de grid pulsante
  private createGridEffect(): void {
    const section = this.el.nativeElement.querySelector('.experience-section');
    if (!section) return;
    
    const gridContainer = document.createElement('div');
    gridContainer.className = 'grid-effect';
    section.appendChild(gridContainer);
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
    if (this.observer) this.observer.disconnect();
    if (this.mouseMoveUnlisten) this.mouseMoveUnlisten();
    if (this.mouseLeaveUnlisten) this.mouseLeaveUnlisten();
    
    // Remove elementos dinâmicos
    const section = this.el.nativeElement.querySelector('.experience-section');
    if (section) {
      const particleContainer = section.querySelector('.particle-container');
      if (particleContainer) section.removeChild(particleContainer);
      
      const gridContainer = section.querySelector('.grid-effect');
      if (gridContainer) section.removeChild(gridContainer);
    }
  }

  setActive(index: number): void {
    // Adicionar efeito de transição ao mudar o item ativo
    const prevIndex = this.activeIndex;
    this.activeIndex = index;
    
    if (!this.prefersReducedMotion) {
      const items = this.timelineEl?.querySelectorAll('.timeline-item');
      if (items && items[prevIndex]) {
        const prevItem = items[prevIndex] as HTMLElement;
        prevItem.classList.add('fade-out');
        setTimeout(() => prevItem.classList.remove('fade-out'), 300);
      }
      
      if (items && items[index]) {
        const newItem = items[index] as HTMLElement;
        newItem.classList.add('pop-in');
        setTimeout(() => newItem.classList.remove('pop-in'), 500);
      }
    }
    
    this.restartAutoPlay();
  }

  navigate(direction: number): void {
    const newIndex = this.activeIndex + direction;
    if (newIndex >= 0 && newIndex < this.experiences.length) {
      this.setActive(newIndex);
    }
  }

  // Efeito de hover nos itens
  onItemHover(event: MouseEvent): void {
    if (this.prefersReducedMotion) return;
    
    const target = event.currentTarget as HTMLElement;
    target.classList.add('hover-effect');
    
    // Adicionar efeito de brilho temporário ao dot
    const dot = target.querySelector('.dot-inner');
    if (dot) {
      dot.classList.add('glow');
      setTimeout(() => dot.classList.remove('glow'), 1000);
    }
  }

  // Efeito de movimento do mouse dentro do item
  onItemMouseMove(event: MouseEvent): void {
    if (this.prefersReducedMotion) return;
    
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    
    // Calcular posição relativa do mouse dentro do elemento (0-100%)
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    
    // Aplicar efeito de luz baseado na posição do mouse
    this.renderer.setStyle(target, '--x', `${x}%`);
    this.renderer.setStyle(target, '--y', `${y}%`);
  }

  private startAutoPlay(): void {
    this.autoPlayInterval = setInterval(() => {
      this.activeIndex = (this.activeIndex + 1) % this.experiences.length;
      
      // Adicionar efeito de transição suave
      const items = this.timelineEl?.querySelectorAll('.timeline-item');
      if (items && items[this.activeIndex]) {
        const activeItem = items[this.activeIndex] as HTMLElement;
        activeItem.classList.add('auto-transition');
        setTimeout(() => activeItem.classList.remove('auto-transition'), 500);
      }
    }, 6000); // Aumentado para 6 segundos para dar mais tempo de leitura
  }

  private stopAutoPlay(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }

  private restartAutoPlay(): void {
    this.stopAutoPlay();
    if (!this.prefersReducedMotion) {
      this.startAutoPlay();
    }
  }

  @HostListener('document:keydown.arrowLeft')
  onArrowLeft(): void {
    this.navigate(-1);
  }

  @HostListener('document:keydown.arrowRight')
  onArrowRight(): void {
    this.navigate(1);
  }

  // Efeito parallax avançado
  onMouseMove(event: MouseEvent): void {
    if (this.prefersReducedMotion || !this.timelineEl) return;
    
    const rect = this.timelineEl.getBoundingClientRect();
    
    // Calcular posição relativa do mouse em relação ao centro do elemento
    const px = ((event.clientX - rect.left) - rect.width / 2) / 10;
    const py = ((event.clientY - rect.top) - rect.height / 2) / 10;
    
    // Aplicar efeito parallax com suavização
    this.renderer.setStyle(this.timelineEl, '--px', `${px.toFixed(2)}`);
    this.renderer.setStyle(this.timelineEl, '--py', `${py.toFixed(2)}`);
    
    // Adicionar classe para ativar o efeito 3D
    this.timelineEl.classList.add('parallax');
  }

  resetParallax(): void {
    if (!this.timelineEl) return;
    
    // Resetar variáveis CSS com transição suave
    this.renderer.setStyle(this.timelineEl, '--px', '0');
    this.renderer.setStyle(this.timelineEl, '--py', '0');
    
    // Remover classe de efeito parallax
    this.timelineEl.classList.remove('parallax');
  }
}
