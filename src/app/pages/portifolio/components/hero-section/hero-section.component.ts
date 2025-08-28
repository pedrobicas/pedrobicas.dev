import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.scss']
})
export class HeroSectionComponent {
  @Input() name: string = 'Pedro Bicas';
  @Input() role: string = 'Desenvolvedor FullStack';
  @Input() avatar: string = 'assets/images/developer-activity-animate.svg';
  @Input() socialLinks: { icon: string, url: string, label: string }[] = [];

  get firstNameLetters(): string[] {
    return this.name.split(' ')[0]?.split('') || [];
  }
  get lastNameLetters(): string[] {
    return this.name.split(' ')[1]?.split('') || [];
  }
}
