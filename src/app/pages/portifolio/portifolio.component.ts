// home.component.ts
import { Component, ElementRef, HostListener, OnInit, OnDestroy, ViewChild, inject, signal, AfterViewInit } from '@angular/core';


import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavigationService } from '../../services/navigation.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { register } from 'swiper/element/bundle';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { SkillsSectionComponent } from './components/skills-section/skills-section.component';
import { ProjectsSectionComponent } from './components/projects-section/projects-section.component';
import { ContactSectionComponent } from './components/contact-section/contact-section.component';
import { ExperienceSectionComponent } from './components/experience-section/experience-section.component';
import { FloatingTerminalComponent } from './components/floating-terminal/floating-terminal.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeroSectionComponent, SkillsSectionComponent, ProjectsSectionComponent, ContactSectionComponent, ExperienceSectionComponent, FloatingTerminalComponent],
  templateUrl: './portifolio.component.html',
  styleUrls: ['./portifolio.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PortifolioComponent implements OnInit, OnDestroy, AfterViewInit {
  private fb = inject(FormBuilder);
  private navigationService = inject(NavigationService);
  private navigationSubscription?: Subscription;
  
  darkTheme = signal(true);
  showTyping = signal(false);
  activeSection = signal('home');
  submitting = signal(false);
  submitSuccess = signal(false);

  typingTexts = [
    "Desenvolvedor Full-Stack",
  ];
  taglineWords = ['Front-end', 'Back-end', 'Banco de Dados'];
  socialLinks = [
    { icon: 'fab fa-github', url: 'https://github.com/pedrobicas', label: 'GitHub' },
    { icon: 'fab fa-linkedin-in', url: 'https://linkedin.com/in/pedrobicas', label: 'LinkedIn' },
    { icon: 'fab fa-instagram', url: 'https://instagram.com/pedrobicas', label: 'Instagram' }
  ];

  // ViewChild references for sections
  @ViewChild('homeSection') homeSection!: ElementRef;
  @ViewChild('skillsSection') skillsSection!: ElementRef;
  @ViewChild('experienceSection') experienceSection!: ElementRef;
  @ViewChild('projectsSection') projectsSection!: ElementRef;
  @ViewChild('contactSection') contactSection!: ElementRef;

  @ViewChild('firstName') firstName!: ElementRef;
  @ViewChild('lastName') lastName!: ElementRef;

  // Intersection Observer for scroll animations
  private intersectionObserver!: IntersectionObserver;
  private animatedSections = new Set<string>();

  // Animation states for each section
  sectionAnimations = signal({
    home: { visible: false, animated: false },
    skills: { visible: false, animated: false },
    experience: { visible: false, animated: false },
    projects: { visible: false, animated: false },
    contact: { visible: false, animated: false }
  });

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
      name: 'Crypto Analysis',
      description: 'Plataforma de análise técnica e previsão de criptomoedas com indicadores avançados, simulação de investimentos e análise de risco. Interface moderna em Streamlit, modelos SARIMAX e integração com CoinGecko.',
      techs: ['Python', 'Streamlit', 'Pandas', 'Plotly', 'CoinGecko API'],
      github: 'https://github.com/pedrobicas/crypto-plataform',
      live: 'https://crypto-plataform.streamlit.app/'
    },
    {
      name: 'Chat em tempo real Frontend',
      description: 'Frontend Angular para chat em tempo real, com tema claro/escuro, notificações, lista de usuários online, chat público e privado via WebSocket (STOMP) integrado ao backend Java.',
      techs: ['Angular', 'TypeScript', 'SCSS', 'RxJS', 'SockJS', 'STOMP.js'],
      github: 'https://github.com/pedrobicas/web-realtime-chat',
      live: ''
    },
    {
      name: 'Chat em tempo real Backend',
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
    },
    {
      name: 'My Spotify Universe',
      description: 'Um projeto completo que integra com a API do Spotify, permitindo autenticação OAuth2 e acesso aos dados do usuário.',
      techs: ['React', 'Node', 'JavaScript'],
      github: 'https://github.com/pedrobicas/spotify-project',
      live: 'https://my-universe-spotify.vercel.app/dashboard'
    }
  ];

experiences = [
  {
    year: '2024-Atual',
    title: 'Bolsista em Desenvolvimento - INCOR (Instituto do Coração)',
    description: 'Desenvolvimento de sistemas e aplicações para pesquisa no Hospital das Clínicas da FMUSP.',
    type: 'Trabalho',
    details: [
      'Desenvolvimento de aplicações web',
      'Implementação de APIs RESTful para integração entre sistemas',
      'Criação de dashboards interativos para visualização de dados clínicos',
      'Implementação de práticas de DevOps e integração contínua',
      'Colaboração com equipes para desenvolvimento de soluções tecnológicas'
    ],
    technologies: ['Python', 'Django', 'React', 'TypeScript', 'PostgreSQL', 'Docker', 'Git', 'Linux', 'REST APIs']
  },
  {
    year: '2023-2026',
    title: 'Bacharelado em Engenharia de Software - FIAP',
    description: 'Graduação em andamento com foco em arquitetura de software, qualidade de código, desenvolvimento de sistemas escaláveis e tecnologias emergentes. Formação voltada para o mercado de trabalho com projetos práticos.',
    type: 'Formação',
    details: [
      'Arquitetura de software e padrões de projeto (MVC, Repository, Factory, Observer)',
      'Metodologias ágeis (Scrum, Kanban) e práticas de DevOps e CI/CD',
      'Desenvolvimento de aplicações enterprise com Spring Boot e microserviços',
      'Inteligência artificial, machine learning e análise de dados aplicados a negócios',
      'Gestão de projetos de software e liderança técnica de equipes',
      'Qualidade de software, testes automatizados (unitários, integração, E2E)'
    ],
    technologies: ['Java', 'Spring Boot', 'Angular', 'Python', 'Docker', 'Oracle', 'Maven', 'JUnit', 'AWS', 'Kubernetes']
  },
  {
    year: '2021-2023',
    title: 'Técnico em Análise e Desenvolvimento de Sistemas - SENAI',
    description: 'Formação técnica completa com ênfase em programação, gestão de projetos e desenvolvimento de soluções tecnológicas. Base sólida em fundamentos da computação e desenvolvimento web.',
    type: 'Formação',
    details: [
      'Desenvolvimento full-stack com foco em tecnologias web modernas e responsivas',
      'Fundamentos sólidos de programação orientada a objetos e estruturas de dados',
      'Modelagem, administração e otimização de bancos de dados relacionais',
      'Gestão de projetos de software usando metodologias ágeis e tradicionais',
      'Desenvolvimento de sistemas desktop (Java Swing) e web responsivos',
      'Versionamento de código com Git e trabalho colaborativo em equipe',
      'UX/UI Design e prototipagem de interfaces com Figma'
    ],
    technologies: ['JavaScript', 'Node.js', 'React', 'MySQL', 'HTML5', 'CSS3', 'Bootstrap', 'Git', 'Figma', 'Java']
  }
];

skillCategories = [
  {
    name: 'Front-end',
    skills: [
      { name: 'Angular', icon: 'fab fa-angular' },
      { name: 'React', icon: 'fab fa-react' },
      { name: 'TypeScript', icon: 'devicon-typescript-plain' },
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
      { name: 'Python', icon: 'fab fa-python' }
    ]
  },
  {
    name: 'Banco de Dados',
    skills: [
      { name: 'PostgreSQL', icon: 'devicon-postgresql-plain' },
      { name: 'MySQL', icon: 'devicon-mysql-plain' },
      { name: 'MongoDB', icon: 'fas fa-database' }
    ]
  },
  {
    name: 'Outros',
    skills: [
      { name: 'Docker', icon: 'fab fa-docker' },
      { name: 'Git', icon: 'fab fa-git-alt' },
      { name: 'Linux', icon: 'fab fa-linux' }
    ]
  }
];

  contactForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required, Validators.minLength(5)]],
    projectType: ['', Validators.required],
    message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
  });

  // Estados do formulário de contato
  submitError = signal('');
  isSubmittingForm = false;

  // Seções para navegação guiada
  sectionIds = ['home', 'skills', 'experience', 'projects', 'contact'];
  private currentSectionIndex = 0;
  private isScrolling = false;
  isMobile = false;
  
  // Sistema dinâmico e interativo
  visitedSections = new Set<string>(['home']);
  particlesEnabled = true;
  sessionStartTime = Date.now();
  
  // Sistema minimalista
  hoveredNavItem = -1;
  private sectionTransitions: { [key: string]: 'entering' | 'leaving' | null } = {};
  
  // Ultra minimal navigation
  showSectionInfo = false;
  
  // Sistema de partículas
  @ViewChild('particlesCanvas', { static: false }) particlesCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('particlesContainer', { static: false }) particlesContainer!: ElementRef;
  private particlesCtx!: CanvasRenderingContext2D;
  private particles: any[] = [];
  private animationFrame!: number;
  

  



  
  // Métodos para navegação criativa
  getCurrentSectionIndex(): number {
    return this.sectionIds.indexOf(this.activeSection());
  }
  
  getCurrentSectionName(): string {
    const currentId = this.activeSection();
    return this.getSectionDisplayName(currentId);
  }
  
  getProgressOffset(): string {
    const currentIndex = this.getCurrentSectionIndex();
    const totalSections = this.sectionIds.length;
    const progress = (currentIndex / (totalSections - 1)) * 100;
    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (progress / 100) * circumference;
    return offset.toString();
  }
  
  getSectionIcon(sectionId: string): string {
    const icons: { [key: string]: string } = {
      'home': 'fas fa-home',
      'about': 'fas fa-user',
      'experience': 'fas fa-briefcase',
      'skills': 'fas fa-code',
      'projects': 'fas fa-rocket',
      'contact': 'fas fa-envelope'
    };
    return icons[sectionId] || 'fas fa-circle';
  }
  
  getSectionDisplayName(sectionId: string): string {
    const names: { [key: string]: string } = {
      'home': 'Início',
      'about': 'Sobre',
      'experience': 'Experiência',
      'skills': 'Skills',
      'projects': 'Projetos',
      'contact': 'Contato'
    };
    return names[sectionId] || sectionId;
  }
  
  // Métodos de navegação
  previousSection(): void {
    const currentIndex = this.getCurrentSectionIndex();
    if (currentIndex > 0) {
      const previousSection = this.sectionIds[currentIndex - 1];
      this.scrollTo(previousSection);
    }
  }
  
  nextSection(): void {
    const currentIndex = this.getCurrentSectionIndex();
    if (currentIndex < this.sectionIds.length - 1) {
      const nextSection = this.sectionIds[currentIndex + 1];
      this.scrollTo(nextSection);
    }
  }
  
  // Constante para Math.PI
  readonly PI = Math.PI;
animationState = signal({
    nameRevealed: false,
    titleRevealed: false,
    imageRevealed: false,
    bubblesRevealed: false,
    ctaRevealed: false
  });
  aboutText = `Sou Pedro Bicas, estudante de Engenharia de Software na FIAP e técnico em Desenvolvimento de Sistemas pelo SENAI.<br><br>Atuo no desenvolvimento de fullstack com linguagens como TypeScript/JavaScript para interfaces (Angular, React), Java com Spring Boot, NodeJs para o backend, Python para automações e SQL para bancos relacionais.`;

  ngOnInit(): void {
    this.detectMobileDevice();
    window.scrollTo(0, 0);
    this.checkInitialHash();
    setTimeout(() => this.showTyping.set(true), 1000);
    register(); 
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.darkTheme.set(prefersDark);
    this.setTheme();
    
    // Inicializa sistema dinâmico
    this.initializeParticleSystem();
    this.setupScrollAnimations();
    
    // Navegação livre com scroll normal para todas as plataformas
    document.body.style.overflow = 'auto';
    this.enableMobileFreeNavigation();
    
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
    
    // Subscrever aos eventos de navegação do terminal
    this.navigationSubscription = this.navigationService.navigation$.subscribe(sectionId => {
      this.scrollTo(sectionId);
    });
  }
  
  private detectMobileDevice() {
    this.isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
    
    // Limpar inscrição do serviço de navegação
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    this.stopParticleAnimation();
  }

  private setupScrollAnimations(): void {
    // Remove wheel event listener for guided navigation
    // Enable natural scroll behavior
    document.body.style.overflow = 'auto';
  }

  private setupIntersectionObserver(): void {
    const options = {
      root: null,
      rootMargin: '-10% 0px -10% 0px', // Reduzido de -20% para -10% para começar animações mais cedo
      threshold: 0.2 // Reduzido de 0.3 para 0.2 para detectar seções mais cedo
    };

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const sectionId = entry.target.id;
        const isVisible = entry.isIntersecting;
        
        // Update active section
        if (isVisible) {
          this.activeSection.set(sectionId);
        }

        // Update animation state
        const currentAnimations = this.sectionAnimations();
        if (sectionId in currentAnimations) {
          currentAnimations[sectionId as keyof typeof currentAnimations].visible = isVisible;
          
          // Trigger animation only once when section becomes visible
          if (isVisible && !this.animatedSections.has(sectionId)) {
            this.animatedSections.add(sectionId);
            currentAnimations[sectionId as keyof typeof currentAnimations].animated = true;
            this.triggerSectionAnimation(sectionId);
          }
          
          this.sectionAnimations.set({...currentAnimations});
        }
      });
    }, options);

    // Observe all sections
    const sections = [
      this.homeSection,
      this.skillsSection,
      this.experienceSection,
      this.projectsSection,
      this.contactSection
    ];

    sections.forEach(section => {
      if (section?.nativeElement) {
        this.intersectionObserver.observe(section.nativeElement);
      }
    });
  }

  private triggerSectionAnimation(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (!element) return;

    // Add specific animation class based on section
    switch (sectionId) {
      case 'home':
        element.classList.add('animate-hero');
        break;
      case 'skills':
        element.classList.add('animate-skills');
        break;
      case 'experience':
        element.classList.add('animate-experience');
        break;
      case 'projects':
        element.classList.add('animate-projects');
        break;
      case 'contact':
        element.classList.add('animate-contact');
        break;
    }
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  // Método removido - navegação agora é livre com scroll normal

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
    const previousSectionId = this.activeSection();
    
    // Marca transições
    if (previousSectionId) {
      this.sectionTransitions[previousSectionId] = 'leaving';
    }
    this.sectionTransitions[sectionId] = 'entering';
    
    // Remove classe active de todas as seções
    this.sectionIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.classList.remove('active');
      }
    });
    
    // Adiciona classe active à seção atual
    const currentElement = document.getElementById(sectionId);
    if (currentElement) {
      setTimeout(() => {
        currentElement.classList.add('active');
      }, 100);
    }
    
    this.activeSection.set(sectionId);
    this.visitedSections.add(sectionId);
    history.replaceState(null, '', `#${sectionId}`);

    setTimeout(() => {
      this.isScrolling = false;
      // Limpa transições
      this.sectionTransitions = {};
    }, 800);
  }

  scrollTo(section: string): void {
    const idx = this.sectionIds.indexOf(section);
    if (idx !== -1) {
      this.currentSectionIndex = idx;
      this.activeSection.set(section);
      this.scrollToSectionByIndex();
    }
  }
private checkInitialHash() {
  const hash = window.location.hash.substring(1);
  if (hash && this.sectionIds.includes(hash)) {
    const idx = this.sectionIds.indexOf(hash);
    this.currentSectionIndex = idx;
    this.activeSection.set(hash);
    setTimeout(() => {
      this.scrollToSectionByIndex();
    }, 300);
  } else {
    // Se não há hash, mostra a primeira seção
    setTimeout(() => {
      this.updateSectionVisibility();
    }, 500);
  }
}
  updateSectionVisibility() {
    this.sectionIds.forEach((id, idx) => {
      const el = document.getElementById(id);
      if (el) {
        if (idx === this.currentSectionIndex) {
          setTimeout(() => {
            el.classList.add('active');
          }, 100);
        } else {
          el.classList.remove('active');
        }
      }
    });
  }

  // Novo método para navegar diretamente para uma seção
  goToSection(index: number): void {
    if (index >= 0 && index < this.sectionIds.length && index !== this.currentSectionIndex) {
      this.currentSectionIndex = index;
      this.scrollToSectionByIndex();
    }
  }

  ngAfterViewInit(): void {
    this.setupIntersectionObserver();
    
    setTimeout(() => {
      this.updateSectionVisibility();
      // Garante que a primeira seção seja ativa no início
      if (this.currentSectionIndex === 0) {
        const firstElement = document.getElementById(this.sectionIds[0]);
        if (firstElement) {
          firstElement.classList.add('active');
        }
      }
    }, 200);
    
    // Initialize particles after view is ready
    setTimeout(() => {
      if (this.particlesCanvas && this.particlesContainer) {
        this.initializeParticleSystem();
      }
    }, 100);
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
    if (this.contactForm.valid && !this.isSubmittingForm) {
      this.isSubmittingForm = true;
      this.submitting.set(true);
      this.submitSuccess.set(false);
      this.submitError.set('');

      const formData = this.contactForm.value;
      
      // Simular envio do formulário (aqui você integraria com um serviço real)
      setTimeout(() => {
        try {
          // Simular sucesso (90% das vezes)
          if (Math.random() > 0.1) {
            this.submitSuccess.set(true);
            this.contactForm.reset();
            console.log('Formulário enviado com sucesso:', formData);
          } else {
            // Simular erro
            throw new Error('Erro simulado no envio');
          }
        } catch (error) {
          this.submitError.set('Ocorreu um erro ao enviar sua mensagem. Tente novamente.');
          console.error('Erro ao enviar formulário:', error);
        } finally {
          this.isSubmittingForm = false;
          this.submitting.set(false);
          
          // Limpar mensagens após 5 segundos
          setTimeout(() => {
            this.submitSuccess.set(false);
            this.submitError.set('');
          }, 5000);
        }
      }, 2000); // Simular delay de rede
    } else {
      // Marcar todos os campos como touched para mostrar erros
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key)?.markAsTouched();
      });
    }
  }

  // Método para ser chamado pelo componente filho
  onContactFormSubmit = (formData: any): void => {
    if (!this.isSubmittingForm) {
      this.isSubmittingForm = true;
      this.submitting.set(true);
      this.submitSuccess.set(false);
      this.submitError.set('');

      // Simular envio do formulário
      setTimeout(() => {
        try {
          // Simular sucesso (90% das vezes)
          if (Math.random() > 0.1) {
            this.submitSuccess.set(true);
            console.log('Formulário enviado com sucesso:', formData);
          } else {
            throw new Error('Erro simulado no envio');
          }
        } catch (error) {
          this.submitError.set('Ocorreu um erro ao enviar sua mensagem. Tente novamente.');
          console.error('Erro ao enviar formulário:', error);
        } finally {
          this.isSubmittingForm = false;
          this.submitting.set(false);
          
          // Limpar mensagens após 5 segundos
          setTimeout(() => {
            this.submitSuccess.set(false);
            this.submitError.set('');
          }, 5000);
        }
      }, 2000);
    }
  };

  get activeSectionIndex(): number {
    return this.sectionIds.indexOf(this.activeSection());
  }

  getProgressWidth(): string {
    const total = Math.max(1, this.sectionIds.length - 1);
    const pct = (this.getCurrentSectionIndex() / total) * 100;
    return pct + '%';
  }
  getDotLeft(i: number): string {
    const total = Math.max(1, this.sectionIds.length - 1);
    const pct = (i / total) * 100;
    return pct + '%';
  }







  navigateToSection(index: number): void {
    this.goToSection(index);
    this.visitedSections.add(this.sectionIds[index]);
  }

  onNavItemHover(index: number, isHovering: boolean): void {
    this.hoveredNavItem = isHovering ? index : -1;
  }

  getProgressHeight(): number {
    return ((this.getCurrentSectionIndex() + 1) / this.sectionIds.length) * 100;
  }

  isEntering(sectionId: string): boolean {
    return this.sectionTransitions[sectionId] === 'entering';
  }

  isLeaving(sectionId: string): boolean {
    return this.sectionTransitions[sectionId] === 'leaving';
  }

  toggleSectionInfo(show: boolean): void {
    this.showSectionInfo = show;
  }

  enableMobileFreeNavigation(): void {
    // Remove restrições de navegação guiada para mobile
    const sectionsContainer = document.querySelector('.sections-container') as HTMLElement;
    if (sectionsContainer) {
      sectionsContainer.style.height = 'auto';
      sectionsContainer.style.overflow = 'visible';
    }

    // Torna todas as seções visíveis no mobile
    this.sectionIds.forEach(sectionId => {
      const sectionElement = document.getElementById(sectionId);
      if (sectionElement) {
        sectionElement.style.position = 'static';
        sectionElement.style.opacity = '1';
        sectionElement.style.transform = 'none';
        sectionElement.style.pointerEvents = 'auto';
        sectionElement.style.height = 'auto';
        sectionElement.style.minHeight = '100vh';
      }
    });

    // Adiciona scroll spy para mobile
    this.addMobileScrollSpy();
  }

  addMobileScrollSpy(): void {
    if (this.isMobile) {
      window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        
        this.sectionIds.forEach(sectionId => {
          const element = document.getElementById(sectionId);
          if (element) {
            const offsetTop = element.offsetTop;
            const offsetBottom = offsetTop + element.offsetHeight;
            
            if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
              this.activeSection.set(sectionId);
              this.visitedSections.add(sectionId);
            }
          }
        });
      });
    }
  }

  isVisited(sectionId: string): boolean {
    return this.visitedSections.has(sectionId);
  }

  getProgressPercentage(): number {
    return Math.round(((this.getCurrentSectionIndex() + 1) / this.sectionIds.length) * 100);
  }

  getVisitedCount(): number {
    return this.visitedSections.size;
  }

  getSessionTime(): string {
    const elapsed = Math.floor((Date.now() - this.sessionStartTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  toggleParticles(): void {
    this.particlesEnabled = !this.particlesEnabled;
    if (this.particlesEnabled) {
      this.startParticleAnimation();
    } else {
      this.stopParticleAnimation();
    }
  }



  resetView(): void {
    this.goToSection(0);
  }



  // Método para verificar se o elemento está dentro do terminal
  private isElementInsideTerminal(element: HTMLElement): boolean {
    // Verifica se o elemento ou algum de seus pais tem classes relacionadas ao terminal
    let currentElement: HTMLElement | null = element;
    
    while (currentElement) {
      // Verifica classes específicas do terminal
      if (currentElement.classList.contains('floating-terminal') ||
          currentElement.classList.contains('terminal-body') ||
          currentElement.classList.contains('console-output') ||
          currentElement.classList.contains('floating-terminal-overlay')) {
        return true;
      }
      
      // Verifica se é o componente app-floating-terminal
      if (currentElement.tagName === 'APP-FLOATING-TERMINAL') {
        return true;
      }
      
      currentElement = currentElement.parentElement;
    }
    
    return false;
  }



  // Sistema de partículas
  private initializeParticleSystem(): void {
    if (this.particlesCanvas) {
      this.particlesCtx = this.particlesCanvas.nativeElement.getContext('2d')!;
      this.createParticles();
      this.startParticleAnimation();
    }
  }

  private createParticles(): void {
    const canvas = this.particlesCanvas.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    for (let i = 0; i < 50; i++) {
      this.particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.2
      });
    }
  }

  private startParticleAnimation(): void {
    const animate = () => {
      if (!this.particlesEnabled) return;
      
      this.updateParticles();
      this.drawParticles();
      this.animationFrame = requestAnimationFrame(animate);
    };
    animate();
  }

  private stopParticleAnimation(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  private updateParticles(): void {
    if (!this.particlesCanvas) return;

    const canvas = this.particlesCanvas.nativeElement;

    this.particles.forEach((particle: any) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;
    });
  }

  private drawParticles(): void {
    if (!this.particlesCtx || !this.particlesCanvas) return;
    
    const ctx = this.particlesCtx;
    const canvas = this.particlesCanvas.nativeElement;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.particles.forEach((particle: any) => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(44, 131, 212, ${particle.opacity})`;
      ctx.fill();
    });
  }
}