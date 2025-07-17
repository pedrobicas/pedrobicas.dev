// typing-effect.component.ts
import { Component, Input, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-typing-effect',
  templateUrl: './typing-effect.component.html',
  styleUrls: ['./typing-effect.component.scss'],
  standalone: true
})
export class TypingEffectComponent implements OnInit, OnDestroy {
  @Input() texts: string[] = [];
  @Input() typingSpeed: number = 90;
  @Input() deletingSpeed: number = 40;
  @Input() pauseTime: number = 1800;

  displayText = '';
  private textIndex = 0;
  private charIndex = 0;
  private isDeleting = false;
  private timeoutId: any;

  ngOnInit(): void {
    this.startTyping();
  }

  ngOnDestroy(): void {
    if (this.timeoutId) clearTimeout(this.timeoutId);
  }

  private startTyping(): void {
    if (!this.texts.length) return;
    const fullText = this.texts[this.textIndex];

    if (this.isDeleting) {
      this.charIndex = Math.max(0, this.charIndex - 1);
    } else {
      this.charIndex = Math.min(fullText.length, this.charIndex + 1);
    }
    this.displayText = fullText.substring(0, this.charIndex);

    let nextDelay = this.isDeleting ? this.deletingSpeed : this.typingSpeed;

    if (!this.isDeleting && this.charIndex === fullText.length) {
      this.isDeleting = true;
      nextDelay = this.pauseTime;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.textIndex = (this.textIndex + 1) % this.texts.length;
      nextDelay = 600;
    }

    this.timeoutId = setTimeout(() => this.startTyping(), nextDelay);
  }
}