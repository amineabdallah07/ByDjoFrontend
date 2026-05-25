import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-admin-promotions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-black text-dark-100">Promotions</h1>
        <button (click)="openCreateForm()" class="btn-primary">+ Nouveau coupon</button>
      </div>

      <!-- Messages -->
      @if (errorMsg()) {
        <div class="mb-4 p-4 bg-red-900/40 border border-red-600 rounded-xl text-red-300 text-sm">{{ errorMsg() }}</div>
      }
      @if (successMsg()) {
        <div class="mb-4 p-4 bg-green-900/40 border border-green-600 rounded-xl text-green-300 text-sm">{{ successMsg() }}</div>
      }

      <!-- Create / Edit Form -->
      @if (showForm()) {
        <div class="glass rounded-2xl p-6 mb-8 animate-fade-in">
          <h2 class="text-xl font-bold text-dark-100 mb-6">
            {{ editingId() ? 'Modifier le coupon' : 'Nouveau Code Promo' }}
          </h2>
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="block text-dark-400 text-sm mb-2">Code</label>
              <input type="text" [(ngModel)]="form.code" class="input-dark" placeholder="ex: SUMMER24"
                     [disabled]="!!editingId()">
            </div>
            <div>
              <label class="block text-dark-400 text-sm mb-2">Description</label>
              <input type="text" [(ngModel)]="form.description" class="input-dark" placeholder="Description du coupon">
            </div>
            <div>
              <label class="block text-dark-400 text-sm mb-2">Réduction (%)</label>
              <input type="number" [(ngModel)]="form.discountPercentage" class="input-dark" min="1" max="100">
            </div>
            <div>
              <label class="block text-dark-400 text-sm mb-2">Limite d'utilisation</label>
              <input type="number" [(ngModel)]="form.usageLimit" class="input-dark" min="1">
            </div>
            <div>
              <label class="block text-dark-400 text-sm mb-2">Date de début</label>
              <input type="date" [(ngModel)]="form.startsAt" class="input-dark">
            </div>
            <div>
              <label class="block text-dark-400 text-sm mb-2">Date d'expiration</label>
              <input type="date" [(ngModel)]="form.expiresAt" class="input-dark">
            </div>
            @if (editingId()) {
              <div class="flex items-center gap-3">
                <label class="block text-dark-400 text-sm">Statut actif</label>
                <input type="checkbox" [(ngModel)]="form.active" class="w-4 h-4 accent-primary-500">
              </div>
            }
          </div>
          <div class="flex gap-3 mt-6">
            <button class="btn-primary" [disabled]="saving()" (click)="saveCoupon()">
              {{ saving() ? 'Enregistrement...' : (editingId() ? 'Enregistrer' : 'Créer le coupon') }}
            </button>
            <button class="btn-secondary" (click)="cancelForm()">Annuler</button>
          </div>
        </div>
      }

      <!-- Delete confirmation modal -->
      @if (deletingId()) {
        <div class="fixed inset-0 bg-white/70 flex items-center justify-center z-50" (click)="deletingId.set(null)">
          <div class="glass rounded-2xl p-6 max-w-sm w-full mx-4" (click)="$event.stopPropagation()">
            <h3 class="text-lg font-bold text-dark-100 mb-2">Supprimer le coupon ?</h3>
            <p class="text-dark-400 text-sm mb-6">
              Cette action est irréversible. Le coupon
              <code class="text-primary-400 font-mono">{{ deletingCode() }}</code>
              sera définitivement supprimé.
            </p>
            <div class="flex gap-3">
              <button class="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-colors"
                      [disabled]="deleting()" (click)="confirmDelete()">
                {{ deleting() ? 'Suppression...' : 'Supprimer' }}
              </button>
              <button class="flex-1 btn-secondary text-sm" (click)="deletingId.set(null)">Annuler</button>
            </div>
          </div>
        </div>
      }

      <!-- Coupons List -->
      <div class="glass rounded-2xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="text-left border-b border-dark-800 bg-dark-900/50">
                <th class="p-4 text-dark-400 text-sm font-medium">Code</th>
                <th class="p-4 text-dark-400 text-sm font-medium">Description</th>
                <th class="p-4 text-dark-400 text-sm font-medium">Réduction</th>
                <th class="p-4 text-dark-400 text-sm font-medium">Utilisations</th>
                <th class="p-4 text-dark-400 text-sm font-medium">Expiration</th>
                <th class="p-4 text-dark-400 text-sm font-medium">Statut</th>
                <th class="p-4 text-dark-400 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (coupon of coupons; track coupon.id) {
                <tr class="border-b border-dark-800/50 hover:bg-dark-800/30 transition-colors">
                  <td class="p-4">
                    <code class="px-3 py-1 bg-dark-800 rounded-lg text-primary-400 font-mono text-sm">{{ coupon.code }}</code>
                  </td>
                  <td class="p-4 text-dark-300 text-sm">{{ coupon.description }}</td>
                  <td class="p-4 text-primary-400 font-semibold text-sm">{{ coupon.discountPercentage }}%</td>
                  <td class="p-4 text-dark-300 text-sm">{{ coupon.usedCount }} / {{ coupon.usageLimit }}</td>
                  <td class="p-4 text-dark-400 text-sm">{{ coupon.expiresAt | date:'dd/MM/yyyy' }}</td>
                  <td class="p-4">
                    <span [class]="coupon.active ? 'badge-success' : 'badge-danger'">
                      {{ coupon.active ? 'Actif' : 'Inactif' }}
                    </span>
                  </td>
                  <td class="p-4">
                    <div class="flex items-center gap-2">
                      <!-- Edit button -->
                      <button
                        (click)="openEditForm(coupon)"
                        title="Modifier"
                        class="w-8 h-8 flex items-center justify-center rounded-lg bg-dark-700 hover:bg-primary-600 text-dark-400 hover:text-white transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </button>
                      <!-- Delete button -->
                      <button
                        (click)="askDelete(coupon)"
                        title="Supprimer"
                        class="w-8 h-8 flex items-center justify-center rounded-lg bg-dark-700 hover:bg-red-600 text-dark-400 hover:text-white transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              }
              @if (coupons.length === 0 && !loading()) {
                <tr><td colspan="7" class="p-12 text-center text-dark-500">Aucun coupon</td></tr>
              }
              @if (loading()) {
                <tr><td colspan="7" class="p-12 text-center text-dark-500">Chargement...</td></tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AdminPromotionsComponent implements OnInit {
  showForm = signal(false);
  editingId = signal<number | null>(null);
  saving = signal(false);
  loading = signal(false);
  deleting = signal(false);
  deletingId = signal<number | null>(null);
  deletingCode = signal('');
  errorMsg = signal('');
  successMsg = signal('');

  coupons: any[] = [];

  form = this.emptyForm();

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadCoupons();
  }

  loadCoupons(): void {
    this.loading.set(true);
    this.api.get<any>('admin/coupons').subscribe({
      next: (res) => { this.coupons = res.data ?? res ?? []; this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  openCreateForm(): void {
    this.form = this.emptyForm();
    this.editingId.set(null);
    this.errorMsg.set('');
    this.showForm.set(true);
  }

  openEditForm(coupon: any): void {
    this.editingId.set(coupon.id);
    this.errorMsg.set('');
    // Format ISO date → yyyy-MM-dd for date input
    const toDate = (iso: string) => iso ? iso.substring(0, 10) : '';
    this.form = {
      code: coupon.code,
      description: coupon.description,
      discountPercentage: coupon.discountPercentage,
      usageLimit: coupon.usageLimit,
      startsAt: toDate(coupon.startsAt),
      expiresAt: toDate(coupon.expiresAt),
      active: coupon.active
    };
    this.showForm.set(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  saveCoupon(): void {
    this.errorMsg.set('');
    if (!this.form.startsAt || !this.form.expiresAt) {
      this.errorMsg.set('Les dates sont obligatoires.'); return;
    }
    if (new Date(this.form.expiresAt) <= new Date(this.form.startsAt)) {
      this.errorMsg.set('La date d\'expiration doit être après la date de début.'); return;
    }

    this.saving.set(true);
    const payload = {
      ...this.form,
      code: this.form.code.toUpperCase().trim(),
      startsAt: new Date(this.form.startsAt).toISOString(),
      expiresAt: new Date(this.form.expiresAt).toISOString()
    };

    const id = this.editingId();
    const req = id
      ? this.api.put<any>(`admin/coupons/${id}`, payload)
      : this.api.post<any>('admin/coupons', payload);

    req.subscribe({
      next: (res) => {
        const saved = res.data;
        if (id) {
          this.coupons = this.coupons.map(c => c.id === id ? saved : c);
          this.successMsg.set(`Coupon "${saved.code}" mis à jour.`);
        } else {
          this.coupons = [saved, ...this.coupons];
          this.successMsg.set(`Coupon "${saved.code}" créé avec succès !`);
        }
        this.saving.set(false);
        this.showForm.set(false);
        this.editingId.set(null);
        setTimeout(() => this.successMsg.set(''), 4000);
      },
      error: (err) => {
        this.errorMsg.set(err?.error?.message ?? 'Erreur lors de l\'enregistrement.');
        this.saving.set(false);
      }
    });
  }

  askDelete(coupon: any): void {
    this.deletingId.set(coupon.id);
    this.deletingCode.set(coupon.code);
  }

  confirmDelete(): void {
    const id = this.deletingId();
    if (!id) return;
    this.deleting.set(true);
    this.api.delete<any>(`admin/coupons/${id}`).subscribe({
      next: () => {
        this.coupons = this.coupons.filter(c => c.id !== id);
        this.successMsg.set('Coupon supprimé.');
        this.deleting.set(false);
        this.deletingId.set(null);
        setTimeout(() => this.successMsg.set(''), 4000);
      },
      error: () => {
        this.errorMsg.set('Erreur lors de la suppression.');
        this.deleting.set(false);
        this.deletingId.set(null);
      }
    });
  }

  cancelForm(): void {
    this.showForm.set(false);
    this.editingId.set(null);
    this.errorMsg.set('');
  }

  private emptyForm() {
    return { code: '', description: '', discountPercentage: 10, usageLimit: 100, startsAt: '', expiresAt: '', active: true };
  }
}
