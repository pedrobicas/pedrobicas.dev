import { Component, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projects-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects-section.component.html',
  styleUrls: ['./projects-section.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProjectsSectionComponent {
  @Input() projects: any[] = [];
  activeProjectIndex = 0;

  touchStartX = 0;
  touchEndX = 0;

  carouselPrev() {
    if (this.projects.length === 0) return;
    this.activeProjectIndex = (this.activeProjectIndex - 1 + this.projects.length) % this.projects.length;
  }
  carouselNext() {
    if (this.projects.length === 0) return;
    this.activeProjectIndex = (this.activeProjectIndex + 1) % this.projects.length;
  }
  goToProject(index: number) {
    if (this.projects.length === 0) return;
    this.activeProjectIndex = index;
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
}
