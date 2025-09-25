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
    this.setupCircuitAnimation();
  }

  private setupCircuitAnimation() {
    const iconCells = document.querySelectorAll('.icon-cell');
    
    iconCells.forEach((cell, index) => {
      // Criar padrão de ativação de circuito baseado na posição
      const row = Math.floor(index / 6); // Assumindo 6 colunas
      const col = index % 6;
      
      // Algoritmo de ativação em padrão de circuito integrado
      const circuitDelay = (row * 2) + (col * 0.5) + Math.random() * 0.3;
      
      (cell as HTMLElement).style.setProperty('--circuit-delay', circuitDelay.toString());
    });
  }

  filterByCategory(category: string) {
    this.selectedCategory.set(category);
    
    // Update active filter pill
    document.querySelectorAll('.filter-pill').forEach(pill => pill.classList.remove('active'));
    document.querySelector(`[data-category="${category}"]`)?.classList.add('active');
    
    // Reconfigurar animação após filtro
    setTimeout(() => this.setupCircuitAnimation(), 50);
  }

  onIconEnter(index: number) {
    this.hoveredIndex.set(index);
  }

  onIconLeave() {
    this.hoveredIndex.set(null);
  }
}
