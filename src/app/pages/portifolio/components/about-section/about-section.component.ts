import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about-section.component.html',
  styleUrls: ['./about-section.component.scss']
})
export class AboutSectionComponent {
  @Input() aboutText: string = '';
  @Input() techHighlights: string[] = [];
  @Input() experiences: { year: string, title: string, description: string }[] = [];
}
