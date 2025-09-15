import { Component, HostListener, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  encapsulation: ViewEncapsulation.None
})
export class ExperienceSectionComponent implements OnInit, OnDestroy {
  @Input() experiences: Experience[] = [];
  dialogIndex: number | null = null;

  ngOnInit() {
    console.log('Experiences received:', this.experiences);
  }

  openDialog(idx: number) {
    this.dialogIndex = idx;
    document.body.style.overflow = 'hidden';
  }

  closeDialog() {
    this.dialogIndex = null;
    document.body.style.overflow = '';
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.dialogIndex !== null) {
      this.closeDialog();
    }
  }

  ngOnDestroy(): void {
    // Guarantee body scroll is restored if component is destroyed while dialog is open
    if (document && document.body) {
      document.body.style.overflow = '';
    }
  }

  getSelectedExperience(): Experience | undefined {
    return this.dialogIndex !== null ? this.experiences[this.dialogIndex] : undefined;
  }

  navigateExperience(step: number): void {
    if (this.dialogIndex === null || !this.experiences) return;
    
    const newIndex = this.dialogIndex + step;
    if (newIndex >= 0 && newIndex < this.experiences.length) {
      this.dialogIndex = newIndex;
    }
  }
}
