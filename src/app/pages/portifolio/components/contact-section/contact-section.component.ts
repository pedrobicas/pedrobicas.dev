import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-contact-section',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-section.component.html',
  styleUrls: ['./contact-section.component.scss'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('300ms ease-in', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ContactSectionComponent implements OnInit {
  @Input() contactForm: FormGroup | null = null;
  @Input() submitting: boolean = false;
  @Input() submitSuccess: boolean = false;
  @Input() submitError: string = '';
  @Input() onSubmit: (formData: any) => void = () => {};

  // Propriedades para controle do formulário
  messageCharCount = 0;
  maxMessageLength = 500;
  
  // Dados de contato
  contactInfo = {
    email: 'pedro.bicas@exemplo.com',
    phone: '+55 (11) 99999-9999',
    location: 'São Paulo, SP - Brasil',
    availability: 'Disponível para projetos'
  };

  // Links sociais
  socialLinks = [
    {
      name: 'GitHub',
      url: 'https://github.com/pedrobicas',
      icon: 'fab fa-github',
      class: 'github'
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/pedrobicas',
      icon: 'fab fa-linkedin',
      class: 'linkedin'
    }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    if (!this.contactForm) {
      this.contactForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        subject: ['', [Validators.required, Validators.minLength(5)]],
        projectType: ['', Validators.required],
        message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(this.maxMessageLength)]]
      });
    }

    if (this.contactForm.get('message')) {
      this.contactForm.get('message')?.valueChanges.subscribe(value => {
        this.messageCharCount = value ? value.length : 0;
      });
    }
  }

  hasError(fieldName: string): boolean {
    const field = this.contactForm?.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.contactForm?.get(fieldName);
    if (!field || !field.errors) return '';

    const errors = field.errors;
    
    if (errors['required']) {
      return `${this.getFieldLabel(fieldName)} é obrigatório`;
    }
    if (errors['email']) {
      return 'Email deve ter um formato válido';
    }
    if (errors['minlength']) {
      const requiredLength = errors['minlength'].requiredLength;
      return `${this.getFieldLabel(fieldName)} deve ter pelo menos ${requiredLength} caracteres`;
    }
    if (errors['maxlength']) {
      const requiredLength = errors['maxlength'].requiredLength;
      return `${this.getFieldLabel(fieldName)} deve ter no máximo ${requiredLength} caracteres`;
    }
    
    return 'Campo inválido';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Nome',
      email: 'Email',
      subject: 'Assunto',
      projectType: 'Tipo de projeto',
      message: 'Mensagem'
    };
    return labels[fieldName] || fieldName;
  }

  onFormSubmit() {
    if (this.contactForm?.valid && !this.submitting) {
      const formData = this.contactForm.value;
      // Chamar a função passada pelo componente pai
      if (this.onSubmit && typeof this.onSubmit === 'function') {
        this.onSubmit(formData);
      }
    } else {
      // Marcar todos os campos como touched para mostrar erros
      Object.keys(this.contactForm?.controls || {}).forEach(key => {
        this.contactForm?.get(key)?.markAsTouched();
      });
    }
  }

  // Abrir link social
  openSocialLink(url: string) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  // Copiar email para clipboard
  copyEmail() {
    navigator.clipboard.writeText(this.contactInfo.email).then(() => {
      // Aqui você pode adicionar uma notificação de sucesso
      console.log('Email copiado para a área de transferência');
    });
  }
}
