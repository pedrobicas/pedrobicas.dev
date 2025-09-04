import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private navigationSubject = new Subject<string>();
  
  // Observable que outros componentes podem ouvir
  navigation$ = this.navigationSubject.asObservable();
  
  // Método para navegar para uma seção
  navigateToSection(sectionId: string): void {
    this.navigationSubject.next(sectionId);
  }
}
