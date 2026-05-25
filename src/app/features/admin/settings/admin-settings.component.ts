import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <h1 class="text-3xl font-black text-dark-100 mb-8">Paramètres</h1>

      @if (saveSuccess()) {
        <div class="mb-6 p-4 bg-green-500/20 border border-green-500/40 rounded-xl text-green-400 text-sm">
          ✅ Paramètres sauvegardés avec succès.
        </div>
      }
      @if (saveError()) {
        <div class="mb-6 p-4 bg-red-500/20 border border-red-500/40 rounded-xl text-red-400 text-sm">
          ❌ Erreur lors de la sauvegarde : {{ saveError() }}
        </div>
      }

      <div class="space-y-8">
        <!-- Store Info -->
        <div class="glass rounded-2xl p-6">
          <h2 class="text-xl font-bold text-dark-100 mb-6">Informations de la boutique</h2>
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-dark-400 text-sm mb-2">Nom de la boutique</label>
              <input type="text" [(ngModel)]="settings['store.name']" class="input-dark">
            </div>
            <div>
              <label class="block text-dark-400 text-sm mb-2">Téléphone</label>
              <input type="tel" [(ngModel)]="settings['store.phone']" class="input-dark">
            </div>
            <div>
              <label class="block text-dark-400 text-sm mb-2">Email</label>
              <input type="email" [(ngModel)]="settings['store.email']" class="input-dark">
            </div>
            <div>
              <label class="block text-dark-400 text-sm mb-2">Adresse</label>
              <input type="text" [(ngModel)]="settings['store.address']" class="input-dark">
            </div>
          </div>
          <button class="btn-primary mt-6" [disabled]="saving()" (click)="saveSection('store')">
            {{ saving() ? 'Sauvegarde...' : 'Sauvegarder' }}
          </button>
        </div>

        <!-- Delivery -->
        <div class="glass rounded-2xl p-6">
          <h2 class="text-xl font-bold text-dark-100 mb-6">Frais de livraison</h2>
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-dark-400 text-sm mb-2">Frais de livraison standard (TND)</label>
              <input type="number" [(ngModel)]="settings['delivery.fee']" class="input-dark">
            </div>
            <div>
              <label class="block text-dark-400 text-sm mb-2">Livraison gratuite à partir de (TND)</label>
              <input type="number" [(ngModel)]="settings['delivery.free_threshold']" class="input-dark">
            </div>
          </div>
          <button class="btn-primary mt-6" [disabled]="saving()" (click)="saveSection('delivery')">
            {{ saving() ? 'Sauvegarde...' : 'Sauvegarder' }}
          </button>
        </div>

        <!-- Social Links -->
        <div class="glass rounded-2xl p-6">
          <h2 class="text-xl font-bold text-dark-100 mb-6">Réseaux sociaux</h2>
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-dark-400 text-sm mb-2">WhatsApp</label>
              <input type="text" [(ngModel)]="settings['store.whatsapp']" class="input-dark">
            </div>
            <div>
              <label class="block text-dark-400 text-sm mb-2">Facebook</label>
              <input type="text" [(ngModel)]="settings['store.facebook']" class="input-dark">
            </div>
            <div>
              <label class="block text-dark-400 text-sm mb-2">Instagram</label>
              <input type="text" [(ngModel)]="settings['store.instagram']" class="input-dark">
            </div>
          </div>
          <button class="btn-primary mt-6" [disabled]="saving()" (click)="saveSection('social')">
            {{ saving() ? 'Sauvegarde...' : 'Sauvegarder' }}
          </button>
        </div>

        <!-- Payment -->
        <div class="glass rounded-2xl p-6">
          <h2 class="text-xl font-bold text-dark-100 mb-6">Paiement</h2>
          <div class="space-y-3">
            <div class="flex items-center gap-4 p-4 border border-dark-700 rounded-xl">
              <div class="w-10 h-10 bg-primary-500/10 rounded-lg flex items-center justify-center">
                <span class="text-lg">💵</span>
              </div>
              <div class="flex-1">
                <p class="text-dark-100 font-medium">Paiement à la livraison</p>
                <p class="text-dark-500 text-sm">Paiement en espèces à la réception</p>
              </div>
              <span class="badge-success">Activé</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminSettingsComponent implements OnInit {
  // FIX Bug #14: Settings are loaded from and saved to the backend API
  settings: Record<string, string> = {};
  saving = signal(false);
  saveSuccess = signal(false);
  saveError = signal<string | null>(null);

  private readonly SECTION_KEYS: Record<string, string[]> = {
    store: ['store.name', 'store.phone', 'store.email', 'store.address'],
    delivery: ['delivery.fee', 'delivery.free_threshold'],
    social: ['store.whatsapp', 'store.facebook', 'store.instagram'],
  };

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.get<Record<string, string>>('store/info').subscribe({
      next: (data) => { this.settings = data; },
      error: () => { this.saveError.set('Impossible de charger les paramètres.'); }
    });
  }

  saveSection(section: string): void {
    const keys = this.SECTION_KEYS[section] ?? [];
    const payload: Record<string, string> = {};
    keys.forEach(k => { if (this.settings[k] !== undefined) payload[k] = this.settings[k]; });

    this.saving.set(true);
    this.saveSuccess.set(false);
    this.saveError.set(null);

    this.api.put<any>('store/settings', payload).subscribe({
      next: () => {
        this.saving.set(false);
        this.saveSuccess.set(true);
        setTimeout(() => this.saveSuccess.set(false), 3000);
      },
      error: (err) => {
        this.saving.set(false);
        this.saveError.set(err?.error?.message ?? 'Erreur serveur');
      }
    });
  }
}

