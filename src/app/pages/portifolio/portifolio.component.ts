// home.component.ts
import { Component, ElementRef, HostListener, OnInit, ViewChild, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { register } from 'swiper/element/bundle';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { AboutSectionComponent } from './components/about-section/about-section.component';
import { SkillsSectionComponent } from './components/skills-section/skills-section.component';
import { ProjectsSectionComponent } from './components/projects-section/projects-section.component';
import { ContactSectionComponent } from './components/contact-section/contact-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeroSectionComponent, AboutSectionComponent, SkillsSectionComponent, ProjectsSectionComponent, ContactSectionComponent],
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
  socialLinks = [
    { icon: 'fab fa-github', url: 'https://github.com/pedrobicas', label: 'GitHub' },
    { icon: 'fab fa-linkedin-in', url: 'https://linkedin.com/in/pedrobicas', label: 'LinkedIn' },
    { icon: 'fab fa-instagram', url: 'https://instagram.com/pedrobicas', label: 'Instagram' }
  ];
@ViewChild('firstName') firstName!: ElementRef;
  @ViewChild('lastName') lastName!: ElementRef;

  animateName() {
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
      name: 'Crypto Analysis & Forecast Platform',
      description: 'Plataforma de análise técnica e previsão de criptomoedas com indicadores avançados, simulação de investimentos e análise de risco. Interface moderna em Streamlit, modelos SARIMAX e integração com CoinGecko.',
      techs: ['Python', 'Streamlit', 'Pandas', 'Plotly', 'CoinGecko API'],
      github: 'https://github.com/pedrobicas/crypto-plataform',
      live: 'https://crypto-plataform.streamlit.app/'
    },
    {
      name: 'Web Real Time Chat',
      description: 'Frontend Angular para chat em tempo real, com tema claro/escuro, notificações, lista de usuários online, chat público e privado via WebSocket (STOMP) integrado ao backend Java.',
      techs: ['Angular', 'TypeScript', 'SCSS', 'RxJS', 'SockJS', 'STOMP.js'],
      github: 'https://github.com/pedrobicas/web-realtime-chat',
      live: ''
    },
    {
      name: 'Java Real Time Chat',
      description: 'Backend em Java Spring Boot para chat em tempo real, com WebSocket (STOMP), chat público e privado, notificações, controle de usuários online e integração REST.',
      techs: ['Java', 'Spring Boot', 'WebSocket', 'STOMP', 'Maven'],
      github: 'https://github.com/pedrobicas/java-realtime-chat',
      live: ''
    },
    {
      name: 'Portfólio',
      description: 'Meu portfólio pessoal, responsivo e animado',
      techs: ['Angular', 'SCSS'],
      github: 'https://github.com/seu-usuario/meu-portifolio',
      live: 'https://pedrobicas.com'
    }
  ];

experiences = [
  {
    year: '2024-Atual',
    title: 'Bolsista em Desenvolvimento - INCOR',
    description: 'Desenvolvimento de sistemas'
  },
  {
    year: '2023-2026',
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
  // No seu componente, atualize a estrutura de skillCategories para:
skillCategories = [
  {
    name: 'Front-end',
    skills: [
      { name: 'Angular', icon: 'fab fa-angular' },
      { name: 'React', icon: 'fab fa-react' },
      { name: 'TypeScript', icon: 'devicon-typescript-plain colored' },
      { name: 'JavaScript', icon: 'fab fa-js' },
      { name: 'HTML5', icon: 'fab fa-html5' },
      { name: 'CSS3', icon: 'fab fa-css3-alt' },
      { name: 'Sass', icon: 'fab fa-sass' }
    ]
  },
  {
    name: 'Back-end',
    skills: [
      { name: 'Node.js', icon: 'fab fa-node-js' },
      { name: 'Java', icon: 'fab fa-java' },
      { name: 'Spring Boot', icon: 'fas fa-leaf' },
      { name: 'Python', icon: 'fab fa-python' },
      { name: 'Express', icon: 'fas fa-server' }
    ]
  },
  {
    name: 'Banco de Dados & DevOps',
    skills: [
      { name: 'PostgreSQL', icon: 'devicon-postgresql-plain colored' },
      { name: 'MySQL', icon: 'devicon-mysql-plain colored' },
      { name: 'MongoDB', icon: 'fas fa-database' },
      { name: 'Docker', icon: 'fab fa-docker' },
      { name: 'Git', icon: 'fab fa-git-alt' },
      { name: 'Linux', icon: 'fab fa-linux' }
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
  aboutText = `Sou Pedro Bicas, estudante de Engenharia de Software na FIAP e técnico em Desenvolvimento de Sistemas pelo SENAI.<br><br>Atuo no desenvolvimento de software com linguagens modernas como TypeScript/JavaScript para interfaces dinâmicas (Angular, React), Java com Spring Boot para APIs robustas, Python para automações e SQL para bancos relacionais.`;
  techHighlights = [
    'JavaScript  / TypeScript',
    'Angular e React',
    'JavaSpringBoot e NodeJs',
    'PostgreSQL, MySQL e SQL',
    'Docker, Git e Linux'
  ];

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
      this.activeSection.set(section);
      this.updateSectionVisibility();
    }
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

  get activeSectionIndex(): number {
    return this.sectionIds.indexOf(this.activeSection());
  }
}