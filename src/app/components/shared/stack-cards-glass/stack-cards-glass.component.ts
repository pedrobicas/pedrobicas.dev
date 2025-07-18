import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface StackCard {
  name: string;
  icon: string;
  bg: string;
}

@Component({
  selector: 'app-stack-cards-glass',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stack-cards-glass.component.html',
  styleUrls: ['./stack-cards-glass.component.scss']
})
export class StackCardsGlassComponent {
  stacks: StackCard[] = [
    { name: 'Angular', icon: 'fab fa-angular', bg: 'linear-gradient(120deg, #DD0031 60%, #112240 100%)' },
    { name: 'React', icon: 'fab fa-react', bg: 'linear-gradient(120deg, #61DAFB 60%, #112240 100%)' },
    { name: 'Node.js', icon: 'fab fa-node-js', bg: 'linear-gradient(120deg, #3C873A 60%, #112240 100%)' },
    { name: 'TypeScript', icon: 'fas fa-code', bg: 'linear-gradient(120deg, #3178C6 60%, #112240 100%)' },
    { name: 'Java', icon: 'fab fa-java', bg: 'linear-gradient(120deg, #E76F00 60%, #112240 100%)' },
    { name: 'Spring Boot', icon: 'fas fa-leaf', bg: 'linear-gradient(120deg, #6DB33F 60%, #112240 100%)' },
    { name: 'PostgreSQL', icon: 'fas fa-database', bg: 'linear-gradient(120deg, #336791 60%, #112240 100%)' },
    { name: 'MongoDB', icon: 'fas fa-database', bg: 'linear-gradient(120deg, #47A248 60%, #112240 100%)' },
    { name: 'Docker', icon: 'fab fa-docker', bg: 'linear-gradient(120deg, #2496ED 60%, #112240 100%)' }
  ];
} 