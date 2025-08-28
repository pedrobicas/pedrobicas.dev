import { Component, Input, CUSTOM_ELEMENTS_SCHEMA, OnDestroy, OnInit, ElementRef, QueryList, ViewChildren, HostListener, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projects-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects-section.component.html',
  styleUrls: ['./projects-section.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProjectsSectionComponent implements OnInit, OnDestroy {
  @Input() projects: any[] = [];
  activeProjectIndex = 0;

  touchStartX = 0;
  touchEndX = 0;
  isAnimating = false;
  autoplayIntervalMs = 5000;
  autoplayTimer: any = null;
  autoplayProgress = 0;
  progressTimer: any = null;
  trackHeight = 420;
  containerHeight = 520;

  @ViewChildren('cardRef') cardRefs!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('pillRef') pillRefs!: QueryList<ElementRef<HTMLButtonElement>>;
  @ViewChild('navTrack') navTrackRef!: ElementRef<HTMLDivElement>;

  carouselPrev() {
    if (this.projects.length === 0) return;
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.activeProjectIndex = (this.activeProjectIndex - 1 + this.projects.length) % this.projects.length;
    queueMicrotask(() => {
      this.updateTrackHeight();
      this.scrollActivePillIntoView();
      this.isAnimating = false;
    });
  }
  carouselNext() {
    if (this.projects.length === 0) return;
    if (this.isAnimating) return;
    this.isAnimating = true;
    this.activeProjectIndex = (this.activeProjectIndex + 1) % this.projects.length;
    queueMicrotask(() => {
      this.updateTrackHeight();
      this.scrollActivePillIntoView();
      this.isAnimating = false;
    });
  }
  goToProject(index: number) {
    if (this.projects.length === 0) return;
    this.activeProjectIndex = index;
    this.updateTrackHeight();
    this.scrollActivePillIntoView();
  }

  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX;
  }
  onTouchMove(event: TouchEvent) {
    this.touchEndX = event.touches[0].clientX;
  }
  onTouchEnd() {
    const delta = this.touchEndX - this.touchStartX;
    if (Math.abs(delta) > 40) {
      if (delta < 0) this.carouselNext();
      else this.carouselPrev();
    }
    this.touchStartX = 0;
    this.touchEndX = 0;
  }

  onKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.carouselPrev();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.carouselNext();
    }
  }

  getSlideClasses(index: number) {
    const total = this.projects.length;
    const current = this.activeProjectIndex;
    if (index === current) return 'is-active';
    const prev = (current - 1 + total) % total;
    const next = (current + 1) % total;
    const prev2 = (current - 2 + total) % total;
    const next2 = (current + 2) % total;
    if (index === prev) return 'is-prev';
    if (index === next) return 'is-next';
    if (index === prev2) return 'is-prev-2';
    if (index === next2) return 'is-next-2';
    return '';
  }

  ngOnInit() {
    this.startAutoplay();
  }

  ngOnDestroy() {
    this.clearAutoplay();
  }

  startAutoplay() {
    this.clearAutoplay();
    if (!this.projects || this.projects.length <= 1) return;
    const stepMs = 50;
    let elapsed = 0;
    this.autoplayProgress = 0;
    this.autoplayTimer = setInterval(() => {
      elapsed += stepMs;
      this.autoplayProgress = Math.min(100, (elapsed / this.autoplayIntervalMs) * 100);
      if (elapsed >= this.autoplayIntervalMs) {
        this.carouselNext();
        elapsed = 0;
        this.autoplayProgress = 0;
      }
    }, stepMs);
  }

  clearAutoplay() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }

  pauseAutoplay() {
    this.clearAutoplay();
  }

  resumeAutoplay() {
    this.startAutoplay();
  }

  ngAfterViewInit() {
    this.updateHeights();
    this.cardRefs.changes.subscribe(() => this.updateHeights());
    this.pillRefs.changes.subscribe(() => this.scrollActivePillIntoView());
    queueMicrotask(() => this.scrollActivePillIntoView());
  }

  @HostListener('window:resize')
  onResize() {
    this.updateHeights();
  }

  updateTrackHeight() {
    try {
      const cards = this.cardRefs?.toArray() ?? [];
      const activeCard = cards[this.activeProjectIndex]?.nativeElement;
      const activeHeight = activeCard ? activeCard.getBoundingClientRect().height : 420;
      // Add some breathing room for transforms/shadows
      this.trackHeight = Math.ceil(activeHeight + 24);
    } catch {
      this.trackHeight = 420;
    }
  }

  updateHeights() {
    try {
      const cards = this.cardRefs?.toArray() ?? [];
      const heights = cards.map(ref => ref.nativeElement.getBoundingClientRect().height);
      const maxHeight = heights.length ? Math.max(...heights) : 420;
      this.containerHeight = Math.ceil(maxHeight + 110); // include navbar reserved space
      this.updateTrackHeight();
    } catch {
      this.containerHeight = 520;
      this.trackHeight = 420;
    }
  }

  private scrollActivePillIntoView() {
    try {
      const pills = this.pillRefs?.toArray() ?? [];
      const activePill = pills[this.activeProjectIndex]?.nativeElement;
      const track = this.navTrackRef?.nativeElement;
      if (!activePill || !track) return;
      const pillRect = activePill.getBoundingClientRect();
      const trackRect = track.getBoundingClientRect();
      const offset = (pillRect.left + pillRect.right) / 2 - (trackRect.left + trackRect.right) / 2;
      track.scrollBy({ left: offset, behavior: 'smooth' });
    } catch {}
  }
}
