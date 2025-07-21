// home.component.ts
import { Component, HostListener, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TypingEffectComponent } from '../../components/typing-effect/typing-effect.component';
import { ProjectSliderComponent } from '../../components/project-slider/project-slider.component';
import { SwiperOptions } from 'swiper/types';
import { register } from 'swiper/element/bundle';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TypingEffectComponent, ProjectSliderComponent],
  templateUrl: './portifolio.component.html',
  styleUrls: ['./portifolio.component.scss']
})
export class PortifolioComponent implements OnInit {
  private fb = inject(FormBuilder);
  
  // Estado reativo com signals
  darkTheme = signal(true);
  showTyping = signal(false);
  activeSection = signal('home');
  submitting = signal(false);
  submitSuccess = signal(false);

  // Conteúdo
  typingTexts = [
    "Desenvolvedor Full-Stack",
    "Engenheiro de Software",
    "Especialista em Angular",
    "Apaixonado por Tecnologia"
  ];

  experiences = [
    {
      year: '2022-Presente',
      title: 'Desenvolvedor Full-Stack',
      description: 'Desenvolvimento de aplicações web com Angular e Node.js'
    },
    {
      year: '2020-2022',
      title: 'Estagiário em Desenvolvimento',
      description: 'Auxílio no desenvolvimento de sistemas internos com Java Spring'
    }
  ];

  skillCategories = [
    {
      name: 'Front-end',
      skills: [
        { name: 'Angular', icon: 'fab fa-angular', level: 90 },
        { name: 'React', icon: 'fab fa-react', level: 80 },
        { name: 'TypeScript', icon: 'fas fa-code', level: 85 }
      ]
    },
    {
      name: 'Back-end',
      skills: [
        { name: 'Node.js', icon: 'fab fa-node-js', level: 85 },
        { name: 'Java Spring', icon: 'fab fa-java', level: 75 },
        { name: 'REST APIs', icon: 'fas fa-server', level: 80 }
      ]
    }
  ];

  contactForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    message: ['', Validators.required]
  });

  ngOnInit(): void {
    setTimeout(() => this.showTyping.set(true), 1000);
    register(); // Registrar componentes do Swiper
    
    // Verificar tema preferido
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.darkTheme.set(prefersDark);
    this.setTheme();
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    const sections = ['home', 'about', 'projects', 'skills', 'contact'];
    const scrollPosition = window.pageYOffset + 100;
    
    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const { offsetTop, offsetHeight } = element;
        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          this.activeSection.set(section);
          break;
        }
      }
    }
  }

  scrollTo(section: string): void {
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
    this.activeSection.set(section);
  }

  toggleTheme(): void {
    this.darkTheme.update(theme => !theme);
    this.setTheme();
  }

  private setTheme(): void {
    const theme = this.darkTheme() ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  onSubmit(): void {
    if (this.contactForm.invalid) return;
    
    this.submitting.set(true);
    
    // Simular envio (substituir por chamada real)
    setTimeout(() => {
      this.submitting.set(false);
      this.submitSuccess.set(true);
      this.contactForm.reset();
      
      setTimeout(() => this.submitSuccess.set(false), 5000);
    }, 1500);
  }
}