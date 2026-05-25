import { Injectable, signal, computed } from '@angular/core';
import { fr } from '../i18n/fr';
import { en } from '../i18n/en';
import { ar } from '../i18n/ar';

export type Language = 'fr' | 'en' | 'ar';

export interface LanguageOption {
  code: Language;
  label: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

const TRANSLATIONS: Record<Language, typeof fr> = { fr, en, ar };

const LANG_KEY = 'bydjo_lang';

@Injectable({ providedIn: 'root' })
export class I18nService {
  readonly availableLanguages: LanguageOption[] = [
    { code: 'fr', label: 'Français', flag: '🇫🇷', dir: 'ltr' },
    { code: 'en', label: 'English', flag: '🇬🇧', dir: 'ltr' },
    { code: 'ar', label: 'العربية', flag: '🇹🇳', dir: 'rtl' },
  ];

  private _lang = signal<Language>(this.getSavedLang());

  readonly currentLang = this._lang.asReadonly();

  readonly t = computed(() => TRANSLATIONS[this._lang()]);

  readonly isRTL = computed(() => this._lang() === 'ar');

  readonly currentLangOption = computed(() =>
    this.availableLanguages.find(l => l.code === this._lang())!
  );

  constructor() {
    this.applyLang(this._lang());
  }

  setLang(lang: Language): void {
    this._lang.set(lang);
    localStorage.setItem(LANG_KEY, lang);
    this.applyLang(lang);
  }

  /**
   * Shortcut: translate a key path like 'nav.shop' or 'home.shopNow'
   */
  translate(key: string): string {
    const parts = key.split('.');
    let obj: any = TRANSLATIONS[this._lang()];
    for (const part of parts) {
      if (obj == null) return key;
      obj = obj[part];
    }
    return typeof obj === 'string' ? obj : key;
  }

  private getSavedLang(): Language {
    const saved = localStorage.getItem(LANG_KEY) as Language | null;
    if (saved && ['fr', 'en', 'ar'].includes(saved)) return saved;
    // Detect browser language
    const browser = navigator.language.split('-')[0] as Language;
    if (['fr', 'en', 'ar'].includes(browser)) return browser;
    return 'fr';
  }

  private applyLang(lang: Language): void {
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', dir);
  }
}
