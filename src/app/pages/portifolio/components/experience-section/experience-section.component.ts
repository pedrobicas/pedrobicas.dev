import { Component, Input } from '@angular/core';
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
  styleUrls: ['./experience-section.component.scss']
})
export class ExperienceSectionComponent {
  @Input() experiences: Experience[] = [];
  dialogIndex: number | null = null;

  openDialog(idx: number) {
    this.dialogIndex = idx;
    document.body.style.overflow = 'hidden';
  }

  closeDialog() {
    this.dialogIndex = null;
    document.body.style.overflow = '';
  }

  getSelectedExperience(): Experience | undefined {
    return this.dialogIndex !== null ? this.experiences[this.dialogIndex] : undefined;
  }
}
