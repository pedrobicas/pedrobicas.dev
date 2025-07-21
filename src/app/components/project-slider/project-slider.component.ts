// project-slider.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwiperOptions } from 'swiper/types';

@Component({
  selector: 'app-project-slider',
  standalone: true,
  imports: [CommonModule],
  template: `
    <swiper-container [config]="swiperConfig">
      <swiper-slide *ngFor="let project of projects">
        <div class="project-card">
          <div class="project-image">
            <img [src]="project.image" [alt]="project.title">
            <div class="project-links">
              <a [href]="project.demoUrl" target="_blank" class="link-button">
                <i class="fas fa-external-link-alt"></i> Demo
              </a>
              <a [href]="project.codeUrl" target="_blank" class="link-button">
                <i class="fab fa-github"></i> Código
              </a>
            </div>
          </div>
          <div class="project-details">
            <h3>{{project.title}}</h3>
            <p>{{project.description}}</p>
            <div class="project-techs">
              <span *ngFor="let tech of project.technologies">{{tech}}</span>
            </div>
          </div>
        </div>
      </swiper-slide>
    </swiper-container>
  `,
  styleUrls: ['./project-slider.component.scss']
})
export class ProjectSliderComponent {
  projects = [
    {
      title: 'Juno - Gestão de Pacientes',
      description: 'Plataforma completa para gerenciamento remoto de pacientes com agendamento e telemedicina.',
      technologies: ['Angular', 'Java Spring', 'PostgreSQL'],
      image: 'assets/images/projects/juno.jpg',
      demoUrl: 'https://juno-app.com',
      codeUrl: 'https://github.com/pedrobicas/juno'
    },
    {
      title: 'Finance Dashboard',
      description: 'Dashboard interativo para controle financeiro pessoal com gráficos e relatórios.',
      technologies: ['React', 'Node.js', 'MongoDB'],
      image: 'assets/images/projects/finance.jpg',
      demoUrl: 'https://finance-dashboard.vercel.app',
      codeUrl: 'https://github.com/pedrobicas/finance-dashboard'
    },
    {
      title: 'Task Manager',
      description: 'Aplicativo de gerenciamento de tarefas com drag-and-drop e notificações.',
      technologies: ['Vue.js', 'Firebase'],
      image: 'assets/images/projects/task-manager.jpg',
      demoUrl: 'https://task-manager-vue.web.app',
      codeUrl: 'https://github.com/pedrobicas/task-manager'
    }
  ];

  swiperConfig: SwiperOptions = {
    slidesPerView: 1,
    spaceBetween: 30,
    breakpoints: {
      768: { slidesPerView: 2 },
      992: { slidesPerView: 3 }
    },
    pagination: { clickable: true },
    navigation: true
  };
}