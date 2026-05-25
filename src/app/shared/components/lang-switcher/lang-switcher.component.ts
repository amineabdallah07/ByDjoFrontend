import { Component, inject, signal, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService, Language } from '../../../core/services/i18n.service';

@Component({
  selector: 'app-lang-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative lang-switcher-trigger" (click)="toggleDropdown($event)">
      <!-- Current language button -->
      <button
        class="flex items-center gap-1.5 text-dark-300 hover:text-dark-100 transition-colors px-2 py-1.5 rounded-lg hover:bg-dark-800 text-sm font-medium"
        [title]="i18n.currentLangOption().label"
      >
        <span class="text-base leading-none">{{ i18n.currentLangOption().flag }}</span>
        <span class="hidden sm:inline uppercase tracking-wider text-xs">{{ i18n.currentLang() }}</span>
        <svg class="w-3 h-3 transition-transform duration-200" [class.rotate-180]="open()"
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>

      <!-- Dropdown -->
      @if (open()) {
        <div class="absolute right-0 top-full mt-2 w-40 glass rounded-xl py-1 shadow-xl z-50 border border-dark-700 animate-fade-in">
          @for (lang of i18n.availableLanguages; track lang.code) {
            <button
              (click)="selectLang(lang.code)"
              class="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
              [class]="i18n.currentLang() === lang.code
                ? 'text-primary-400 bg-dark-800'
                : 'text-dark-300 hover:text-dark-100 hover:bg-dark-800'"
              [dir]="lang.dir"
            >
              <span class="text-base">{{ lang.flag }}</span>
              <span>{{ lang.label }}</span>
              @if (i18n.currentLang() === lang.code) {
                <svg class="w-3.5 h-3.5 ml-auto text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
              }
            </button>
          }
        </div>
      }
    </div>
  `,
})
export class LangSwitcherComponent {
  i18n = inject(I18nService);
  open = signal(false);

  constructor(private el: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const trigger = this.el.nativeElement.querySelector('.lang-switcher-trigger');
    if (trigger && !trigger.contains(event.target as Node)) {
      this.open.set(false);
    }
  }

  toggleDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.open.update(v => !v);
  }

  selectLang(lang: Language): void {
    this.i18n.setLang(lang);
    this.open.set(false);
  }
}
