import { Component, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { Engine } from '@tsparticles/engine';
import { loadSlim } from '@tsparticles/slim';
import type { Container, IOptions, RecursivePartial } from "@tsparticles/engine";
import { ParticlesComponent } from '../../components/shared/particles/particles.component';
import { TypingEffectComponent } from '../../components/shared/typing-effect/typing-effect.component';
import { CommonModule } from '@angular/common';
import { SkillsConstellationComponent } from '../../components/shared/skills-constellation/skills-constellation.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ParticlesComponent, TypingEffectComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements AfterViewInit {
  typingTexts = [
    "Desenvolvedor Full-Stack",
    "Estudante de Engenharia de Software"
  ];

  // Para animação de entrada
  nameLetters = Array.from('Pedro Bicas');
  taglineWords = ['Código', 'Design', 'Inovação'];
  introAnimDone = false;
  showTyping = false;

  // Terminal fake
  commandList = ['skills', 'projetos', 'sobre', 'contato'];
  projetos = ['Juno Platform', 'Finance Dashboard', 'Landing Page', 'API Gateway'];
  displayedCommand = '';
  displayedResponse = '';
  currentCommand = '';
  cursorBlink = true;
  private typingTimeout: any = null;
  private responseTimeout: any = null;
  private autoCommandIndex = 0;
  private autoLoop: any = null;

  skills: any[] = [
    { name: 'Angular' }, { name: 'React' }, { name: 'Node.js' }, { name: 'TypeScript' }, { name: 'Java' }, { name: 'Spring Boot' }, { name: 'PostgreSQL' }, { name: 'MongoDB' }, { name: 'Docker' }
  ];

  // Catch the Skill
  @ViewChild('catchCanvas', { static: false }) catchCanvasRef!: ElementRef<HTMLCanvasElement>;
  score = 0;
  timeLeft = 30;
  gameOver = false;
  feedback = { show: false, x: 0, y: 0, name: '', icon: '', desc: '' };
  private catchCtx: CanvasRenderingContext2D | null = null;
  private skillsInGame: any[] = [];
  private catchSkills: any[] = [
    { name: 'Angular', icon: 'fab fa-angular', color: '#DD0031', desc: 'SPA robusto para web apps.' },
    { name: 'React', icon: 'fab fa-react', color: '#61DAFB', desc: 'Componentização e UI reativa.' },
    { name: 'Node.js', icon: 'fab fa-node-js', color: '#3C873A', desc: 'Back-end escalável e rápido.' },
    { name: 'TypeScript', icon: 'fas fa-code', color: '#3178C6', desc: 'Tipagem forte para JS.' },
    { name: 'Java', icon: 'fab fa-java', color: '#E76F00', desc: 'Back-end corporativo.' },
    { name: 'Spring Boot', icon: 'fas fa-leaf', color: '#6DB33F', desc: 'APIs robustas e seguras.' },
    { name: 'PostgreSQL', icon: 'fas fa-database', color: '#336791', desc: 'Banco relacional avançado.' },
    { name: 'MongoDB', icon: 'fas fa-database', color: '#47A248', desc: 'Banco NoSQL flexível.' },
    { name: 'Docker', icon: 'fab fa-docker', color: '#2496ED', desc: 'Containerização de apps.' }
  ];
  private catchTimer: any = null;
  private catchAnim: any = null;
  private catchGameDuration = 30;
  private lastSpawn = 0;

  // Painel 3D/Parallax Hero
  heroStacks = [
    { name: 'Angular', icon: 'fab fa-angular', color: '#DD0031' },
    { name: 'React', icon: 'fab fa-react', color: '#61DAFB' },
    { name: 'Node.js', icon: 'fab fa-node-js', color: '#3C873A' },
    { name: 'TypeScript', icon: 'fas fa-code', color: '#3178C6' },
    { name: 'Java', icon: 'fab fa-java', color: '#E76F00' },
    { name: 'Spring Boot', icon: 'fas fa-leaf', color: '#6DB33F' },
    { name: 'PostgreSQL', icon: 'fas fa-database', color: '#336791' },
    { name: 'MongoDB', icon: 'fas fa-database', color: '#47A248' },
    { name: 'Docker', icon: 'fab fa-docker', color: '#2496ED' }
  ];
  heroCardStyle = {};
  private heroPanelRect: DOMRect | null = null;
  private heroAnimFrame: any = null;
  private heroT = 0;

  ngAfterViewInit() {
    this.startAutoLoop();
    setInterval(() => this.cursorBlink = !this.cursorBlink, 500);
    // Iniciar o jogo automaticamente (ou pode ser por botão)
    setTimeout(() => this.startGame(), 800);
    this.animateHeroStacks();
    setTimeout(() => {
      this.introAnimDone = true;
      setTimeout(() => this.showTyping = true, 400); // typing aparece logo após o nome
    }, 1100); // animação mais rápida
  }

  ngOnDestroy() {
    if (this.typingTimeout) clearTimeout(this.typingTimeout);
    if (this.responseTimeout) clearTimeout(this.responseTimeout);
    if (this.autoLoop) clearTimeout(this.autoLoop);
  }

  runCommand(cmd: string) {
    if (this.typingTimeout) clearTimeout(this.typingTimeout);
    if (this.responseTimeout) clearTimeout(this.responseTimeout);
    if (this.autoLoop) clearTimeout(this.autoLoop);
    this.displayedCommand = '';
    this.displayedResponse = '';
    this.currentCommand = cmd;
    this.typeCommand(cmd, 0);
  }

  typeCommand(cmd: string, i: number) {
    if (i <= cmd.length) {
      this.displayedCommand = cmd.slice(0, i);
      this.typingTimeout = setTimeout(() => this.typeCommand(cmd, i + 1), 60);
    } else {
      this.displayedCommand = cmd;
      this.responseTimeout = setTimeout(() => this.typeResponse(cmd), 350);
    }
  }

  typeResponse(cmd: string) {
    // Simula efeito de resposta animada
    this.displayedResponse = '';
    let response = '';
    switch (cmd) {
      case 'skills':
        response = 'Skills principais:';
        break;
      case 'projetos':
        response = 'Projetos em destaque:';
        break;
      case 'sobre':
        response = 'Sobre mim:';
        break;
      case 'contato':
        response = 'Contato:';
        break;
      default:
        response = 'Comando não reconhecido.';
    }
    let i = 0;
    const type = () => {
      if (i <= response.length) {
        this.displayedResponse = response.slice(0, i);
        setTimeout(type, 18);
        i++;
      } else {
        this.displayedResponse = response;
        // Auto loop após alguns segundos
        this.autoLoop = setTimeout(() => this.nextAutoCommand(), 2500);
      }
    };
    type();
  }

  nextAutoCommand() {
    this.autoCommandIndex = (this.autoCommandIndex + 1) % this.commandList.length;
    this.runCommand(this.commandList[this.autoCommandIndex]);
  }

  startAutoLoop() {
    this.runCommand(this.commandList[0]);
  }

  scrollTo(section: string): void {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  startGame() {
    this.score = 0;
    this.timeLeft = this.catchGameDuration;
    this.gameOver = false;
    this.skillsInGame = [];
    this.feedback = { show: false, x: 0, y: 0, name: '', icon: '', desc: '' };
    this.catchCtx = this.catchCanvasRef?.nativeElement.getContext('2d') || null;
    this.resizeCatchCanvas();
    this.spawnSkill();
    if (this.catchTimer) clearInterval(this.catchTimer);
    if (this.catchAnim) cancelAnimationFrame(this.catchAnim);
    this.catchTimer = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) this.endGame();
    }, 1000);
    this.catchCanvasRef.nativeElement.addEventListener('click', this.onCanvasClick.bind(this));
    this.moveSkills();
  }

  resizeCatchCanvas() {
    const canvas = this.catchCanvasRef.nativeElement;
    const parent = canvas.parentElement as HTMLElement;
    canvas.width = parent.offsetWidth;
    canvas.height = parent.offsetHeight;
  }

  spawnSkill() {
    // Spawn skill em posição aleatória, direção e velocidade aleatória
    const canvas = this.catchCanvasRef.nativeElement;
    const skill = { ...this.catchSkills[Math.floor(Math.random() * this.catchSkills.length)] };
    skill.x = Math.random() * (canvas.width - 60) + 30;
    skill.y = Math.random() * (canvas.height - 60) + 30;
    const angle = Math.random() * 2 * Math.PI;
    skill.vx = Math.cos(angle) * (2 + Math.random() * 1.5);
    skill.vy = Math.sin(angle) * (2 + Math.random() * 1.5);
    skill.radius = 28;
    this.skillsInGame.push(skill);
  }

  moveSkills() {
    if (this.gameOver) return;
    this.resizeCatchCanvas();
    const ctx = this.catchCtx;
    const canvas = this.catchCanvasRef.nativeElement;
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    // Partículas de fundo (opcional)
    // Desenhar skills
    for (const skill of this.skillsInGame) {
      // Movimento
      skill.x += skill.vx;
      skill.y += skill.vy;
      // Rebater nas bordas
      if (skill.x < skill.radius || skill.x > canvas.width - skill.radius) skill.vx *= -1;
      if (skill.y < skill.radius || skill.y > canvas.height - skill.radius) skill.vy *= -1;
      // Desenhar
      ctx?.save();
      ctx?.beginPath();
      ctx?.arc(skill.x, skill.y, skill.radius, 0, 2 * Math.PI);
      ctx!.fillStyle = skill.color;
      ctx!.globalAlpha = 0.18;
      ctx?.fill();
      ctx!.globalAlpha = 1;
      ctx!.lineWidth = 2.5;
      ctx!.strokeStyle = skill.color;
      ctx?.stroke();
      ctx?.restore();
      // Ícone
      ctx?.save();
      ctx!.font = 'bold 1.7rem FontAwesome, Arial';
      ctx!.textAlign = 'center';
      ctx!.textBaseline = 'middle';
      ctx!.fillStyle = skill.color;
      ctx!.shadowColor = skill.color;
      ctx!.shadowBlur = 10;
      ctx?.fillText(' ', skill.x, skill.y); // Espaço reservado para ícone
      ctx!.font = 'bold 1.1rem Montserrat, Arial';
      ctx!.shadowBlur = 0;
      ctx!.fillStyle = '#fff';
      ctx?.fillText(skill.name, skill.x, skill.y + 24);
      ctx?.restore();
    }
    // Spawnar novas skills periodicamente
    this.lastSpawn++;
    if (this.lastSpawn > 40 && this.skillsInGame.length < 5) {
      this.spawnSkill();
      this.lastSpawn = 0;
    }
    this.catchAnim = requestAnimationFrame(() => this.moveSkills());
  }

  onCanvasClick(event: MouseEvent) {
    if (this.gameOver) return;
    const rect = this.catchCanvasRef.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    for (let i = 0; i < this.skillsInGame.length; i++) {
      const skill = this.skillsInGame[i];
      const dx = x - skill.x;
      const dy = y - skill.y;
      if (dx * dx + dy * dy < skill.radius * skill.radius) {
        this.skillsInGame.splice(i, 1);
        this.score++;
        this.showFeedback(skill, x, y);
        break;
      }
    }
  }

  showFeedback(skill: any, x: number, y: number) {
    this.feedback = {
      show: true,
      x: x,
      y: y,
      name: skill.name,
      icon: skill.icon,
      desc: skill.desc
    };
    setTimeout(() => {
      this.feedback.show = false;
    }, 1200);
  }

  endGame() {
    this.gameOver = true;
    if (this.catchTimer) clearInterval(this.catchTimer);
    if (this.catchAnim) cancelAnimationFrame(this.catchAnim);
    this.skillsInGame = [];
  }

  onHeroMouseMove(event: MouseEvent) {
    const panel = (event.currentTarget as HTMLElement);
    if (!this.heroPanelRect) this.heroPanelRect = panel.getBoundingClientRect();
    const x = event.clientX - this.heroPanelRect.left;
    const y = event.clientY - this.heroPanelRect.top;
    const cx = this.heroPanelRect.width / 2;
    const cy = this.heroPanelRect.height / 2;
    const dx = (x - cx) / cx;
    const dy = (y - cy) / cy;
    const rotateX = dy * 12;
    const rotateY = -dx * 12;
    this.heroCardStyle = {
      transform: `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04,1.04,1.04)`
    };
  }

  onHeroMouseLeave() {
    this.heroCardStyle = {
      transform: 'perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)'
    };
  }

  getStackStyle(i: number) {
    // Orbitando em círculo animado
    const total = this.heroStacks.length;
    const angle = (2 * Math.PI / total) * i + this.heroT;
    const radius = 120;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius * 0.5;
    return {
      transform: `translate3d(${x}px, ${y}px, 0) scale(1.1)`,
      background: `linear-gradient(120deg, ${this.heroStacks[i].color} 60%, #112240 100%)`,
      boxShadow: `0 2px 16px 0 ${this.heroStacks[i].color}33`
    };
  }

  animateHeroStacks() {
    this.heroT += 0.012;
    if (this.heroT > Math.PI * 2) this.heroT = 0;
    if (this.heroAnimFrame) cancelAnimationFrame(this.heroAnimFrame);
    this.heroAnimFrame = requestAnimationFrame(() => this.animateHeroStacks());
  }
}