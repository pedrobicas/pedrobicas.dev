import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DOCUMENT } from '@angular/common';
import { NavigationService } from '../../../../services/navigation.service';

@Component({
  selector: 'app-floating-terminal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './floating-terminal.component.html',
  styleUrls: ['./floating-terminal.component.scss']
})
export class FloatingTerminalComponent implements OnInit, OnDestroy {
  @ViewChild('consoleOutput') consoleOutput!: ElementRef;
  @ViewChild('terminalContainer') terminalContainer!: ElementRef;

  constructor(
    private cdr: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document,
    private navigationService: NavigationService
  ) {}

  // Terminal state
  isTerminalOpen: boolean = false;
  isMinimized: boolean = false;
  isFullscreen: boolean = false;
  currentCommand: string = '';
  isProcessing: boolean = false;
  showWelcome: boolean = false;
  
  // Enhanced UI state
  buttonExpanded: boolean = false;
  hasNotification: boolean = true;
  showTutorial: boolean = false;
  tutorialStep: number = 1;
  showSuggestions: boolean = false;
  showCommandHints: boolean = true;
  commandSuggestions: CommandSuggestion[] = [];
  
  // First time user experience
  isFirstTime: boolean = true;
  
  // Interactive modes
  currentMode: 'terminal' | 'portfolio' | 'skills' | 'contact' = 'terminal';
  
  // Terminal data
  outputLines: OutputLine[] = [];
  commandHistory: string[] = [];
  historyIndex: number = -1;
  
  // Drag functionality
  isDragging: boolean = false;
  dragStartX: number = 0;
  dragStartY: number = 0;
  terminalX: number = 100;
  terminalY: number = 100;
  
  // Animation states
  isEntering: boolean = false;
  isExiting: boolean = false;
  
  // Pedro's information
  personalInfo = {
    name: 'Pedro Bicas',
    role: 'Desenvolvedor Full-Stack',
    education: {
      current: 'Engenharia de Software (cursando) – FIAP',
      completed: 'Técnico em Análise e Desenvolvimento de Sistemas – SENAI'
    },
    experience: 'Bolsista no InCor (Instituto do Coração)',
    skills: {
      frontend: ['Angular', 'React Native'],
      backend: ['Java', 'Spring Boot'],
      database: ['SQL', 'H2'],
      others: ['Docker', 'CI/CD', 'GitHub Actions', 'API REST/SOAP']
    },
    interests: [
      'Jogos (principalmente Minecraft)',
      'Música',
      'Café',
      'Explorar novas tecnologias'
    ],
    future: [
      'Me especializar em Arquitetura de Sistemas',
      'Aprimorar conhecimentos em Inteligência Artificial'
    ],
    contact: {
      email: 'pedro.bicas@example.com',
      linkedin: 'linkedin.com/in/pedrobicas'
    }
  };

  // ASCII Art for different modes
  asciiLogos = {
    terminal: `
   ╔══════════════════════════════════════╗
   ║          PEDRO TERMINAL v3.0         ║
   ║        Floating Interactive Mode     ║
   ╚══════════════════════════════════════╝`,
    portfolio: `
   ╔══════════════════════════════════════╗
   ║           PORTFOLIO MODE             ║
   ║        Interactive Showcase          ║
   ╚══════════════════════════════════════╝`,
    skills: `
   ╔══════════════════════════════════════╗
   ║            SKILLS MODE               ║
   ║         Technical Arsenal            ║
   ╚══════════════════════════════════════╝`,
    contact: `
   ╔══════════════════════════════════════╗
   ║           CONTACT MODE               ║
   ║         Let's Connect!               ║
   ╚══════════════════════════════════════╝`
  };

  ngOnInit(): void {
    this.setupKeyListeners();
    this.setupMouseListeners();
    this.checkFirstTimeUser();
    this.initializeCommandSuggestions();
  }

  ngOnDestroy(): void {
    // Cleanup listeners
  }

  // Terminal activation
  toggleTerminal(): void {
    if (this.isTerminalOpen) {
      this.closeTerminal();
    } else {
      this.openTerminal();
    }
  }

  openTerminal(): void {
    this.isTerminalOpen = true;
    this.isEntering = true;
    this.hasNotification = false;
    
    if (this.isFirstTime) {
      this.showTutorial = true;
      this.isFirstTime = false;
      localStorage.setItem('pedro-terminal-visited', 'true');
    } else {
      this.showWelcome = true;
      setTimeout(() => {
        this.isEntering = false;
        this.initializeTerminal();
      }, 800);

      setTimeout(() => {
        this.showWelcome = false;
        this.showInitialPrompt();
      }, 3000);
    }
  }

  closeTerminal(): void {
    this.isExiting = true;
    setTimeout(() => {
      this.isTerminalOpen = false;
      this.isExiting = false;
      this.outputLines = [];
      this.currentCommand = '';
    }, 500);
  }

  // Terminal modes
  switchMode(mode: 'terminal' | 'portfolio' | 'skills' | 'contact'): void {
    this.currentMode = mode;
    this.outputLines = [];
    this.addOutput('system', `Modo alterado para: ${mode.toUpperCase()}`);
    this.initializeModeContent();
  }

  initializeModeContent(): void {
    switch (this.currentMode) {
      case 'portfolio':
        this.addOutput('info', 'Modo Portfolio ativo - Navegue pelos projetos interativamente');
        this.addOutput('list', 'Comandos: projects, experience, education');
        break;
      case 'skills':
        this.addOutput('info', 'Modo Skills ativo - Explore as tecnologias');
        this.addOutput('list', 'Comandos: frontend, backend, database, tools');
        break;
      case 'contact':
        this.addOutput('info', 'Modo Contato ativo - Vamos nos conectar!');
        this.addOutput('list', 'Comandos: email, linkedin, github, social');
        break;
      default:
        this.addOutput('info', 'Modo Terminal padrão ativo');
        this.addOutput('list', 'Digite "help" para ver todos os comandos');
    }
  }

  // Window controls
  minimizeTerminal(): void {
    this.isMinimized = !this.isMinimized;
  }

  toggleFullscreen(): void {
    this.isFullscreen = !this.isFullscreen;
  }

  // Drag functionality
  startDrag(event: MouseEvent): void {
    if (this.isFullscreen) return;
    
    this.isDragging = true;
    this.dragStartX = event.clientX - this.terminalX;
    this.dragStartY = event.clientY - this.terminalY;
    
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('mouseup', this.onMouseUp.bind(this));
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging) return;
    
    this.terminalX = event.clientX - this.dragStartX;
    this.terminalY = event.clientY - this.dragStartY;
    
    // Keep terminal within viewport
    const maxX = window.innerWidth - 600;
    const maxY = window.innerHeight - 400;
    
    this.terminalX = Math.max(0, Math.min(this.terminalX, maxX));
    this.terminalY = Math.max(0, Math.min(this.terminalY, maxY));
  }

  onMouseUp(): void {
    this.isDragging = false;
    document.removeEventListener('mousemove', this.onMouseMove.bind(this));
    document.removeEventListener('mouseup', this.onMouseUp.bind(this));
  }

  // Keyboard handling
  setupKeyListeners(): void {
    document.addEventListener('keydown', (event) => {
      if (this.isTerminalOpen && !this.isMinimized) {
        this.handleKeydown(event);
      }
      
      // Global shortcuts
      if (event.ctrlKey && event.key === '`') {
        event.preventDefault();
        this.toggleTerminal();
      }
    });
  }

  setupMouseListeners(): void {
    // Setup mouse listeners for drag functionality
  }

  handleKeydown(event: KeyboardEvent): void {
    if (this.isProcessing) return;

    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        this.executeCommand();
        break;
      case 'Backspace':
        event.preventDefault();
        this.currentCommand = this.currentCommand.slice(0, -1);
        this.updateCommandDisplay();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.navigateHistory(-1);
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.navigateHistory(1);
        break;
      case 'Tab':
        event.preventDefault();
        this.autoComplete();
        break;
      case 'Escape':
        event.preventDefault();
        if (this.isFullscreen) {
          this.toggleFullscreen();
        } else {
          this.closeTerminal();
        }
        break;
      default:
        if (event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
          event.preventDefault();
          this.currentCommand += event.key;
          this.updateCommandDisplay();
        }
        break;
    }
  }

  // Command execution
  executeCommand(): void {
    const command = this.currentCommand.trim().toLowerCase();
    
    if (!command) {
      this.showPrompt();
      return;
    }

    // Add command to history and output
    this.commandHistory.unshift(command);
    this.addOutput('command', this.currentCommand);
    this.currentCommand = '';
    
    // Process command
    this.isProcessing = true;
    setTimeout(() => {
      this.processCommand(command);
      this.isProcessing = false;
      this.showPrompt();
    }, 300);
  }

  processCommand(command: string): void {
    const args = command.split(' ');
    const cmd = args[0];

    switch (cmd) {
      case 'help':
        this.showHelp();
        break;
      case 'whoami':
        this.executeWhoami();
        break;
      case 'skills':
        this.executeSkills();
        break;
      case 'mode':
        if (args[1]) {
          this.switchMode(args[1] as any);
        } else {
          this.addOutput('info', 'Modos disponíveis: terminal, portfolio, skills, contact');
        }
        break;
      case 'clear':
        this.outputLines = [];
        break;
      case 'minimize':
        this.minimizeTerminal();
        break;
      case 'fullscreen':
        this.toggleFullscreen();
        break;
      case 'theme':
        this.cycleTheme();
        break;
      case 'journey':
        this.executeJourney();
        break;
      case 'interests':
        this.executeInterests();
        break;
      case 'future':
        this.executeFuture();
        break;
      case 'contact':
        this.executeContact();
        break;
      case 'projects':
        this.executeProjects();
        break;
      case 'frontend':
        this.executeFrontend();
        break;
      case 'backend':
        this.executeBackend();
        break;
      case 'database':
        this.executeDatabase();
        break;
      case 'tools':
        this.executeTools();
        break;
      case 'coffee':
        this.executeCoffee();
        break;
      case 'sudo':
        if (args[1] === 'hire-me') {
          this.executeHireMe();
        } else {
          this.addOutput('error', 'Acesso negado. Tente "sudo hire-me"');
        }
        break;
      case 'exit':
        this.closeTerminal();
        break;
      case 'cd':
        if (args[1]) {
          this.executeNavigation(args[1]);
        } else {
          this.addOutput('error', 'Uso: cd <secao>. Seções disponíveis: skills, projects, experience, contact, home');
        }
        break;
      default:
        this.addOutput('error', `Comando não encontrado: ${cmd}. Digite 'help' para ver comandos disponíveis.`);
        this.suggestSimilarCommand(cmd);
    }
  }

  // Command implementations
  showHelp(): void {
    this.addOutput('info', 'COMANDOS DISPONÍVEIS:');
    this.addOutput('info', '═══ INFORMAÇÕES PESSOAIS ═══');
    this.addOutput('list', '  whoami     - Informações básicas');
    this.addOutput('list', '  journey    - Formação e experiência');
    this.addOutput('list', '  interests  - Interesses pessoais');
    this.addOutput('list', '  future     - Objetivos futuros');
    this.addOutput('list', '  contact    - Informações de contato');
    
    this.addOutput('info', '═══ HABILIDADES TÉCNICAS ═══');
    this.addOutput('list', '  skills     - Visão geral das skills');
    this.addOutput('list', '  frontend   - Tecnologias frontend');
    this.addOutput('list', '  backend    - Tecnologias backend');
    this.addOutput('list', '  database   - Banco de dados');
    this.addOutput('list', '  tools      - Ferramentas e DevOps');
    
    this.addOutput('info', '═══ PROJETOS E PORTFOLIO ═══');
    this.addOutput('list', '  projects   - Projetos em destaque');
    
    this.addOutput('info', '═══ CONTROLES DO TERMINAL ═══');
    this.addOutput('list', '  mode <tipo> - Alterar modo (terminal/portfolio/skills/contact)');
    this.addOutput('list', '  cd <secao> - Navegar para seção (skills, projects, experience, contact, home)');
    this.addOutput('list', '  clear      - Limpar terminal');
    this.addOutput('list', '  minimize   - Minimizar janela');
    this.addOutput('list', '  fullscreen - Alternar tela cheia');
    this.addOutput('list', '  theme      - Alternar tema');
    this.addOutput('list', '  exit       - Fechar terminal');
    
    this.addOutput('info', '═══ EASTER EGGS ═══');
    this.addOutput('list', '  coffee     - Para os viciados em café');
    this.addOutput('list', '  sudo hire-me - Acesso especial');
    
    this.addOutput('info', '═══ ATALHOS ═══');
    this.addOutput('list', '  Ctrl + `   - Abrir/fechar terminal');
    this.addOutput('list', '  Esc        - Fechar terminal');
    this.addOutput('list', '  Tab        - Auto-complete');
    this.addOutput('list', '  ↑/↓        - Navegar histórico');
  }

  executeWhoami(): void {
    this.addOutput('success', `Nome: ${this.personalInfo.name}`);
    this.addOutput('success', `Função: ${this.personalInfo.role}`);
    this.addOutput('info', `Experiência: ${this.personalInfo.experience}`);
  }

  executeSkills(): void {
    this.addOutput('info', 'HABILIDADES TÉCNICAS:');
    this.addOutput('list', `Frontend: ${this.personalInfo.skills.frontend.join(', ')}`);
    this.addOutput('list', `Backend: ${this.personalInfo.skills.backend.join(', ')}`);
    this.addOutput('list', `Database: ${this.personalInfo.skills.database.join(', ')}`);
    this.addOutput('list', `Outros: ${this.personalInfo.skills.others.join(', ')}`);
    this.addOutput('info', 'Use comandos específicos: frontend, backend, database, tools');
  }

  executeJourney(): void {
    this.addOutput('info', 'JORNADA EDUCACIONAL E PROFISSIONAL:');
    this.addOutput('success', `📚 Formação Atual: ${this.personalInfo.education.current}`);
    this.addOutput('success', `🎓 Formação Completa: ${this.personalInfo.education.completed}`);
    this.addOutput('success', `💼 Experiência: ${this.personalInfo.experience}`);
  }

  executeInterests(): void {
    this.addOutput('info', 'INTERESSES PESSOAIS:');
    this.personalInfo.interests.forEach(interest => {
      this.addOutput('list', interest);
    });
  }

  executeFuture(): void {
    this.addOutput('info', 'OBJETIVOS FUTUROS:');
    this.personalInfo.future.forEach(goal => {
      this.addOutput('list', goal);
    });
  }

  executeContact(): void {
    this.addOutput('info', 'INFORMAÇÕES DE CONTATO:');
    this.addOutput('success', `📧 Email: ${this.personalInfo.contact.email}`);
    this.addOutput('success', `💼 LinkedIn: ${this.personalInfo.contact.linkedin}`);
    this.addOutput('info', 'Entre em contato para oportunidades!');
  }

  executeProjects(): void {
    this.addOutput('info', 'PROJETOS EM DESTAQUE:');
    this.addOutput('list', 'Sistema InCor - Aplicação hospitalar completa');
    this.addOutput('list', 'API REST - Microserviços com Spring Boot');
    this.addOutput('list', 'App Mobile - React Native com integração');
    this.addOutput('info', 'Visite a seção de projetos para mais detalhes!');
  }

  executeFrontend(): void {
    this.addOutput('info', 'HABILIDADES FRONTEND:');
    this.personalInfo.skills.frontend.forEach(skill => {
      this.addOutput('success', `⚡ ${skill} - Avançado`);
    });
    this.addOutput('info', 'Especializado em desenvolvimento de interfaces modernas e responsivas');
  }

  executeBackend(): void {
    this.addOutput('info', 'HABILIDADES BACKEND:');
    this.personalInfo.skills.backend.forEach(skill => {
      this.addOutput('success', `🚀 ${skill} - Avançado`);
    });
    this.addOutput('info', 'Experiência em arquitetura de sistemas e APIs REST/SOAP');
  }

  executeDatabase(): void {
    this.addOutput('info', 'HABILIDADES EM BANCO DE DADOS:');
    this.personalInfo.skills.database.forEach(skill => {
      this.addOutput('success', `💾 ${skill} - Intermediário/Avançado`);
    });
    this.addOutput('info', 'Modelagem, otimização e administração de bancos de dados');
  }

  executeTools(): void {
    this.addOutput('info', 'FERRAMENTAS E TECNOLOGIAS:');
    this.personalInfo.skills.others.forEach(skill => {
      this.addOutput('success', `🛠️ ${skill} - Proficiente`);
    });
    this.addOutput('info', 'DevOps, CI/CD e boas práticas de desenvolvimento');
  }

  executeCoffee(): void {
    this.addOutput('success', '☕ Coffee is life... running on caffeine.');
    this.addOutput('info', 'Desenvolvedor movido a café desde 2020!');
  }

  executeHireMe(): void {
    this.addOutput('success', '✅ Access granted – Pedro is now part of your team.');
    this.addOutput('info', 'Obrigado pela confiança! Vamos criar algo incrível juntos!');
    this.addOutput('list', 'Iniciando processo de onboarding...');
  }

  suggestSimilarCommand(cmd: string): void {
    const commands = ['help', 'whoami', 'skills', 'journey', 'interests', 'future', 'contact', 'projects', 'frontend', 'backend', 'database', 'tools', 'coffee', 'clear', 'mode', 'theme', 'exit'];
    const suggestions = commands.filter(command => 
      command.includes(cmd) || cmd.includes(command) || this.levenshteinDistance(cmd, command) <= 2
    );
    
    if (suggestions.length > 0) {
      this.addOutput('info', `Você quis dizer: ${suggestions.join(', ')}?`);
    }
  }

  levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[str2.length][str1.length];
  }

  // Utility methods
  addOutput(type: string, content: string): void {
    this.outputLines.push({
      type,
      content,
      timestamp: new Date().toLocaleTimeString()
    });
    
    setTimeout(() => {
      this.scrollToBottom();
    }, 10);
  }

  updateCommandDisplay(): void {
    // Remove current input line
    const lastLine = this.outputLines[this.outputLines.length - 1];
    if (lastLine && lastLine.type === 'input') {
      this.outputLines.pop();
    }
    
    // Add updated input line
    this.outputLines.push({
      type: 'input',
      content: `pedro@floating-terminal:~$ ${this.currentCommand}<span class="cursor-blink">_</span>`,
      timestamp: new Date().toLocaleTimeString()
    });
    
    // Update suggestions
    this.updateSuggestions();
  }

  showPrompt(): void {
    this.addOutput('input', `pedro@floating-terminal:~$ <span class="cursor-blink">_</span>`);
  }

  showInitialPrompt(): void {
    this.addOutput('system', 'Terminal flutuante inicializado!');
    this.addOutput('info', 'Digite "help" para ver comandos ou "mode <tipo>" para alterar modo');
    this.showPrompt();
  }

  initializeTerminal(): void {
    // Initialize terminal with welcome message
  }

  scrollToBottom(): void {
    setTimeout(() => {
      if (this.consoleOutput) {
        const element = this.consoleOutput.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    }, 10);
  }

  navigateHistory(direction: number): void {
    if (this.commandHistory.length === 0) return;
    
    this.historyIndex += direction;
    
    if (this.historyIndex < -1) {
      this.historyIndex = -1;
      this.currentCommand = '';
    } else if (this.historyIndex >= this.commandHistory.length) {
      this.historyIndex = this.commandHistory.length - 1;
    }
    
    if (this.historyIndex >= 0) {
      this.currentCommand = this.commandHistory[this.historyIndex];
    } else {
      this.currentCommand = '';
    }
    
    this.updateCommandDisplay();
  }

  autoComplete(): void {
    const commands = [
      'help', 'whoami', 'skills', 'journey', 'interests', 'future', 'contact', 
      'projects', 'frontend', 'backend', 'database', 'tools', 'coffee', 
      'clear', 'mode', 'minimize', 'fullscreen', 'theme', 'exit', 'sudo', 'cd'
    ];
    const matches = commands.filter(cmd => cmd.startsWith(this.currentCommand.toLowerCase()));
    
    if (matches.length === 1) {
      this.currentCommand = matches[0];
      this.updateCommandDisplay();
    } else if (matches.length > 1) {
      this.addOutput('info', `Opções: ${matches.join(', ')}`);
      this.showPrompt();
    }
  }

  cycleTheme(): void {
    // Implement theme cycling
    this.addOutput('info', 'Tema alterado!');
  }

  // Enhanced UI Methods
  onButtonHover(expanded: boolean): void {
    this.buttonExpanded = expanded;
  }

  quickCommand(command: string): void {
    this.openTerminal();
    setTimeout(() => {
      this.currentCommand = command;
      this.executeCommand();
    }, 1000);
  }

  checkFirstTimeUser(): void {
    const visited = localStorage.getItem('pedro-terminal-visited');
    this.isFirstTime = !visited;
    this.hasNotification = this.isFirstTime;
  }

  initializeCommandSuggestions(): void {
    this.commandSuggestions = [
      { command: 'help', description: 'Lista todos os comandos disponíveis' },
      { command: 'whoami', description: 'Informações pessoais básicas' },
      { command: 'skills', description: 'Habilidades técnicas' },
      { command: 'journey', description: 'Formação e experiência' },
      { command: 'projects', description: 'Projetos em destaque' },
      { command: 'contact', description: 'Informações de contato' },
      { command: 'interests', description: 'Interesses pessoais' },
      { command: 'future', description: 'Objetivos futuros' },
      { command: 'frontend', description: 'Tecnologias frontend' },
      { command: 'backend', description: 'Tecnologias backend' },
      { command: 'cd skills', description: 'Navegar para seção de habilidades' },
      { command: 'cd projects', description: 'Navegar para seção de projetos' },
      { command: 'cd experience', description: 'Navegar para seção de experiência' },
      { command: 'cd contact', description: 'Navegar para seção de contato' },
      { command: 'coffee', description: 'Easter egg para amantes de café' }
    ];
  }

  // Tutorial Methods
  skipTutorial(): void {
    this.showTutorial = false;
    this.showWelcome = true;
    setTimeout(() => {
      this.isEntering = false;
      this.initializeTerminal();
    }, 800);

    setTimeout(() => {
      this.showWelcome = false;
      this.showInitialPrompt();
    }, 3000);
  }

  startTutorial(): void {
    this.showTutorial = false;
    this.tutorialStep = 1;
    this.showCommandHints = true;
    this.addOutput('system', 'Tutorial iniciado! Digite "help" para começar.');
    this.showPrompt();
  }

  // Suggestion Methods
  updateSuggestions(): void {
    if (this.currentCommand.length === 0) {
      this.showSuggestions = false;
      return;
    }

    const filtered = this.commandSuggestions.filter(suggestion =>
      suggestion.command.toLowerCase().includes(this.currentCommand.toLowerCase())
    );

    if (filtered.length > 0) {
      this.commandSuggestions = filtered.map((suggestion, index) => ({
        ...suggestion,
        highlighted: index === 0
      }));
      this.showSuggestions = true;
    } else {
      this.showSuggestions = false;
    }
  }

  applySuggestion(suggestion: CommandSuggestion): void {
    this.currentCommand = suggestion.command;
    this.updateCommandDisplay();
    this.showSuggestions = false;
  }

  executeQuickCommand(command: string): void {
    this.currentCommand = command;
    this.executeCommand();
    this.showCommandHints = false;
  }

  // Navigation command implementation
  executeNavigation(section: string): void {
    const validSections = ['home', 'skills', 'experience', 'projects', 'contact'];
    const normalizedSection = section.toLowerCase();
    
    if (!validSections.includes(normalizedSection)) {
      this.addOutput('error', `Seção '${section}' não encontrada. Seções disponíveis: ${validSections.join(', ')}`);
      return;
    }
    
    this.addOutput('success', `Navegando para a seção: ${normalizedSection}`);
    this.addOutput('info', 'Fechando terminal e redirecionando...');
    
    // Delay para mostrar a mensagem antes de fechar
    setTimeout(() => {
      this.closeTerminal();
      
      // Delay adicional para animação de fechamento
      setTimeout(() => {
        this.navigateToSection(normalizedSection);
      }, 500);
    }, 1000);
  }

  private navigateToSection(sectionId: string): void {
    // Usar o serviço de navegação para comunicar com o componente principal
    this.navigationService.navigateToSection(sectionId);
  }
}

interface OutputLine {
  type: string;
  content: string;
  timestamp: string;
}

interface CommandSuggestion {
  command: string;
  description: string;
  highlighted?: boolean;
}
