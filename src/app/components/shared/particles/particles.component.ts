// particles.component.ts
import { Component, OnInit } from '@angular/core';

declare const particlesJS: any;

@Component({
  selector: 'app-particles',
  templateUrl: './particles.component.html',
  styleUrls: ['./particles.component.scss'],
  standalone: true
})
export class ParticlesComponent implements OnInit {
  ngOnInit(): void {
    if (typeof particlesJS !== 'undefined') {
      particlesJS('particles-js', {
        particles: {
          number: { value: 200, density: { enable: true, value_area: 900 } },
          color: { value: '#2c83d4' }, // azul claro
          shape: { type: 'circle' },
          opacity: { value: 0.45, random: false },
          size: { value: 3.5, random: true },
          line_linked: { enable: false },
          move: {
            enable: true,
            speed: 0.7,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false
          }
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: { enable: true, mode: 'repulse' },
            onclick: { enable: true, mode: 'push' },
            resize: true
          },
          modes: {
            repulse: { distance: 120, duration: 0.4 },
            push: { particles_nb: 4 }
          }
        },
        retina_detect: true
      });
    }
  }
}