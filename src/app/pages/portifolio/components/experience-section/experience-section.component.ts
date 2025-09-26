import { Component, Input, OnInit, AfterViewInit, ElementRef, ViewChild, ChangeDetectorRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Experience {
  year: string;
  title: string;
  description: string;
  type?: string;
  technologies?: string[];
  icon?: string;
}

@Component({
  selector: 'app-experience-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience-section.component.html',
  styleUrls: ['./experience-section.component.scss'],
})
export class ExperienceSectionComponent implements OnInit, AfterViewInit {
  @Input() experiences: Experience[] = [];
  @ViewChild('timelineContainer') timelineContainer!: ElementRef;

  visibleExperiences: Experience[] = [];
  private observer?: IntersectionObserver;
  private prefersReducedMotion: boolean = false;

  // Paginação
  currentPage: number = 1;
  itemsPerPage: number = 3;
  totalPages: number = 1;
  pagesArray: number[] = [];

  // Estados de transição
  isLeaving = false;
  isEntering = false;
  switchDirection: 'next' | 'prev' | null = null;

  constructor(private cdr: ChangeDetectorRef) {
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  ngOnInit() {
    this.totalPages = Math.ceil(this.experiences.length / this.itemsPerPage) || 1;
    this.pagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
    this.updateVisibleExperiences();
  }

  ngAfterViewInit(): void {
    if (!this.prefersReducedMotion) {
      this.initializeAnimations();
    }
    
    // Adicionar classe animated com atraso para cada card
    setTimeout(() => {
      const cards = this.timelineContainer.nativeElement.querySelectorAll('.timeline-item');
      cards.forEach((card: HTMLElement) => {
        card.classList.add('animated');
      });
    }, 100);
  }

  private initializeAnimations(): void {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          this.observer?.unobserve(entry.target);
        }
      });
    }, options);

    // Adia a observação para garantir que os elementos estejam no DOM
    setTimeout(() => this.observeElements(), 0);
  }

  private observeElements(): void {
    const timelineItems = this.timelineContainer?.nativeElement.querySelectorAll('.timeline-item');
    
    if (timelineItems) {
      timelineItems.forEach((item: Element, index: number) => {
        const htmlItem = item as HTMLElement;
        
        // Animação ultra simples
        htmlItem.style.opacity = '0';
        htmlItem.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
          htmlItem.style.transition = 'all 0.6s ease';
          htmlItem.style.opacity = '1';
          htmlItem.style.transform = 'translateY(0)';
        }, index * 200);
      });
    }
  }

  // Lógica de Paginação
  updateVisibleExperiences(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.visibleExperiences = this.experiences.slice(startIndex, endIndex);
    
    // Força a detecção de mudanças e re-observa os elementos
    this.cdr.detectChanges();
    if (!this.prefersReducedMotion) {
      this.observeElements();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updateVisibleExperiences();
    }
  }

  private triggerSwitch(direction: 'next' | 'prev'): void {
    if (this.prefersReducedMotion) {
      return; // Evita animações em usuários com redução de movimento
    }
    this.switchDirection = direction;
    this.isLeaving = true;
    this.isEntering = false;
    setTimeout(() => {
      this.isLeaving = false;
      this.isEntering = true;
      setTimeout(() => {
        this.isEntering = false;
        this.switchDirection = null;
      }, 300); // duração de entrada
    }, 250); // duração de saída
  }

  goToPageAnimated(page: number): void {
    if (page === this.currentPage) return;
    const direction: 'next' | 'prev' = page > this.currentPage ? 'next' : 'prev';
    this.triggerSwitch(direction);
    setTimeout(() => {
      this.currentPage = page;
      this.updateVisibleExperiences();
    }, 250);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.triggerSwitch('next');
      setTimeout(() => {
        this.currentPage++;
        this.updateVisibleExperiences();
      }, 250);
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.triggerSwitch('prev');
      setTimeout(() => {
        this.currentPage--;
        this.updateVisibleExperiences();
      }, 250);
    }
  }

  isPrevDisabled(): boolean {
    return this.currentPage === 1;
  }

  isNextDisabled(): boolean {
    return this.currentPage === this.totalPages;
  }

  // Navegação por teclado
  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      this.prevPage();
    } else if (event.key === 'ArrowRight') {
      this.nextPage();
    }
  }
}
