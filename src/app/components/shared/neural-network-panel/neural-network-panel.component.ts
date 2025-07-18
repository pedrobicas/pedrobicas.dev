import { Component, ElementRef, ViewChild, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface NeuralNode {
  id: number;
  label: string;
  color: string;
  x?: number;
  y?: number;
  desc: string;
}

interface NeuralEdge {
  from: number;
  to: number;
}

@Component({
  selector: 'app-neural-network-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './neural-network-panel.component.html',
  styleUrls: ['./neural-network-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NeuralNetworkPanelComponent implements AfterViewInit {
  @ViewChild('neuralCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  nodes: NeuralNode[] = [
    { id: 0, label: 'Angular', color: '#DD0031', desc: 'SPA robusto para web apps.' },
    { id: 1, label: 'React', color: '#61DAFB', desc: 'Componentização e UI reativa.' },
    { id: 2, label: 'Node.js', color: '#3C873A', desc: 'Back-end escalável e rápido.' },
    { id: 3, label: 'TypeScript', color: '#3178C6', desc: 'Tipagem forte para JS.' },
    { id: 4, label: 'Java', color: '#E76F00', desc: 'Back-end corporativo.' },
    { id: 5, label: 'Spring Boot', color: '#6DB33F', desc: 'APIs robustas e seguras.' },
    { id: 6, label: 'PostgreSQL', color: '#336791', desc: 'Banco relacional avançado.' },
    { id: 7, label: 'MongoDB', color: '#47A248', desc: 'Banco NoSQL flexível.' },
    { id: 8, label: 'Docker', color: '#2496ED', desc: 'Containerização de apps.' }
  ];

  edges: NeuralEdge[] = [
    { from: 0, to: 3 }, { from: 3, to: 1 }, { from: 1, to: 2 },
    { from: 2, to: 4 }, { from: 4, to: 5 }, { from: 5, to: 6 },
    { from: 6, to: 7 }, { from: 7, to: 8 }, { from: 8, to: 0 },
    { from: 0, to: 2 }, { from: 1, to: 5 }, { from: 3, to: 6 }
  ];

  hoveredNode: NeuralNode | null = null;
  hoveredPos = { x: 0, y: 0 };
  activePath: number[] = [];
  pulseT = 0;
  animationFrame: any = null;
  orbitT = 0;
  highlightIndex = 0;
  highlightTimer: any = null;

  ngAfterViewInit() {
    this.layoutNodes();
    this.animate();
    this.startAutoHighlight();
    this.canvasRef.nativeElement.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.canvasRef.nativeElement.addEventListener('mouseleave', this.onMouseLeave.bind(this));
    this.canvasRef.nativeElement.addEventListener('click', this.onClick.bind(this));
    window.addEventListener('resize', this.onResize.bind(this));
  }

  layoutNodes() {
    // Distribui os nós em círculo, mas a posição é animada no animate()
    const w = this.canvasRef.nativeElement.width = this.canvasRef.nativeElement.offsetWidth;
    const h = this.canvasRef.nativeElement.height = this.canvasRef.nativeElement.offsetHeight;
    const cx = w / 2, cy = h / 2, r = Math.min(w, h) * 0.36;
    this.nodes.forEach((node, i) => {
      node.x = cx + Math.cos((2 * Math.PI / this.nodes.length) * i - Math.PI/2) * r;
      node.y = cy + Math.sin((2 * Math.PI / this.nodes.length) * i - Math.PI/2) * r;
    });
  }

  animate() {
    const ctx = this.canvasRef.nativeElement.getContext('2d')!;
    const w = this.canvasRef.nativeElement.width;
    const h = this.canvasRef.nativeElement.height;
    ctx.clearRect(0, 0, w, h);
    // Partículas de fundo
    this.drawBackgroundParticles(ctx, w, h);
    // Animação orbital
    this.orbitT += 0.0035;
    // Atualiza posição dos nós
    const cx = w / 2, cy = h / 2, r = Math.min(w, h) * 0.48; // Aumenta o raio da órbita
    this.nodes.forEach((node, i) => {
      // Mais variação de ângulo para espalhar
      const baseAngle = (2 * Math.PI / this.nodes.length) * i - Math.PI/2;
      const angle = baseAngle + Math.sin(this.orbitT + i) * 0.22 + this.orbitT * 1.1 + Math.cos(i * 1.7) * 0.18;
      node.x = cx + Math.cos(angle) * r;
      node.y = cy + Math.sin(angle) * r;
    });
    // Conexões
    ctx.save();
    this.edges.forEach(edge => {
      const from = this.nodes[edge.from];
      const to = this.nodes[edge.to];
      const grad = ctx.createLinearGradient(from.x!, from.y!, to.x!, to.y!);
      grad.addColorStop(0, from.color + 'cc');
      grad.addColorStop(1, to.color + 'cc');
      ctx.beginPath();
      ctx.moveTo(from.x!, from.y!);
      ctx.lineTo(to.x!, to.y!);
      ctx.strokeStyle = this.isActiveEdge(edge) ? grad : 'rgba(136,146,176,0.13)';
      ctx.lineWidth = this.isActiveEdge(edge) ? 4.2 : 1.3;
      ctx.shadowColor = this.isActiveEdge(edge) ? '#2c83d4' : 'transparent';
      ctx.shadowBlur = this.isActiveEdge(edge) ? 22 : 0;
      ctx.globalAlpha = this.isActiveEdge(edge) ? 0.98 : 0.32;
      ctx.stroke();
      ctx.globalAlpha = 1;
      // Partículas viajando na linha
      if (this.isActiveEdge(edge)) {
        for (let k = 0; k < 2; k++) {
          const t = (this.pulseT + k * 0.5) % 1;
          const x = from.x! + (to.x! - from.x!) * t;
          const y = from.y! + (to.y! - from.y!) * t;
          ctx.save();
          ctx.beginPath();
          ctx.arc(x, y, 8, 0, 2*Math.PI);
          ctx.fillStyle = grad;
          ctx.shadowColor = to.color;
          ctx.shadowBlur = 18;
          ctx.globalAlpha = 0.8;
          ctx.fill();
          ctx.restore();
        }
      }
    });
    ctx.restore();
    // Nós
    this.nodes.forEach((node, i) => {
      ctx.save();
      // Pulsação
      const pulse = 1 + Math.sin(this.pulseT * 2 * Math.PI + i) * 0.16 + (this.isActiveNode(i) ? 0.22 : 0);
      const nodeRadius = this.isActiveNode(i) ? 38 : 26;
      ctx.beginPath();
      ctx.arc(node.x!, node.y!, nodeRadius * pulse, 0, 2*Math.PI);
      ctx.fillStyle = node.color;
      ctx.shadowColor = node.color;
      ctx.shadowBlur = this.isActiveNode(i) ? 48 : 22;
      ctx.globalAlpha = this.isActiveNode(i) ? 0.99 : 0.75;
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = this.isActiveNode(i) ? '#fff' : node.color+'55';
      ctx.stroke();
      // Glow extra ao hover
      if (this.isActiveNode(i)) {
        ctx.beginPath();
        ctx.arc(node.x!, node.y!, (nodeRadius + 14) * pulse, 0, 2*Math.PI);
        ctx.strokeStyle = node.color + '55';
        ctx.lineWidth = 10;
        ctx.globalAlpha = 0.22;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 32;
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
      ctx.restore();
      // Label
      ctx.save();
      ctx.font = this.isActiveNode(i) ? 'bold 1.35rem Montserrat, Arial' : 'bold 1.08rem Montserrat, Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fff';
      ctx.globalAlpha = this.isActiveNode(i) ? 1 : 0.8;
      ctx.shadowColor = node.color;
      ctx.shadowBlur = this.isActiveNode(i) ? 18 : 0;
      ctx.fillText(node.label, node.x!, node.y! + (this.isActiveNode(i) ? nodeRadius + 28 : nodeRadius + 18));
      ctx.restore();
    });
    // Pulso central animado
    ctx.save();
    ctx.beginPath();
    ctx.arc(w/2, h/2, 28 + Math.sin(this.pulseT*2*Math.PI)*3, 0, 2*Math.PI);
    ctx.strokeStyle = '#2c83d4cc';
    ctx.lineWidth = 7.5;
    ctx.globalAlpha = 0.22 + Math.abs(Math.sin(this.pulseT*2*Math.PI))*0.22;
    ctx.shadowColor = '#2c83d4';
    ctx.shadowBlur = 38;
    ctx.stroke();
    ctx.restore();
    // Animação
    this.pulseT += 0.012;
    if (this.pulseT > 1) this.pulseT = 0;
    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  drawBackgroundParticles(ctx: CanvasRenderingContext2D, w: number, h: number) {
    for (let i = 0; i < 24; i++) {
      const t = (this.pulseT * 2 * Math.PI + i) % (2 * Math.PI);
      const x = w/2 + Math.cos(t + i) * (w * 0.38 + Math.sin(this.pulseT*2*Math.PI + i)*12);
      const y = h/2 + Math.sin(t + i) * (h * 0.38 + Math.cos(this.pulseT*2*Math.PI + i)*12);
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, 2.2 + Math.sin(this.pulseT*2*Math.PI + i)*0.7, 0, 2*Math.PI);
      ctx.fillStyle = 'rgba(44,131,212,0.10)';
      ctx.shadowColor = '#2c83d4';
      ctx.shadowBlur = 8;
      ctx.globalAlpha = 0.18;
      ctx.fill();
      ctx.restore();
    }
  }

  isActiveNode(i: number) {
    if (this.hoveredNode) return this.nodes[i] === this.hoveredNode;
    if (this.activePath.length) return this.activePath.includes(i);
    // Highlight automático
    return i === this.highlightIndex;
  }

  isActiveEdge(edge: NeuralEdge) {
    if (this.hoveredNode) return edge.from === this.hoveredNode.id || edge.to === this.hoveredNode.id;
    if (this.activePath.length) return this.activePath.includes(edge.from) && this.activePath.includes(edge.to);
    // Highlight automático
    return edge.from === this.highlightIndex || edge.to === this.highlightIndex;
  }

  startAutoHighlight() {
    this.highlightTimer = setInterval(() => {
      if (!this.hoveredNode && this.activePath.length === 0) {
        this.highlightIndex = (this.highlightIndex + 1) % this.nodes.length;
      }
    }, 2200);
  }

  onMouseMove(e: MouseEvent) {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    let found = false;
    for (const node of this.nodes) {
      const dx = x - (node.x!);
      const dy = y - (node.y!);
      if (dx*dx + dy*dy < 32*32) {
        this.hoveredNode = node;
        this.hoveredPos = { x: node.x!, y: node.y! };
        found = true;
        break;
      }
    }
    if (!found) this.hoveredNode = null;
  }

  onMouseLeave() {
    this.hoveredNode = null;
  }

  onClick(e: MouseEvent) {
    if (this.hoveredNode) {
      // Ativa caminho a partir do nó clicado
      this.activePath = this.getConnectedPath(this.hoveredNode.id);
    } else {
      this.activePath = [];
    }
  }

  getConnectedPath(nodeId: number): number[] {
    // Retorna todos os nós conectados direta ou indiretamente ao nó
    const visited = new Set<number>();
    const stack = [nodeId];
    while (stack.length) {
      const curr = stack.pop()!;
      if (!visited.has(curr)) {
        visited.add(curr);
        this.edges.forEach(edge => {
          if (edge.from === curr && !visited.has(edge.to)) stack.push(edge.to);
          if (edge.to === curr && !visited.has(edge.from)) stack.push(edge.from);
        });
      }
    }
    return Array.from(visited);
  }

  onResize() {
    this.layoutNodes();
  }
} 