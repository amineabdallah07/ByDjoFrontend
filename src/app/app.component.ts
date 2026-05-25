import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { WhatsAppButtonComponent } from './shared/components/whatsapp-button/whatsapp-button.component';
import { I18nService } from './core/services/i18n.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, WhatsAppButtonComponent, CommonModule],
  template: `
    <div [dir]="i18n.isRTL() ? 'rtl' : 'ltr'" [class]="i18n.isRTL() ? 'font-arabic' : ''">
      <app-navbar />
      <main class="min-h-screen">
        <router-outlet />
      </main>
      <app-footer />
      <app-whatsapp-button />
    </div>
  `,
  styles: [`
    :host { display: block; }
    .font-arabic { font-family: 'Segoe UI', 'Arial', sans-serif; }
  `]
})
export class AppComponent implements OnInit {
  i18n = inject(I18nService);

  ngOnInit(): void {
    if (!localStorage.getItem('cart_session_id')) {
      localStorage.setItem('cart_session_id', this.generateUUID());
    }
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
