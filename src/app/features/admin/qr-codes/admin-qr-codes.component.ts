import { Component, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { QrService } from "../../../core/services/qr.service";
import { QrCode, QrCodeStats } from "../../../core/models/interfaces";
import { environment } from "../../../../environments/environment";

const QR_API_BASE = "https://api.qrserver.com/v1/create-qr-code";

@Component({
  selector: "app-admin-qr-codes",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-black text-dark-100">Génération QR</h1>
          <p class="text-dark-400 text-sm mt-1">
            Gérer les codes QR pré-générés pour les produits QR
          </p>
        </div>
        @if (stats()) {
          <div class="flex gap-4 text-sm">
            <div class="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2 text-center">
              <p class="text-emerald-400 text-2xl font-bold">{{ stats()!.free }}</p>
              <p class="text-emerald-500/70 text-xs">Libres</p>
            </div>
            <div class="bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2 text-center">
              <p class="text-amber-400 text-2xl font-bold">{{ stats()!.assigned }}</p>
              <p class="text-amber-500/70 text-xs">Attribués</p>
            </div>
          </div>
        }
      </div>

      <div class="glass rounded-2xl p-6">
        <h2 class="text-lg font-bold text-dark-100 mb-4">Générer des QR codes vides</h2>
        <div class="flex gap-3 items-end">
          <div>
            <label class="text-dark-500 text-xs font-medium block mb-1">Nombre de codes</label>
            <input
              type="number"
              [(ngModel)]="generateCount"
              min="1"
              max="1000"
              class="w-32 bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-dark-100 placeholder-dark-500 focus:outline-none focus:border-primary-500/50"
            />
          </div>
          <button
            (click)="generate()"
            [disabled]="generating()"
            class="px-6 py-2.5 bg-primary-500 text-dark-950 font-semibold rounded-xl hover:bg-primary-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {{ generating() ? "Génération..." : "Générer" }}
          </button>
        </div>
        @if (generateMsg()) {
          <p class="mt-3 text-sm" [class.text-green-400]="generateSuccess()" [class.text-red-400]="!generateSuccess()">{{ generateMsg() }}</p>
        }
      </div>

      <div class="glass rounded-2xl overflow-hidden">
        <div class="p-4 border-b border-dark-800 flex items-center justify-between flex-wrap gap-2">
          <h2 class="text-lg font-bold text-dark-100">Tous les codes QR</h2>
          <div class="flex gap-2">
            <button (click)="deleteAllFree()" [disabled]="deleting() || stats()?.free === 0"
              class="text-xs px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              Supprimer tous les libres
            </button>
            <select [(ngModel)]="statusFilter" (change)="applyFilter()"
              class="bg-dark-800 border border-dark-700 rounded-lg px-3 py-1.5 text-sm text-dark-300 focus:outline-none focus:border-primary-500/50">
              <option value="ALL">Tous</option>
              <option value="FREE">Libres</option>
              <option value="ASSIGNED">Attribués</option>
            </select>
          </div>
        </div>

        @if (loading()) {
          <div class="p-12 text-center text-dark-500">
            <div class="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            Chargement...
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="text-left border-b border-dark-800 bg-dark-900/50">
                  <th class="p-4 text-dark-400 text-xs font-medium uppercase tracking-wider">N°</th>
                  <th class="p-4 text-dark-400 text-xs font-medium uppercase tracking-wider">Code</th>
                  <th class="p-4 text-dark-400 text-xs font-medium uppercase tracking-wider">Statut</th>
                  <th class="p-4 text-dark-400 text-xs font-medium uppercase tracking-wider">Client</th>
                  <th class="p-4 text-dark-400 text-xs font-medium uppercase tracking-wider">Produit</th>
                  <th class="p-4 text-dark-400 text-xs font-medium uppercase tracking-wider">Commande</th>
                  <th class="p-4 text-dark-400 text-xs font-medium uppercase tracking-wider">Crée le</th>
                  <th class="p-4 text-dark-400 text-xs font-medium uppercase tracking-wider">Détails</th>
                  <th class="p-4 text-dark-400 text-xs font-medium uppercase tracking-wider">Suppr.</th>
                </tr>
              </thead>
              <tbody>
                @for (code of filteredCodes(); track code.id) {
                  <tr class="border-b border-dark-800/50 hover:bg-dark-800/20 transition-colors">
                    <td class="p-4 text-dark-100 font-bold text-sm">#{{ code.id }}</td>
                    <td class="p-4">
                      <code class="text-xs bg-dark-800 px-2 py-1 rounded text-primary-400 font-mono">{{ code.code.slice(0, 8) }}...</code>
                    </td>
                    <td class="p-4">
                      @if (code.status === 'FREE') {
                        <span class="text-xs px-2 py-1 rounded-lg font-medium bg-emerald-500/20 text-emerald-400">Libre</span>
                      } @else {
                        <span class="text-xs px-2 py-1 rounded-lg font-medium bg-amber-500/20 text-amber-400">Attribué</span>
                      }
                    </td>
                    <td class="p-4 text-dark-300 text-sm">{{ code.customerName || "—" }}</td>
                    <td class="p-4 text-dark-300 text-sm">{{ code.productName || "—" }}</td>
                    <td class="p-4 text-dark-300 text-sm">{{ code.orderNumber || "—" }}</td>
                    <td class="p-4 text-dark-400 text-sm">{{ code.createdAt | date:'dd/MM/yy' }}</td>
                    <td class="p-4">
                      <button (click)="openDetail(code)"
                        class="text-dark-400 hover:text-primary-400 transition-colors p-1.5 hover:bg-primary-500/10 rounded-lg"
                        title="Détails">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                      </button>
                    </td>
                    <td class="p-4">
                      <button (click)="deleteCode(code)"
                        class="text-red-500/70 hover:text-red-400 transition-colors p-1.5 hover:bg-red-500/10 rounded-lg"
                        title="Supprimer">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                }
                @if (filteredCodes().length === 0) {
                  <tr>
                    <td colspan="9" class="p-12 text-center text-dark-500">
                      Aucun code QR trouvé
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>

    @if (selectedCode()) {
      @let code = selectedCode()!;
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/75 backdrop-blur-sm"
        (click)="selectedCode.set(null)">
        <div class="glass rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
          (click)="$event.stopPropagation()">
          <div class="p-6 border-b border-dark-800 flex items-center justify-between sticky top-0 bg-dark-900/95 backdrop-blur-sm">
            <h2 class="text-xl font-bold text-dark-100">Détail QR Code</h2>
            <button (click)="selectedCode.set(null)"
              class="text-dark-400 hover:text-dark-100 transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="p-6 space-y-4">
            <div class="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p class="text-dark-500 text-xs uppercase tracking-wider">N°</p>
                <p class="text-dark-100 font-bold text-lg">#{{ code.id }}</p>
              </div>
              <div>
                <p class="text-dark-500 text-xs uppercase tracking-wider">UUID</p>
                <p class="text-dark-100 font-mono text-xs">{{ code.code }}</p>
              </div>
              <div>
                <p class="text-dark-500 text-xs uppercase tracking-wider">Statut</p>
                <p class="font-medium" [class.text-emerald-400]="code.status === 'FREE'" [class.text-amber-400]="code.status !== 'FREE'">
                  {{ code.status === 'FREE' ? 'Libre' : 'Attribué' }}
                </p>
              </div>
              @if (code.customerName) {
                <div>
                  <p class="text-dark-500 text-xs uppercase tracking-wider">Client</p>
                  <p class="text-dark-100 font-medium">{{ code.customerName }}</p>
                </div>
              }
              @if (code.productName) {
                <div>
                  <p class="text-dark-500 text-xs uppercase tracking-wider">Produit</p>
                  <p class="text-dark-100 font-medium">{{ code.productName }}</p>
                </div>
              }
              @if (code.orderNumber) {
                <div>
                  <p class="text-dark-500 text-xs uppercase tracking-wider">Commande</p>
                  <p class="text-dark-100 font-medium">{{ code.orderNumber }}</p>
                </div>
              }
            </div>

            <hr class="border-dark-800"/>

            @if (code.status === 'ASSIGNED' && code.content) {
              <div>
                <p class="text-dark-500 text-xs uppercase tracking-wider mb-2">
                  {{ code.qrType === 'PHOTO' ? '📷 Photo' : '🔗 Lien' }}
                </p>
                @if (code.qrType === 'PHOTO') {
                  <img [src]="code.content" class="w-full rounded-xl border border-dark-700 max-h-64 object-contain bg-dark-900"/>
                } @else {
                  <a [href]="code.content" target="_blank" rel="noopener noreferrer"
                    class="text-primary-400 underline break-all text-sm">{{ code.content }}</a>
                }
              </div>
              <hr class="border-dark-800"/>
            }

            <div class="text-center">
              <p class="text-dark-500 text-xs uppercase tracking-wider mb-3">QR Code Image</p>
              <p class="text-dark-400 text-xs mb-2">
                @if (code.status === 'ASSIGNED' && code.qrType === 'LINK') {
                  Le QR redirige <strong>directement</strong> vers le lien du client (302)
                } @else if (code.status === 'ASSIGNED' && code.qrType === 'PHOTO') {
                  Le QR redirige vers la page d'affichage photo
                } @else {
                  Le QR redirige vers la page d'accueil (QR non attribué)
                }
              </p>
              <div class="inline-block bg-white p-3 rounded-xl">
                <img [src]="qrImageUrl(code.code)"
                  alt="QR Code"
                  class="w-48 h-48 mx-auto" />
              </div>
              <div class="flex gap-3 justify-center mt-4">
                <a [href]="qrImageUrl(code.code)" download="qr-{{ code.code.slice(0,8) }}.png"
                  class="btn-primary text-sm flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  Télécharger QR
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `,
})
export class AdminQrCodesComponent implements OnInit {
  codes = signal<QrCode[]>([]);
  filteredCodes = signal<QrCode[]>([]);
  loading = signal(true);
  generating = signal(false);
  generateCount = 50;
  generateMsg = signal("");
  generateSuccess = signal(false);
  selectedCode = signal<QrCode | null>(null);
  statusFilter = "ALL";
  stats = signal<QrCodeStats | null>(null);
  deleting = signal(false);

  constructor(private qrService: QrService) {}

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.qrService.getAllQrCodes().subscribe({
      next: (res) => {
        this.codes.set(res.data || []);
        this.applyFilter();
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
    this.qrService.getQrCodeStats().subscribe({
      next: (res) => this.stats.set(res.data || null),
    });
  }

  generate(): void {
    const count = this.generateCount;
    if (count < 1) return;
    this.generating.set(true);
    this.generateMsg.set("");
    this.generateSuccess.set(false);
    this.qrService.generateQrCodes(count).subscribe({
      next: (res) => {
        this.generating.set(false);
        this.generateSuccess.set(true);
        this.generateMsg.set(`${count} codes QR générés avec succès !`);
        this.load();
        setTimeout(() => this.generateMsg.set(""), 3000);
      },
      error: () => {
        this.generating.set(false);
        this.generateSuccess.set(false);
        this.generateMsg.set("Erreur lors de la génération");
      },
    });
  }

  deleteCode(code: QrCode): void {
    if (!confirm(`Supprimer le QR code #${code.id} ?`)) return;
    this.deleting.set(true);
    this.qrService.deleteQrCode(code.id).subscribe({
      next: () => {
        this.deleting.set(false);
        this.load();
      },
      error: () => {
        this.deleting.set(false);
        alert("Erreur lors de la suppression");
      },
    });
  }

  deleteAllFree(): void {
    const freeCount = this.stats()?.free || 0;
    if (freeCount === 0) return;
    if (!confirm(`Supprimer tous les ${freeCount} codes QR libres ?`)) return;
    this.deleting.set(true);
    const freeCodes = this.codes().filter(c => c.status === 'FREE');
    let deleted = 0;
    freeCodes.forEach(c => {
      this.qrService.deleteQrCode(c.id).subscribe({
        next: () => {
          deleted++;
          if (deleted === freeCodes.length) {
            this.deleting.set(false);
            this.load();
          }
        },
        error: () => {
          deleted++;
          if (deleted === freeCodes.length) {
            this.deleting.set(false);
            this.load();
          }
        },
      });
    });
  }

  applyFilter(): void {
    if (this.statusFilter === "ALL") {
      this.filteredCodes.set([...this.codes()]);
    } else {
      this.filteredCodes.set(this.codes().filter(c => c.status === this.statusFilter));
    }
  }

  openDetail(code: QrCode): void {
    this.selectedCode.set(code);
  }

  qrImageUrl(code: string): string {
    const redirectUrl = `${environment.apiUrl}/qr/r/${code}`;
    return `${QR_API_BASE}?size=300x300&data=${encodeURIComponent(redirectUrl)}`;
  }
}
