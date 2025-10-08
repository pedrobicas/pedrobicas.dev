import { Component, Input, OnInit, AfterViewInit, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy, signal } from '@angular/core';
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
export class ExperienceSectionComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() experiences: Experience[] = [];
  @ViewChild('timelineContainer') timelineContainer!: ElementRef;

  // Animation state
  isVisible = signal<boolean>(false);
  animatedExperiences = signal<Set<number>>(new Set());
  private observer?: IntersectionObserver;
  private prefersReducedMotion: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  ngOnInit() {
    // Initialization logic if needed
  }

  ngAfterViewInit(): void {
    this.setupIntersectionObserver();
    
    // Listen for force refresh events from parent
    if (this.timelineContainer?.nativeElement) {
      this.timelineContainer.nativeElement.addEventListener('forceRefresh', () => {
        this.forceRefresh();
      });
    }
  }

  private forceRefresh(): void {
    // Force component to refresh and show data
    this.isVisible.set(true);
    setTimeout(() => {
      this.startSequentialAnimation();
    }, 100);
  }

  private setupIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '-10% 0px -10% 0px', // Trigger when 10% of the section is visible
      threshold: 0.2
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.isVisible()) {
          this.isVisible.set(true);
          this.startSequentialAnimation();
        }
      });
    }, options);

    // Observe the experience section element
    const experienceSection = document.querySelector('.experience-section');
    if (experienceSection) {
      this.observer.observe(experienceSection);
    }
  }

  private startSequentialAnimation() {
    if (!this.isVisible() || this.prefersReducedMotion) return;

    // Animate experiences one by one with delay
    this.experiences.forEach((_, index) => {
      setTimeout(() => {
        const currentAnimated = this.animatedExperiences();
        const newAnimated = new Set(currentAnimated);
        newAnimated.add(index);
        this.animatedExperiences.set(newAnimated);
        
        // Add animation class to the specific timeline item
        const timelineItem = document.querySelector(`.timeline-item:nth-child(${index + 1})`);
        if (timelineItem) {
          timelineItem.classList.add('animate-in');
        }
      }, index * 300); // 300ms delay between each experience
    });
  }

  isExperienceAnimated(index: number): boolean {
    return this.animatedExperiences().has(index);
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
