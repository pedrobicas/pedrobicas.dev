// navbar.component.ts
import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  
  @ViewChild('navbar', { static: true }) navbar!: ElementRef;
  
  isScrolled = false;
  isMobileMenuOpen = false;
  activeLink = 'home';
  
  ngOnInit() {
    this.initializeParticles();
  }
  
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
    
    // Adiciona classe scrolled à navbar
    const navbarElement = document.querySelector('.navbar');
    if (navbarElement) {
      if (this.isScrolled) {
        navbarElement.classList.add('scrolled');
      } else {
        navbarElement.classList.remove('scrolled');
      }
    }
  }
  
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    
    // Anima o ícone do menu
    const menuIcon = document.querySelector('.menu-icon');
    if (menuIcon) {
      if (this.isMobileMenuOpen) {
        menuIcon.classList.add('active');
      } else {
        menuIcon.classList.remove('active');
      }
    }
  }
  
  setActiveLink(link: string) {
    this.activeLink = link;
    
    // Remove classe active de todos os links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active-link'));
    
    // Adiciona classe active ao link clicado
    const activeElement = document.querySelector(`[data-link="${link}"]`);
    if (activeElement) {
      activeElement.classList.add('active-link');
    }
    
    // Fecha menu mobile se estiver aberto
    if (this.isMobileMenuOpen) {
      this.toggleMobileMenu();
    }
  }
  
  smoothScroll(target: string) {
    const element = document.querySelector(target);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
  
  private initializeParticles() {
    // Adiciona animação às partículas
    setTimeout(() => {
      const particles = document.querySelectorAll('.particle');
      particles.forEach((particle, index) => {
        const delay = index * 2;
        (particle as HTMLElement).style.animationDelay = `${delay}s`;
      });
    }, 100);
  }
  
  // Método para adicionar efeito ripple nos botões sociais
  addRippleEffect(event: Event) {
    const button = event.currentTarget as HTMLElement;
    const ripple = button.querySelector('.social-ripple') as HTMLElement;
    
    if (ripple) {
      ripple.style.animation = 'none';
      ripple.offsetHeight; // Trigger reflow
      ripple.style.animation = 'ripple 0.6s ease-out';
    }
  }
  
  // Método para highlight dinâmico baseado na seção atual
  @HostListener('window:scroll', ['$event'])
  updateActiveSection() {
    const sections = ['home', 'about-section', 'projetos', 'contato'];
    
    sections.forEach(section => {
      const element = document.getElementById(section);
      if (element) {
        const rect = element.getBoundingClientRect();
        const isInViewport = rect.top <= 100 && rect.bottom >= 100;
        
        if (isInViewport) {
          this.setActiveLink(section);
        }
      }
    });
  }
}