// typing-effect.component.ts
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-typing-effect',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="typing-effect">
      <span class="text">{{displayText}}</span><span class="cursor" [class.blinking]="!isTyping">|</span>
    </div>
  `,
  styleUrls: ['./typing-effect.component.scss']
})
export class TypingEffectComponent implements OnInit, OnDestroy {
  @Input() texts: string[] = [];
  @Input() typingSpeed = 100;
  @Input() deletingSpeed = 50;
  @Input() pauseTime = 1000;

  displayText = '';
  currentIndex = 0;
  isTyping = false;
  private timeoutId: any;

  ngOnInit(): void {
    this.typeText();
  }

  ngOnDestroy(): void {
    clearTimeout(this.timeoutId);
  }

  private typeText(): void {
    if (this.currentIndex >= this.texts.length) {
      this.currentIndex = 0;
    }

    const currentText = this.texts[this.currentIndex];
    let charIndex = 0;
    this.isTyping = true;

    const typingInterval = setInterval(() => {
      this.displayText = currentText.substring(0, charIndex);
      charIndex++;

      if (charIndex > currentText.length) {
        clearInterval(typingInterval);
        this.isTyping = false;
        this.timeoutId = setTimeout(() => this.deleteText(), this.pauseTime);
      }
    }, this.typingSpeed);
  }

  private deleteText(): void {
    let charIndex = this.displayText.length;
    this.isTyping = true;

    const deletingInterval = setInterval(() => {
      this.displayText = this.displayText.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        clearInterval(deletingInterval);
        this.isTyping = false;
        this.currentIndex++;
        this.timeoutId = setTimeout(() => this.typeText(), 300);
      }
    }, this.deletingSpeed);
  }
}