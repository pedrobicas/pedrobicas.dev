import { Component, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { TypingEffectComponent } from '../../components/shared/typing-effect/typing-effect.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TypingEffectComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {
  typingTexts = [
    "Desenvolvedor Full-Stack",
    "Estudante de Engenharia de Software"
  ];

  // Para animação de entrada
  taglineWords = ['Código', 'Design', 'Inovação'];
  showTyping = false;

  ngAfterViewInit() {
    // Ativar o efeito de digitação após um pequeno delay
    setTimeout(() => {
      this.showTyping = true;
    }, 1000);
  }

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    const sections = document.querySelectorAll('.section');
    const windowHeight = window.innerHeight;
    
    sections.forEach((section) => {
      const sectionTop = section.getBoundingClientRect().top;
      
      if (sectionTop < windowHeight - 100) {
        section.classList.add('visible');
      }
    });
  }

  scrollTo(section: string): void {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}