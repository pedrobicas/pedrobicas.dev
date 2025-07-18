import { Component, Input, ElementRef, ViewChild, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface SkillNode {
  name: string;
  icon: string;
  color: string;
  desc: string;
  x?: number;
  y?: number;
}

@Component({
  selector: 'app-skills-constellation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './skills-constellation.component.html',
  styleUrls: ['./skills-constellation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillsConstellationComponent implements AfterViewInit {
  @ViewChild('constellationCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  skills: SkillNode[] = [
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

  hoveredSkill: SkillNode | null = null;
  hoveredPos = { x: 0, y: 0 };
  highlightedIndex = 0;
  highlightTimer: any = null;
  animationFrame: any = null;

  ngAfterViewInit() {
    this.layoutNodes();
    this.animate();
    this.startAutoHighlight();
    this.canvasRef.nativeElement.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.canvasRef.nativeElement.addEventListener('mouseleave', this.onMouseLeave.bind(this));
    window.addEventListener('resize', this.onResize.bind(this));
  }

  layoutNodes() {
    // Distribui os nós em círculo
    const w = this.canvasRef.nativeElement.width = this.canvasRef.nativeElement.offsetWidth;
    const h = this.canvasRef.nativeElement.height = this.canvasRef.nativeElement.offsetHeight;
    const cx = w / 2, cy = h / 2, r = Math.min(w, h) * 0.34;
    this.skills.forEach((skill, i) => {
      const angle = (2 * Math.PI / this.skills.length) * i - Math.PI/2;
      skill.x = cx + Math.cos(angle) * r;
      skill.y = cy + Math.sin(angle) * r;
    });
  }

  animate() {
    const ctx = this.canvasRef.nativeElement.getContext('2d')!;
    const w = this.canvasRef.nativeElement.width;
    const h = this.canvasRef.nativeElement.height;
    ctx.clearRect(0, 0, w, h);
    // Fundo gradiente + partículas
    const grad = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w*0.7);
    grad.addColorStop(0, 'rgba(44,131,212,0.18)');
    grad.addColorStop(1, 'rgba(17,34,64,0.98)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
    this.drawParticles(ctx, w, h);
    // Linhas
    ctx.save();
    for (let i = 0; i < this.skills.length; i++) {
      for (let j = i+1; j < this.skills.length; j++) {
        ctx.beginPath();
        ctx.moveTo(this.skills[i].x!, this.skills[i].y!);
        ctx.lineTo(this.skills[j].x!, this.skills[j].y!);
        ctx.strokeStyle = this.isHighlighted(i, j) ? '#2c83d4cc' : 'rgba(136,146,176,0.18)';
        ctx.lineWidth = this.isHighlighted(i, j) ? 2.5 : 1.1;
        ctx.shadowColor = this.isHighlighted(i, j) ? '#2c83d4' : 'transparent';
        ctx.shadowBlur = this.isHighlighted(i, j) ? 8 : 0;
        ctx.globalAlpha = this.isHighlighted(i, j) ? 0.95 : 0.45;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
    ctx.restore();
    // Pontos
    this.skills.forEach((skill, i) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(skill.x!, skill.y!, this.isHighlighted(i) ? 22 : 15, 0, 2*Math.PI);
      ctx.fillStyle = this.isHighlighted(i) ? skill.color : 'rgba(44,131,212,0.13)';
      ctx.shadowColor = skill.color;
      ctx.shadowBlur = this.isHighlighted(i) ? 24 : 8;
      ctx.globalAlpha = this.isHighlighted(i) ? 0.98 : 0.7;
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = this.isHighlighted(i) ? '#fff' : skill.color+'55';
      ctx.stroke();
      ctx.restore();
    });
    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  drawParticles(ctx: CanvasRenderingContext2D, w: number, h: number) {
    for (let i = 0; i < 32; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const r = Math.random() * 2.5 + 0.7;
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2*Math.PI);
      ctx.fillStyle = 'rgba(44,131,212,0.10)';
      ctx.shadowColor = '#2c83d4';
      ctx.shadowBlur = 8;
      ctx.globalAlpha = 0.18;
      ctx.fill();
      ctx.restore();
    }
  }

  isHighlighted(i: number, j?: number) {
    if (this.hoveredSkill) {
      return i === this.skills.indexOf(this.hoveredSkill) || (j !== undefined && (i === this.skills.indexOf(this.hoveredSkill) || j === this.skills.indexOf(this.hoveredSkill)));
    }
    return i === this.highlightedIndex || (j !== undefined && (i === this.highlightedIndex || j === this.highlightedIndex));
  }

  onMouseMove(e: MouseEvent) {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    let found = false;
    for (const skill of this.skills) {
      const dx = x - (skill.x!);
      const dy = y - (skill.y!);
      if (dx*dx + dy*dy < 22*22) {
        this.hoveredSkill = skill;
        this.hoveredPos = { x: skill.x!, y: skill.y! };
        found = true;
        break;
      }
    }
    if (!found) this.hoveredSkill = null;
  }

  onMouseLeave() {
    this.hoveredSkill = null;
  }

  startAutoHighlight() {
    this.highlightTimer = setInterval(() => {
      if (!this.hoveredSkill) {
        this.highlightedIndex = (this.highlightedIndex + 1) % this.skills.length;
      }
    }, 2200);
  }

  onResize() {
    this.layoutNodes();
  }
} 