// home.component.ts
import { Component, ElementRef, HostListener, OnInit, ViewChild, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { register } from 'swiper/element/bundle';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './portifolio.component.html',
  styleUrls: ['./portifolio.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
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
  ];
  taglineWords = ['Código', 'Design', 'Inovação'];
@ViewChild('firstName') firstName!: ElementRef;
  @ViewChild('lastName') lastName!: ElementRef;

  animateName() {
    // Efeito de "pulo" no nome
    const firstName = this.firstName.nativeElement;
    const lastName = this.lastName.nativeElement;
    
    firstName.animate([
      { transform: 'translateY(0)' },
      { transform: 'translateY(-10px)' },
      { transform: 'translateY(0)' }
    ], {
      duration: 600,
      easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    });
    
    lastName.animate([
      { transform: 'translateY(0) scale(1)' },
      { transform: 'translateY(-12px) scale(1.05)' },
      { transform: 'translateY(0) scale(1)' }
    ], {
      duration: 600,
      easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      delay: 100
    });
  }
  // Projetos em destaque
  projects = [
    {
      name: 'Juno',
      description: 'Plataforma para gerenciamento remoto de dados integrados com o Thingsboard',
      image: 'assets/images/projects/juno.jpg',
      techs: ['Angular', 'Java Spring', 'PostgreSQL'],
      github: 'https://github.com/seu-usuario/juno',
      live: 'https://juno-app.vercel.app'
    },
    {
      name: 'VRCare Web',
      description: 'Dashboard financeiro com gráficos dinâmicos e autenticação JWT',
      image: 'assets/images/projects/finance.jpg',
      techs: ['React', 'Node.js', 'MongoDB'],
      github: 'https://github.com/seu-usuario/finance-dashboard',
      live: 'https://finance-app.vercel.app'
    },
    {
      name: 'Portfólio',
      description: 'Meu portfólio pessoal, responsivo e animado',
      image: 'assets/images/projects/portfolio.jpg',
      techs: ['Angular', 'SCSS'],
      github: 'https://github.com/seu-usuario/meu-portifolio',
      live: 'https://pedrobicas.com'
    }
  ];

  // Experiências (linha do tempo)
experiences = [
  {
    year: '2024-Atual',
    title: 'Estagiário em Desenvolvimento - INCOR',
    description: 'Desenvolvimento de sistemas para saúde digital e análise de dados médicos'
  },
  {
    year: '2023-Atual',
    title: 'Engenharia de Software',
    description: 'Graduação em andamento com foco em arquitetura de software e qualidade'
  },
  {
    year: '2021-2023',
    title: 'Técnico em Análise e Desenvolvimento de Sistemas',
    description: 'Formação técnica com ênfase em programação e gestão de projetos'
  }
];

  // Habilidades
  skillCategories = [
    {
      name: 'Front-end',
      skills: [
        { name: 'Angular', icon: 'fab fa-angular', level: 90 },
        { name: 'React', icon: 'fab fa-react', level: 80 },
        { name: 'TypeScript', icon: 'fas fa-code', level: 85 },
        { name: 'SCSS', icon: 'fab fa-sass', level: 80 }
      ]
    },
    {
      name: 'Back-end',
      skills: [
        { name: 'Node.js', icon: 'fab fa-node-js', level: 85 },
        { name: 'Java Spring', icon: 'fab fa-java', level: 75 },
        { name: 'REST APIs', icon: 'fas fa-server', level: 80 },
        { name: 'JWT Auth', icon: 'fas fa-key', level: 75 }
      ]
    },
    {
      name: 'Banco de Dados',
      skills: [
        { name: 'PostgreSQL', icon: 'fas fa-database', level: 80 },
        { name: 'MongoDB', icon: 'fas fa-leaf', level: 70 }
      ]
    }
  ];

  contactForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    message: ['', Validators.required]
  });

  // Seções para navegação guiada
  sectionIds = ['home', 'about', 'skills', 'projects', 'contact'];
  private currentSectionIndex = 0;
  private isScrolling = false;
animationState = signal({
    nameRevealed: false,
    titleRevealed: false,
    imageRevealed: false,
    bubblesRevealed: false,
    ctaRevealed: false
  });
  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.checkInitialHash();
    setTimeout(() => this.showTyping.set(true), 1000);
    register(); // Registrar componentes do Swiper
    // Verificar tema preferido
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.darkTheme.set(prefersDark);
    this.setTheme();
    // Adicionar listener para navegação guiada
    window.addEventListener('wheel', this.handleWheel, { passive: false });
    // Impedir scroll padrão do navegador
    document.body.style.overflow = 'hidden';

     setTimeout(() => {
      this.animationState.update(state => ({
  ...state,
  nameRevealed: true
}));
    }, 300);

    setTimeout(() => {
     this.animationState.update(state => ({ ...state, titleRevealed: true }));
    }, 700);

    setTimeout(() => {
     this.animationState.update(state => ({ ...state, imageRevealed: true }));
    }, 800);

    setTimeout(() => {
      this.animationState.update(state => ({ ...state, bubblesRevealed: true }));
    }, 1200);

    setTimeout(() => {
      this.animationState.update(state => ({ ...state, ctaRevealed: true }));
    }, 1500);
  }

  ngOnDestroy(): void {
    window.removeEventListener('wheel', this.handleWheel as any);
    document.body.style.overflow = '';
  }

  // Navegação guiada por scroll

handleWheel = (event: WheelEvent) => {
  if (this.isScrolling) {
    event.preventDefault();
    return;
  }

  const delta = Math.sign(event.deltaY);
  if (delta === 0) return;

  event.preventDefault();
  
  if (delta > 0) {
    this.goToNextSection();
  } else {
    this.goToPrevSection();
  }
};

  goToNextSection() {
    if (this.currentSectionIndex < this.sectionIds.length - 1) {
      this.currentSectionIndex++;
      this.scrollToSectionByIndex();
    }
  }

  goToPrevSection() {
    if (this.currentSectionIndex > 0) {
      this.currentSectionIndex--;
      this.scrollToSectionByIndex();
    }
  }

scrollToSectionByIndex() {
  this.isScrolling = true;
  const sectionId = this.sectionIds[this.currentSectionIndex];
  const element = document.getElementById(sectionId);
  
  if (element) {
    element.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start' // Adicione isso para garantir o alinhamento
    });
    
    this.activeSection.set(sectionId);
    this.updateSectionVisibility();
    
    // Atualize a URL sem recarregar a página
    history.replaceState(null, '', `#${sectionId}`);
  }

  setTimeout(() => {
    this.isScrolling = false;
  }, 1000);
}

  // Atualizar índice ao clicar no menu ou botões
  scrollTo(section: string): void {
    const idx = this.sectionIds.indexOf(section);
    if (idx !== -1) {
      this.currentSectionIndex = idx;
        this.scrollToSectionByIndex();
    }
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
    this.activeSection.set(section);
    this.updateSectionVisibility();
  }
private checkInitialHash() {
  const hash = window.location.hash.substring(1);
  if (hash && this.sectionIds.includes(hash)) {
    const idx = this.sectionIds.indexOf(hash);
    this.currentSectionIndex = idx;
    setTimeout(() => {
      this.scrollToSectionByIndex();
    }, 100);
  }
}
  // Adiciona/Remove classe de animação nas sections
  updateSectionVisibility() {
    this.sectionIds.forEach((id, idx) => {
      const el = document.getElementById(id);
      if (el) {
        if (idx === this.currentSectionIndex) {
          el.classList.add('section-visible');
        } else {
          el.classList.remove('section-visible');
        }
      }
    });
  }

  // Garante animação na primeira section ao iniciar
  ngAfterViewInit(): void {
    setTimeout(() => this.updateSectionVisibility(), 100);
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