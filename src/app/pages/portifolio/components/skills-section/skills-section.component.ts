import { Component, Input, computed, signal, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skills-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills-section.component.html',
  styleUrls: ['./skills-section.component.scss']
})
export class SkillsSectionComponent implements OnInit, AfterViewInit {
  @Input() skillCategories: any[] = [];
  @ViewChild('iconGrid') iconGrid!: ElementRef;

  // Current filter state
  selectedCategory = signal<string>('all');
  
  // Animation state
  isVisible = signal<boolean>(false);
  private observer?: IntersectionObserver;

  // flatten skills for minimalist grid
  flatIcons = computed(() => {
    const cats = this.skillCategories || [];
    const list: any[] = [];
    cats.forEach((c: any) => (c.skills || []).forEach((s: any) => list.push({ ...s, _category: c.name })));
    return list;
  });

  // Filtered skills based on selected category
  filteredIcons = computed(() => {
    const category = this.selectedCategory();
    if (category === 'all') return this.flatIcons();
    return this.flatIcons().filter(skill => skill._category === category);
  });

  // hover highlight state
  hoveredIndex = signal<number | null>(null);

  ngOnInit() {
    // Initialization logic if needed
  }

  ngAfterViewInit() {
    this.setupIntersectionObserver();
    
    // Listen for force refresh events from parent
    if (this.iconGrid?.nativeElement) {
      this.iconGrid.nativeElement.addEventListener('forceRefresh', () => {
        this.forceRefresh();
      });
    }
  }

  private forceRefresh(): void {
    // Force component to refresh and show data
    this.isVisible.set(true);
    setTimeout(() => {
      this.setupCircuitAnimation();
    }, 100);
  }

  private setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '-20% 0px -20% 0px', // Trigger when 20% of the section is visible
      threshold: 0.3
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.isVisible()) {
          this.isVisible.set(true);
          this.setupCircuitAnimation();
        }
      });
    }, options);

    // Observe the skills section element
    const skillsSection = document.querySelector('.skills-section');
    if (skillsSection) {
      this.observer.observe(skillsSection);
    }
  }

  private setupCircuitAnimation() {
    // Only run animation if section is visible
    if (!this.isVisible()) return;
    
    const iconCells = document.querySelectorAll('.icon-cell');
    
    iconCells.forEach((cell, index) => {
      // Criar padrão de ativação de circuito baseado na posição
      const row = Math.floor(index / 6); // Assumindo 6 colunas
      const col = index % 6;
      
      // Algoritmo de ativação em padrão de circuito integrado mais lento
      const circuitDelay = (row * 1.5) + (col * 0.8) + Math.random() * 0.5;
      
      (cell as HTMLElement).style.setProperty('--circuit-delay', circuitDelay.toString());
      
      // Add animation class to trigger CSS animations
      (cell as HTMLElement).classList.add('animate-in');
    });
  }

  filterByCategory(category: string) {
    this.selectedCategory.set(category);
    
    // Update active filter pill
    document.querySelectorAll('.filter-pill').forEach(pill => pill.classList.remove('active'));
    document.querySelector(`[data-category="${category}"]`)?.classList.add('active');
    
    // Reconfigurar animação após filtro apenas se a seção estiver visível
    if (this.isVisible()) {
      setTimeout(() => this.setupCircuitAnimation(), 50);
    }
  }

  onIconEnter(index: number) {
    this.hoveredIndex.set(index);
  }

  onIconLeave() {
    this.hoveredIndex.set(null);
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
