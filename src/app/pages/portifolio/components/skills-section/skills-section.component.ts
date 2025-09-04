import { Component, Input, computed, signal, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skills-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills-section.component.html',
  styleUrls: ['./skills-section.component.scss']
})
export class SkillsSectionComponent implements OnInit {
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
  onIconEnter(idx: number) { this.hoveredIndex.set(idx); }
  onIconLeave() { this.hoveredIndex.set(null); }

  ngOnInit() {
    // No need for manual event listeners since we're using Angular click handlers
  }

  filterByCategory(category: string) {
    console.log('Filtering by category:', category);
    this.selectedCategory.set(category);
    
    // Update active pill
    const pills = document.querySelectorAll('.filter-pill');
    pills.forEach(pill => {
      pill.classList.remove('active');
      if (pill.getAttribute('data-category') === category) {
        pill.classList.add('active');
      }
    });

    // Simple grid animation
    const cells = document.querySelectorAll('.icon-cell');
    cells.forEach((cell, index) => {
      (cell as HTMLElement).style.opacity = '0';
      (cell as HTMLElement).style.transform = 'translateY(10px) scale(0.9)';
      
      setTimeout(() => {
        (cell as HTMLElement).style.opacity = '1';
        (cell as HTMLElement).style.transform = 'translateY(0) scale(1)';
        (cell as HTMLElement).style.transition = 'all 0.3s ease';
      }, index * 50);
    });
  }
}
