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
}
