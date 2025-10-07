import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadComponent: () => import('./pages/portifolio/portifolio.component').then(m => m.PortifolioComponent) },
  { path: 'resume', loadComponent: () => import('./pages/resume-portfolio/resume-portfolio.component').then(m => m.ResumePortfolioComponent) },
];
